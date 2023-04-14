/*
 * This software was developed at the National Institute of Standards and
 * Technology (NIST) by employees of the Federal Government in the course
 * of their official duties. Pursuant to title 17 Section 105 of the
 * United States Code, this software is not subject to copyright protection
 * and is in the public domain. NIST assumes no responsibility whatsoever for
 * its use by other parties, and makes no guarantees, expressed or implied,
 * about its quality, reliability, or any other characteristic.
 */

#include "image_shim.h"

#include <string>

#include <emscripten.h>
#include <emscripten/bind.h>
#include <png.h>

#include <be_text.h>

namespace BE = BiometricEvaluation;

static void
writeCallback(
    png_structp png_ptr, png_bytep data, png_size_t length)
{
	std::vector<uint8_t> *encodedPNG = static_cast<std::vector<uint8_t>*>(
	    png_get_io_ptr(png_ptr));
	encodedPNG->insert(encodedPNG->end(), data, data + length);
}

static std::vector<uint8_t>
rawToPNG(
    const std::vector<uint8_t> &rawData,
    const bool hasAlphaChannel,
    const uint16_t colorDepth,
    const uint16_t bitDepth,
    const uint32_t width,
    const uint32_t height)
{
	if (rawData.size() == 0)
		return {};

	png_structp png_ptr = png_create_write_struct(PNG_LIBPNG_VER_STRING,
	    nullptr, nullptr, nullptr);
	if (png_ptr == nullptr)
		return {};

	png_infop info_ptr = png_create_info_struct(png_ptr);
	if (info_ptr == nullptr) {
		png_destroy_write_struct(&png_ptr, nullptr);
		return {};
	}

	if (setjmp(png_jmpbuf(png_ptr))) {
		png_destroy_write_struct(&png_ptr, &info_ptr);
		return {};
	}

	/* Not 100%, but close enough for now */
	const auto bytesPerPixel = colorDepth / bitDepth;
	auto colorType = PNG_COLOR_TYPE_RGB;
	if (hasAlphaChannel)
		colorType = PNG_COLOR_TYPE_RGBA;
	if (colorDepth == bitDepth)
		colorType = PNG_COLOR_TYPE_GRAY;

	png_set_IHDR(png_ptr, info_ptr, width, height, bitDepth,
	    colorType, PNG_INTERLACE_NONE,
            PNG_COMPRESSION_TYPE_DEFAULT, PNG_FILTER_TYPE_DEFAULT);

	std::vector<uint8_t> rawDataCopy{rawData};
        std::vector<uint8_t*> rowPointers(height);
        for (size_t y{}; y < height; ++y) {
        	rowPointers[y] = &rawDataCopy.at(y * width * bytesPerPixel);
        }
        png_set_rows(png_ptr, info_ptr, &rowPointers[0]);

	std::vector<uint8_t> encodedPNG{};
        png_set_write_fn(png_ptr, &encodedPNG, writeCallback, nullptr);
	png_write_png(png_ptr, info_ptr, PNG_TRANSFORM_IDENTITY, nullptr);
	png_destroy_write_struct(&png_ptr, nullptr);

	return (encodedPNG);
}

static std::vector<uint8_t>
rawToPNG(
    std::shared_ptr<BiometricEvaluation::Image::Image> image)
{
	if (!image)
		return {};

	const std::vector<uint8_t> v = image->getRawData().to_vector();
	return (rawToPNG(v,
	    image->hasAlphaChannel(),
	    image->getColorDepth(),
	    image->getBitDepth(),
	    image->getDimensions().xSize,
	    image->getDimensions().ySize));
}

ImageShim::ImageShim(
    std::shared_ptr<BE::Image::Image> image) :
    image_{image}
{
	if (!this->image_)
		throw std::runtime_error{"Image is null"};
}

std::string
ImageShim::getBase64PNG(
    bool inlineImagePrefix)
    const
{
	if (this->base64PNG_.empty()) {
		const auto pngBytes = rawToPNG(this->image_);

		BE::Memory::uint8Array aa(pngBytes.size());
		aa.copy(pngBytes.data(), pngBytes.size());
		this->base64PNG_ = BiometricEvaluation::Text::encodeBase64(aa);
	}

	if (inlineImagePrefix)
		return ("data:image/png;base64," + this->base64PNG_);
	else
		return (this->base64PNG_);

}

uint32_t
ImageShim::getWidth()
    const
{
	if (!this->image_)
		return (0);

	return (this->image_->getDimensions().xSize);
}

uint32_t
ImageShim::getHeight()
    const
{
	if (!this->image_)
		return (0);

	return (this->image_->getDimensions().ySize);
}

uint16_t
ImageShim::getPPI()
    const
{
	if (!this->image_)
		return (0);

	return (static_cast<uint16_t>(std::round(
	    this->image_->getResolution().toUnits(
	    BiometricEvaluation::Image::Resolution::Units::PPI).xRes)));
}

ImageShim::operator bool()
    const
{
	return (this->image_ != nullptr);
}

EMSCRIPTEN_BINDINGS(easyimage) {
	emscripten::class_<ImageShim>("ImageShim")
	    .function("getBase64PNG", &ImageShim::getBase64PNG)
	    .function("containsImage", emscripten::optional_override(
	        [](const ImageShim &i) { return static_cast<bool>(i); }))
	    ;
}
