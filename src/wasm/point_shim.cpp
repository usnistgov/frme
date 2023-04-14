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
#include "point_shim.h"

#include <emscripten/bind.h>

namespace BE = BiometricEvaluation;

PointShim::PointShim(
    const unsigned int x,
    const unsigned int y,
    const unsigned int angle,
    const PointShim::Type type) :
    x_{x},
    y_{y},
    angle_{angle},
    type_{type}
{

}

PointShim::Type
PointShim::convertType(
    const BE::Feature::MinutiaeType type)
{
	switch (type) {
	case BE::Feature::MinutiaeType::RidgeEnding:
		return (PointShim::Type::RidgeEnding);
	case BE::Feature::MinutiaeType::Bifurcation:
		return (PointShim::Type::Bifurcation);
	default:
		return (PointShim::Type::Other);
	}
}

void
PointShim::convertFromSystemRepresentation(
    const PointSystem system,
    const ImageShim &i)
{
	switch (system) {
	case PointSystem::EFS:
		this->x_ = efsToPixel(this->x_, i.getPPI(), 0,
		    i.getWidth() - 1);
		this->y_ = efsToPixel(this->y_, i.getPPI(), 0,
		    i.getHeight() - 1);
		break;
	case PointSystem::Legacy:
		this->x_ = efsToPixel(this->x_, i.getPPI(), 0,
		    i.getWidth() - 1);
		this->y_ = i.getHeight() - efsToPixel(this->y_, i.getPPI(), 0,
		    i.getHeight() - 1);

		// XXX: Is this correct?
		this->angle_ += 180;
		if (this->angle_ > 359)
			this->angle_ -= 360;

		break;
	default:
		throw std::runtime_error{"Unsupported PointSystem"};
	}
}

std::string
getPointSystemName(
    const PointSystem system)
{
	switch (system) {
	case PointSystem::Legacy:
		return ("Legacy");
	case PointSystem::IAFIS:
		return ("IAFIS");
	case PointSystem::Cogent:
		return ("Cogent");
	case PointSystem::Motorola:
		return ("Motorola");
	case PointSystem::Sagem:
		return ("Sagem Morpho");
	case PointSystem::NEC:
		return ("NEC");
	case PointSystem::Identix:
		return ("Identix");
	case PointSystem::M1:
		return ("INCITS/M1");
	case PointSystem::Other:
		return ("User-Defined");
	case PointSystem::EFS:
		return ("EFS");
	}

	return ("Unknown");
}

EMSCRIPTEN_BINDINGS(point_shim)
{
	emscripten::enum_<PointShim::Type>("MinutiaeType")
	    .value("RidgeEnding", PointShim::Type::RidgeEnding)
	    .value("Bifurcation", PointShim::Type::Bifurcation)
	    .value("Core", PointShim::Type::Core)
	    .value("Delta", PointShim::Type::Delta)
	    .value("Other", PointShim::Type::Other)
	    ;

	emscripten::enum_<PointSystem>("PointSystem")
	    .value("Legacy", PointSystem::Legacy)
	    .value("IAFIS", PointSystem::IAFIS)
	    .value("Cogent", PointSystem::Cogent)
	    .value("Motorola", PointSystem::Motorola)
	    .value("Sagem", PointSystem::Sagem)
	    .value("NEC", PointSystem::NEC)
	    .value("Identix", PointSystem::Identix)
	    .value("M1", PointSystem::M1)
	    .value("Other", PointSystem::Other)
	    .value("EFS", PointSystem::EFS)
	    ;

	emscripten::class_<PointShim>("PointShim")
	    .property("x", &PointShim::x_)
	    .property("y", &PointShim::y_)
	    .property("angle", &PointShim::angle_)
	    .property("type", &PointShim::type_)
	    ;

	emscripten::register_vector<PointShim>("VectorPointShim");

	emscripten::function("getPointSystemName", &getPointSystemName);
}
