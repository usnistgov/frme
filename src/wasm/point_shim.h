/*
 * This software was developed at the National Institute of Standards and
 * Technology (NIST) by employees of the Federal Government in the course
 * of their official duties. Pursuant to title 17 Section 105 of the
 * United States Code, this software is not subject to copyright protection
 * and is in the public domain. NIST assumes no responsibility whatsoever for
 * its use by other parties, and makes no guarantees, expressed or implied,
 * about its quality, reliability, or any other characteristic.
 */

#ifndef POINT_SHIM_H_
#define POINT_SHIM_H_

#include <string>
#include <type_traits>
#include <vector>

#include <be_feature_minutiae.h>

/* Forward declaration */
class ImageShim;

/**
 * @brief
 * Point systems possible in ANSI/NIST-ITL 1-2011: Update 2015.
 *
 * @note
 * Reuses value of BiometricEvaluation::Feature::MinutiaeFormat where possible,
 * which is all except EFS.
 */
enum class PointSystem
{
	Legacy = static_cast<std::underlying_type_t<
	    BiometricEvaluation::Feature::MinutiaeFormat>>(
	        BiometricEvaluation::Feature::MinutiaeFormat::AN2K7),
	IAFIS = static_cast<std::underlying_type_t<
	    BiometricEvaluation::Feature::MinutiaeFormat>>(
	        BiometricEvaluation::Feature::MinutiaeFormat::IAFIS),
	Cogent = static_cast<std::underlying_type_t<
	    BiometricEvaluation::Feature::MinutiaeFormat>>(
	        BiometricEvaluation::Feature::MinutiaeFormat::Cogent),
	Motorola = static_cast<std::underlying_type_t<
	    BiometricEvaluation::Feature::MinutiaeFormat>>(
	        BiometricEvaluation::Feature::MinutiaeFormat::Motorola),
	Sagem = static_cast<std::underlying_type_t<
	    BiometricEvaluation::Feature::MinutiaeFormat>>(
	        BiometricEvaluation::Feature::MinutiaeFormat::Sagem),
	NEC = static_cast<std::underlying_type_t<
	    BiometricEvaluation::Feature::MinutiaeFormat>>(
	        BiometricEvaluation::Feature::MinutiaeFormat::NEC),
	Identix = static_cast<std::underlying_type_t<
	    BiometricEvaluation::Feature::MinutiaeFormat>>(
	        BiometricEvaluation::Feature::MinutiaeFormat::Identix),
	M1 = static_cast<std::underlying_type_t<
	    BiometricEvaluation::Feature::MinutiaeFormat>>(
	        BiometricEvaluation::Feature::MinutiaeFormat::M1),
	Other = static_cast<std::underlying_type_t<
	    BiometricEvaluation::Feature::MinutiaeFormat>>(
	        BiometricEvaluation::Feature::MinutiaeFormat::Other),
	EFS
};

/** @return Human-readable name for a PointSystem. */
static std::string
getPointSystemName(
    const PointSystem system);

/** Trivial point representation for use on the JavaScript client side. */
class PointShim
{
public:
	/** Minutia type */
	enum class Type
	{
		RidgeEnding,
		Bifurcation,
		Core,
		Delta,
		Other = 0
	};

	/**********************************************************************/

	/** Instantiate undefined minutia [point (0,0), 0, Other] */
	PointShim() = default;

	/** Instantiate minutia */
	PointShim(
	    const unsigned int x,
	    const unsigned int y,
	    const unsigned int angle,
	    const Type type = Type::Other);

	/**********************************************************************/

	/**
	 * @brief
	 * Convert point from existing representation to another.
	 *
	 * @throw std::runtime_error
	 * Conversion between current and new system not possible or unknown.
	 */
	void
	convertFromSystemRepresentation(
	    const PointSystem system,
	    const ImageShim &image);

	/**********************************************************************/

	/** @return Convert between BiometricEvaluation and PointShim types. */
	static Type
	convertType(
	    const BiometricEvaluation::Feature::MinutiaeType type);

	/**********************************************************************/

	/* Properties are public to allow easier access from JavaScript. */

	unsigned int x_{};
	unsigned int y_{};
	unsigned int angle_{};
	Type type_{Type::Other};
};

/** @brief Convert EFS coordinate to pixel. */
template<typename T, std::enable_if_t<std::is_arithmetic<T>{}, int> = 0>
T
efsToPixel(
    const T tmu,
    const uint16_t ppi,
    const double minValue,
    const double maxValue,
    bool lossless = true)
{
	if (minValue > maxValue)
		throw std::runtime_error{"efsToPixel(): min > max"};

	static const double lossyFactor{0.00039};
	static constexpr double losslessFactor{1.0 / 2540.0};

	double val{};
	if (lossless)
		val = std::ceil(tmu * ppi * losslessFactor);
	else
		val = std::ceil(tmu * ppi * lossyFactor);

	val = std::max(minValue, val);
	val = std::min(maxValue, val);

	return (static_cast<T>(val));
}

#endif /* POINT_SHIM_H_ */
