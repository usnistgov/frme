/*
 * This software was developed at the National Institute of Standards and
 * Technology (NIST) by employees of the Federal Government in the course
 * of their official duties. Pursuant to title 17 Section 105 of the
 * United States Code, this software is not subject to copyright protection
 * and is in the public domain. NIST assumes no responsibility whatsoever for
 * its use by other parties, and makes no guarantees, expressed or implied,
 * about its quality, reliability, or any other characteristic.
 */

#include <emscripten.h>
#include <emscripten/bind.h>

#include <be_data_interchange_an2k.h>
#include <be_image_image.h>
#include <be_io_utility.h>
#include <be_text.h>

#include "frme_an2k.h"

namespace BE = BiometricEvaluation;

static std::vector<BE::Finger::AN2KMinutiaeDataRecord>
getUnassociatedMinutiaeData(
    const BE::DataInterchange::AN2KRecord &an2k)
{
	std::vector<BE::Finger::AN2KMinutiaeDataRecord> ret{};

	for (const auto &m : an2k.getMinutiaeDataRecordSet()) {
		bool foundAssociatedImage{false};
		for (const auto &i : an2k.getFingerFixedResolutionCaptures()) {
			if (m.getIDC() == i.getIDC()) {
				foundAssociatedImage = true;
				break;
			}

		}
		if (foundAssociatedImage)
			continue;

		for (const auto &i : an2k.getFingerCaptures()) {
			if (m.getIDC() == i.getIDC()) {
				foundAssociatedImage = true;
				break;
			}
		}
		if (foundAssociatedImage)
			continue;

		for (const auto &i : an2k.getPalmCaptures()) {
			if (m.getIDC() == i.getIDC()) {
				foundAssociatedImage = true;
				break;
			}
		}
		if (foundAssociatedImage)
			continue;

		for (const auto &i : an2k.getFingerLatents()) {
			if (m.getIDC() == i.getIDC()) {
				foundAssociatedImage = true;
				break;
			}
		}
		if (foundAssociatedImage)
			continue;

		ret.push_back(m);
	}

	return (ret);
}

/******************************************************************************/

bool
hasFrictionRidgeImagery(
    const BE::DataInterchange::AN2KRecord &an2k)
{
	for (const auto &i : an2k.getFingerFixedResolutionCaptures())
		return (true);
	for (const auto &i : an2k.getFingerCaptures())
		return (true);
	for (const auto &i : an2k.getPalmCaptures())
		return (true);
	for (const auto &i : an2k.getFingerLatents())
		return (true);

	return (false);
}

bool
hasMinutiaeDataFormat(
    const BE::DataInterchange::AN2KRecord &an2k,
    const PointSystem pointSystem)
{
	switch (pointSystem) {
	case PointSystem::Legacy:
		for (const auto &mdr : an2k.getMinutiaeDataRecordSet())
			if (mdr.getAN2K7Minutiae() != nullptr)
				return (true);
		return (false);

	case PointSystem::EFS:
		for (const auto &mdr : an2k.getMinutiaeDataRecordSet())
			if (mdr.getAN2K11EFS() != nullptr)
				return (true);
		return (false);
	case PointSystem::IAFIS:
		[[fallthrough]];
	case PointSystem::Cogent:
		[[fallthrough]];
	case PointSystem::Motorola:
		[[fallthrough]];
	case PointSystem::Sagem:
		[[fallthrough]];
	case PointSystem::NEC:
		[[fallthrough]];
	case PointSystem::Identix:
		[[fallthrough]];
	case PointSystem::Other:
		[[fallthrough]];
	case PointSystem::M1:
		for (const auto &mdr : an2k.getMinutiaeDataRecordSet())
			if (!mdr.getRegisteredVendorBlock(
			    static_cast<BE::Feature::MinutiaeFormat>(
			    pointSystem)).empty())
				return (true);
		return (false);
	default:
		throw std::runtime_error{"Unrecognized PointSystem"};
	}
}

std::vector<std::pair<ImageShim,
    std::vector<BE::Finger::AN2KMinutiaeDataRecord>>>
getFrictionRidgeImagesWithMinutiaeData(
    const BE::DataInterchange::AN2KRecord &an2k)
{
	std::vector<std::pair<ImageShim,
	    std::vector<BE::Finger::AN2KMinutiaeDataRecord>>> ret{};

	for (const auto &i : an2k.getFingerFixedResolutionCaptures()) {
		ret.emplace_back(i.getImage(), i.getMinutiaeDataRecordSet());
	}
	for (const auto &i : an2k.getFingerCaptures()) {
		ret.emplace_back(i.getImage(), i.getMinutiaeDataRecordSet());
	}
	for (const auto &i : an2k.getPalmCaptures()) {
		ret.emplace_back(i.getImage(), i.getMinutiaeDataRecordSet());
	}
	for (const auto &i : an2k.getFingerLatents()) {
		ret.emplace_back(i.getImage(), i.getMinutiaeDataRecordSet());
	}

	return (ret);
}

std::vector<std::pair<ImageShim,
    std::vector<BE::Finger::AN2KMinutiaeDataRecord>>>
getAllRecords(
    const BE::DataInterchange::AN2KRecord &an2k)
{
	auto ret = getFrictionRidgeImagesWithMinutiaeData(an2k);

	const auto minOnly = getUnassociatedMinutiaeData(an2k);
	for (const auto &m : minOnly) {
		ret.emplace_back(ImageShim(),
		    std::vector<BE::Finger::AN2KMinutiaeDataRecord>{m});
	}

	return (ret);
}

std::vector<std::pair<PointSystem, std::vector<PointShim>>>
getAllPoints(
    const ImageShim &image,
    const std::vector<BE::Finger::AN2KMinutiaeDataRecord> &mdrs)
{
	if (!image)
		return {};

	std::vector<std::pair<PointSystem, std::vector<PointShim>>> pointSets{};

	for (const auto &mdr : mdrs) {
		/*
		 * Legacy minutiae
		 */
		const auto minLegacy = mdr.getAN2K7Minutiae();
		if (minLegacy != nullptr) {
			std::vector<PointShim> points{};
			for (const auto &point :
			    minLegacy->getMinutiaPoints()) {
				points.emplace_back(point.coordinate.x,
				    point.coordinate.y, point.theta,
				    point.has_type ?
				    PointShim::convertType(point.type) :
				    PointShim::Type::Other);
				points.back().convertFromSystemRepresentation(
				    PointSystem::Legacy, image);

			}
			if (!points.empty())
				pointSets.emplace_back(PointSystem::Legacy,
				    points);
		}

		/*
		 * EFS minutiae
		 */
		const auto efs = mdr.getAN2K11EFS();
		if (efs != nullptr) {
			std::vector<PointShim> points{};
			for (const auto &point : efs->getMPS()) {
				points.emplace_back(point.coordinate.x,
				    point.coordinate.y, point.theta,
				    point.has_type ?
				    PointShim::convertType(point.type) :
				    PointShim::Type::Other);
				points.back().convertFromSystemRepresentation(
				    PointSystem::EFS, image);

			}
			if (!points.empty())
				pointSets.emplace_back(PointSystem::EFS,
				    points);
		}
	}

	return (pointSets);
}

/******************************************************************************/

EMSCRIPTEN_BINDINGS(frme)
{
	/*
	 * Bindings for functions.
	 */
	emscripten::function("hasFrictionRidgeImagery",
	    &hasFrictionRidgeImagery);
	emscripten::function("getAllPoints", &getAllPoints);
	emscripten::function("getAllRecords", &getAllRecords);
	emscripten::function("hasMinutiaeDataFormat", &hasMinutiaeDataFormat);
	emscripten::function("getFrictionRidgeImagesWithMinutiaeData",
	    &getFrictionRidgeImagesWithMinutiaeData);

	/*
	 * Bindings for DataInterchange::AN2KRecord.
	 */
	emscripten::class_<BE::DataInterchange::AN2KRecord>("AN2K")
	    .constructor<std::string>()
	    .class_function("isAN2K", emscripten::select_overload<
	        bool(const std::string&)>(
	        &BE::DataInterchange::AN2KRecord::isAN2KRecord));

	/*
	 * Bindings for AN2KMinutiaeDataRecord.
	 */
	emscripten::class_<BE::Finger::AN2KMinutiaeDataRecord>(
	    "AN2KMinutiaeDataRecord");
	emscripten::register_vector<BE::Finger::AN2KMinutiaeDataRecord>(
	    "VectorAN2KMinutiaeDataRecord");


	/*
	 * Bindings for PointSystem.
	 */
	emscripten::value_object<std::pair<PointSystem,
	        std::vector<PointShim>>>("PointSystemVectorPointShimPair")
	    .field("system", &std::pair<PointSystem,
	        std::vector<PointShim>>::first)
	    .field("points", &std::pair<PointSystem,
	        std::vector<PointShim>>::second);

	/*
	 * Combinations/Collections.
	 */
	emscripten::value_object<std::pair<ImageShim,
	        std::vector<BE::Finger::AN2KMinutiaeDataRecord>>>(
	        "ImageShimMinutiaeDataPair")
	    .field("image", &std::pair<ImageShim,
	        std::vector<BE::Finger::AN2KMinutiaeDataRecord>>::first)
	    .field("minutiaeDataRecords", &std::pair<ImageShim,
	        std::vector<BE::Finger::AN2KMinutiaeDataRecord>>::second);

	emscripten::register_vector<std::pair<FrictionRidgeImage,
	    std::vector<BE::Finger::AN2KMinutiaeDataRecord>>>(
	    "VectorImageMinutiaeDataPair");
	emscripten::register_vector<std::pair<ImageShim,
	    std::vector<BE::Finger::AN2KMinutiaeDataRecord>>>(
	    "VectorImageShimMinutiaeDataPair");

	emscripten::register_vector<std::pair<PointSystem,
	    std::vector<PointShim>>>("VectorPointSystemVectorPointShimPair");
}

/*
 * Unused bindings.
 */

#if 0
EMSCRIPTEN_BINDINGS(unused)
{
	/*
	 * Bindings for uint8Array.
	 */
	emscripten::register_vector<uint8_t>("VectorUInt8T");
	emscripten::class_<BE::Memory::uint8Array>("BE_uint8Array")
	    .function("to_vector", &BE::Memory::uint8Array::to_vector);

	/*
	 * Bindings for Image::Image.
	 */
	emscripten::class_<BE::Image::Image>("BEImageImage")
	    .smart_ptr<std::shared_ptr<BE::Image::Image>>("BEImageImage");

	/*
	 * Bindings for Finger::AN2KViewFixedResolution.
	 */
	emscripten::class_<BE::Finger::AN2KViewFixedResolution>(
	    "Finger_AN2KViewFixedResolution");

	/*
	 * Bindings for FrictionRidgeImage (variant).
	 */
	emscripten::class_<FrictionRidgeImage>("FrictionRidgeImage");
	emscripten::register_vector<FrictionRidgeImage>(
	    "VectorFrictionRidgeImage");

	/*
	 * Combinations/Collections.
	 */
	emscripten::class_<std::pair<FrictionRidgeImage, std::vector<
	    BE::Finger::AN2KMinutiaeDataRecord>>>("ImageMinutiaeDataPair");
}
#endif
