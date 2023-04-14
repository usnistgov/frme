/*
 * This software was developed at the National Institute of Standards and
 * Technology (NIST) by employees of the Federal Government in the course
 * of their official duties. Pursuant to title 17 Section 105 of the
 * United States Code, this software is not subject to copyright protection
 * and is in the public domain. NIST assumes no responsibility whatsoever for
 * its use by other parties, and makes no guarantees, expressed or implied,
 * about its quality, reliability, or any other characteristic.
 */

#ifndef FRME_WASM_H_
#define FRME_WASM_H_

#include <string>
#include <variant>

#include <be_data_interchange_an2k.h>

#include "image_shim.h"
#include "point_shim.h"

/** Where WebAssembly writes files */
static const std::string UPLOADED_FILE_NAME{"/UPLOAD"};

/** All supported BiometricEvaluation friction ridge types */
using FrictionRidgeImage = std::variant<
    BiometricEvaluation::Finger::AN2KViewFixedResolution,
    BiometricEvaluation::Finger::AN2KViewCapture,
    BiometricEvaluation::Palm::AN2KView,
    BiometricEvaluation::Latent::AN2KView>;

/** @return Collection of fingerprint/minutiae object pairs */
std::vector<std::pair<ImageShim,
    std::vector<BiometricEvaluation::Finger::AN2KMinutiaeDataRecord>>>
getFrictionRidgeImagesWithMinutiaeData(
    const BiometricEvaluation::DataInterchange::AN2KRecord &an2k);

/** @return true if record contains any friction ridge images */
bool
hasFrictionRidgeImagery(
    const BiometricEvaluation::DataInterchange::AN2KRecord &an2k);

/** @return true if `pointSystem` represented in `an2k`, false otherwise. */
bool
hasMinutiaeDataFormat(
    const BiometricEvaluation::DataInterchange::AN2KRecord &an2k,
    const PointSystem pointSystem);

/**
 * @return
 * Collection of all minutiae sets found in a record for an image
 * @note
 * `image` required strictly to obtain PPI to convert EFS coordinates to pixels.
 */
std::vector<std::pair<PointSystem, std::vector<PointShim>>>
getAllPoints(
    const ImageShim &image,
    const std::vector<BiometricEvaluation::Finger::AN2KMinutiaeDataRecord>
    &mdrs);

#endif /* FRME_WASM_H_ */
