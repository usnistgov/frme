/*
 * This software was developed at the National Institute of Standards and
 * Technology (NIST) by employees of the Federal Government in the course
 * of their official duties. Pursuant to title 17 Section 105 of the
 * United States Code, this software is not subject to copyright protection
 * and is in the public domain. NIST assumes no responsibility whatsoever for
 * its use by other parties, and makes no guarantees, expressed or implied,
 * about its quality, reliability, or any other characteristic.
 */

#ifndef FRME_EXCEPTION_H_
#define FRME_EXCEPTION_H_

#include <string>

/** @return Exception message from WebAssembly exception pointer. */
std::string
getExceptionPtrMessage(
    intptr_t exceptionPtr);

#endif /* FRME_EXCEPTION_H_ */
