# This software was developed at the National Institute of Standards and
# Technology (NIST) by employees of the Federal Government in the course
# of their official duties. Pursuant to title 17 Section 105 of the
# United States Code, this software is not subject to copyright protection
# and is in the public domain. NIST assumes no responsibility whatsoever for
# its use by other parties, and makes no guarantees, expressed or implied,
# about its quality, reliability, or any other characteristic.

cmake_minimum_required(VERSION 3.15)

project("Friction Ridge Metadata Explorer"
    VERSION 0.0.1
    LANGUAGES CXX)

set(SOURCES
    frme_an2k.cpp
    frme_exception.cpp
    image_shim.cpp
    point_shim.cpp)

if (NOT DEFINED EMSCRIPTEN)
	message(FATAL_ERROR "EMSCRIPTEN is not defined. Ensure you ran `emcmake', not `cmake'.")
endif()

set(WASM_TARGET frme_wasm)

#set(CMAKE_RUNTIME_OUTPUT_DIRECTORY "${CMAKE_SOURCE_DIR}/deploy")

#set(CMAKE_EXECUTABLE_SUFFIX ".wasm.js")
add_executable(${WASM_TARGET} ${SOURCES})

message(STATUS "Emscripten SDK path detected as ${EMSCRIPTEN_SYSROOT}")

set_target_properties(${WASM_TARGET} PROPERTIES
    CXX_STANDARD 17
    CXX_STANDARD_REQUIRED TRUE)

target_compile_options(${WASM_TARGET} PRIVATE
     -fwasm-exceptions
     -sSUPPORT_LONGJMP=wasm)
target_link_options(${WASM_TARGET} PRIVATE
     -fwasm-exceptions
     -sSUPPORT_LONGJMP=wasm
     --bind
     --no-entry
     -sEXPORT_EXCEPTION_HANDLING_HELPERS=1
     -sEXPORTED_RUNTIME_METHODS=ccall,cwrap
     -sFORCE_FILESYSTEM=1
     -sALLOW_MEMORY_GROWTH=1
     -fsanitize=undefined
     -sLLD_REPORT_UNDEFINED=1
     -sUSE_LIBJPEG=1)

find_library(OPENJP2 openjp2 REQUIRED)
find_library(TIFF tiff REQUIRED)
find_library(CRYPTO crypto REQUIRED)

# FIXME: You'd want to use -sUSE_LIBPNG, but this is sometimes grabbing the
#        emscripten_longjmp version instead.
set(PNG_NAMES png-wasm-sjlj)
find_package(PNG REQUIRED)

set(biomeval_DIR ${CMAKE_BINARY_DIR}/../../../libbiomeval-prefix/src/libbiomeval-build/cmake)
target_include_directories(${WASM_TARGET} PRIVATE ${CMAKE_BINARY_DIR}/../../../../libbiomeval/src/include)
find_package(biomeval REQUIRED)

target_link_libraries(${WASM_TARGET}
    ${OPENJP2}
    ${TIFF}
    ${CRYPTO}
    PNG::PNG
    biomeval::biomeval)

#
# Embed git commit hash in version.js
#
set(FRME_GIT_HASH "")
execute_process(COMMAND git rev-parse --short HEAD OUTPUT_VARIABLE gitOut ERROR_VARIABLE gitErr WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR})
if("${gitErr}" STREQUAL "" AND NOT "${gitOut}" STREQUAL "")
	string(REGEX REPLACE "(\r?\n)+$" "" FRME_GIT_HASH "${gitOut}")
	message(STATUS "Embedding git commit hash \"${FRME_GIT_HASH}\"")
else()
	set(FRME_GIT_HASH "")
endif()
configure_file(${PROJECT_SOURCE_DIR}/../js/version.js.in ${PROJECT_SOURCE_DIR}/../js/version.js)

#
# Minify the JavaScript
#
set(JS_SOURCES darkmode.js frme_client.js frme_explanations.js frme_module.js gtag.js)
if (EXISTS ${PROJECT_SOURCE_DIR}/../js/version.js)
	list(APPEND JS_SOURCES version.js)
endif()
find_program(TERSER terser
    HINTS ${EMSCRIPTEN_SYSROOT}/../../node_modules/terser/bin/)
if (TERSER)
	message(STATUS "Minifying JavaScript (found terser at ${TERSER})")
	foreach (JS ${JS_SOURCES})
		message(STATUS "Working on ${JS}")
		get_filename_component(JS_BASE ${JS} NAME_WE)
		list(APPEND MINIFIED_JS "${JS_BASE}.min.js" "${JS_BASE}.min.js.map")
		add_custom_command(
		    OUTPUT
		        ${JS_BASE}.min.js ${JS_BASE}.min.js.map
		    DEPENDS
		        ${PROJECT_SOURCE_DIR}/../js/${JS_BASE}.js
		    COMMAND
		       ${TERSER}
		    ARGS
		        --compress 'drop_console:true'
		        --mangle
		        --source-map
		        --output ${JS_BASE}.min.js
		        ${PROJECT_SOURCE_DIR}/../js/${JS_BASE}.js
		)

		# Install minified files
		install(
		    FILES
		        ${CMAKE_CURRENT_BINARY_DIR}/${JS_BASE}.min.js
			${CMAKE_CURRENT_BINARY_DIR}/${JS_BASE}.min.js.map
		    DESTINATION
		        js)
	endforeach()
	add_custom_target(minify ALL DEPENDS ${MINIFIED_JS})
endif()

################################################################################

# Install full JS files
foreach (JS ${JS_SOURCES})
	install(FILES ../js/${JS} DESTINATION js)
endforeach()

# Install index and static files
install(FILES ${PROJECT_SOURCE_DIR}/../../index.html DESTINATION .)
install(DIRECTORY ${PROJECT_SOURCE_DIR}/../../static DESTINATION .)


# Install build WASM files
install(
    FILES
        "$<TARGET_FILE_DIR:${WASM_TARGET}>/${WASM_TARGET}.js"
        "$<TARGET_FILE_DIR:${WASM_TARGET}>/${WASM_TARGET}.wasm"
        DESTINATION wasm)
