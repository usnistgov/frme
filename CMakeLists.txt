# This software was developed at the National Institute of Standards and
# Technology (NIST) by employees of the Federal Government in the course
# of their official duties. Pursuant to title 17 Section 105 of the
# United States Code, this software is not subject to copyright protection
# and is in the public domain. NIST assumes no responsibility whatsoever for
# its use by other parties, and makes no guarantees, expressed or implied,
# about its quality, reliability, or any other characteristic.

cmake_minimum_required(VERSION 3.15)

project("Friction Ridge Metadata Explorer Superbuild"
    VERSION 0.0.1
    LANGUAGES CXX)

include(ExternalProject)

if (NOT DEFINED EMSCRIPTEN)
	message(FATAL_ERROR "EMSCRIPTEN is not defined. Ensure you ran `emcmake', not `cmake'.")
endif()

ExternalProject_Add(wasm
    SOURCE_DIR ${PROJECT_SOURCE_DIR}/src/wasm
    CMAKE_COMMAND ${EMSCRIPTEN_ROOT_PATH}/emcmake
    BUILD_ALWAYS YES
    CMAKE_ARGS
        cmake
        -DCMAKE_INSTALL_PREFIX=${CMAKE_INSTALL_PREFIX}
	-DCMAKE_BUILD_TYPE=${CMAKE_BUILD_TYPE}
)
ExternalProject_Add(libbiomeval
    SOURCE_DIR ${PROJECT_SOURCE_DIR}/libbiomeval
    INSTALL_COMMAND ""
    CMAKE_COMMAND ${EMSCRIPTEN_ROOT_PATH}/emcmake
    CMAKE_ARGS
        cmake
	-DCMAKE_BUILD_TYPE=${CMAKE_BUILD_TYPE}
)

ExternalProject_Add_StepDependencies(wasm build libbiomeval)
