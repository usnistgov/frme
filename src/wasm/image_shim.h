/*
 * This software was developed at the National Institute of Standards and
 * Technology (NIST) by employees of the Federal Government in the course
 * of their official duties. Pursuant to title 17 Section 105 of the
 * United States Code, this software is not subject to copyright protection
 * and is in the public domain. NIST assumes no responsibility whatsoever for
 * its use by other parties, and makes no guarantees, expressed or implied,
 * about its quality, reliability, or any other characteristic.
 */

#ifndef IMAGE_SHIM_H_
#define IMAGE_SHIM_H_

#include <memory>
#include <string>

#include <be_image_image.h>

/** Trivial image representation for use on the JavaScript client side. */
class ImageShim
{
public:
	/** Instantiate 0x0 image */
	ImageShim() = default;

	/** Instantiate from BiometricEvaluation::Image::Image */
	ImageShim(
	    std::shared_ptr<BiometricEvaluation::Image::Image> beImage);

	/** Is the contents valid? */
	explicit
	operator bool()
	    const;

	/**
	 * @brief
	 * Obtain Base64 representation of PNG-encoded image.
	 *
	 * @param inlineImagePrefix
	 * true to include inline image prefix (to use as in img tag's src
	 * attribute), false to only return encoded data.
	 *
	 * @return
	 * Base64 representation of encoded PNG stream
	 *
	 * @note
	 * Encoding is cached.
	 */
	std::string
	getBase64PNG(
	    bool inlineImagePrefix = true)
	    const;

	/** @return Width of image in pixels */
	uint32_t
	getWidth()
	    const;
	/** @return Height of image in pixels */
	uint32_t
	getHeight()
	    const;
	/** @return Resolution of image, in PPI */
	uint16_t
	getPPI()
	    const;

private:
	std::shared_ptr<BiometricEvaluation::Image::Image> image_{};
	/**
	 * @brief
	 * Base64 representation of encoded PNG image.
	 *
	 * @note
	 * Populated exactly once after first call to getBase64PNG().
	 */
	mutable std::string base64PNG_{};
};

#endif /* EASY_IMAGE_H_ */
