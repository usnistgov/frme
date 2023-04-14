# Friction Ridge Metadata Explorer <img src="static/images/F_NIST-Logo-Brand-2c-crop.svg" align="right" alt="NIST identifier" style="height: 1em;" />

A web application for basic inspection of Type 9 records within
[ANSI/NIST-ITL](https://www.nist.gov/programs-projects/ansinist-itl-standard)
files. The latest version of this web application is deployed at
[https://fingerprint.nist.gov/frme](https://fingerprint.nist.gov/frme).

## Build

The [Emscripten SDK](https://emscripten.org) is required to build this tool.
This tool also requires Biometric Evaluation framework, whose dependencies
need to be compiled to WebAssembly.

<details>
<summary>**Example dependency build instructions**</summary>
### Emscripten SDK

```sh
git clone https://github.com/emscripten-core/emsdk.git
cd emsdk
./emsdk install latest
./emsdk activate latest

# This will set variables needed for the remainder of the installation steps
EMSDK_QUIET=1 source ./emsdk_env.sh
```

### Biometric Evaluation Framework Dependencies

The following steps install dependencies directly into the Emscripten SDK's
directory to make discovery by CMake easier. This might not be what you want.

Dependencies required to build Biometric Evaluation framework for WebAssembly
include libtiff, OpenJPEG 2, and OpenSSL.

#### libtiff

Support for TIFF images.

```sh
TIFF_VERSION="4.5.1"
cd /tmp
curl -L -O http://download.osgeo.org/libtiff/tiff-${TIFF_VERSION}.tar.xz
tar xf tiff-${TIFF_VERSION}.tar.xz
cd tiff-${TIFF_VERSION}

mkdir build
cd build
CXXFLAGS="-sSUPPORT_LONGJMP=wasm" CFLAGS="-sSUPPORT_LONGJMP=wasm" \
    LDFLAGS="-sSUPPORT_LONGJMP=wasm" emcmake cmake ..
emmake make -j
cmake --install . --prefix ${EMSDK}/upstream/emscripten/cache/sysroot
cd /tmp && rm -rf /tmp/tiff-${TIFF_VERSION} /tmp/tiff-${TIFF_VERSION}.tar.xz
```

#### OpenJPEG 2

Support for JPEG-2000 images.

```sh
OPENJPEG_VERSION="2.5.0"
cd /tmp
URL="https://github.com/uclouvain/openjpeg/archive/refs/tags/"
URL+="v${OPENJPEG_VERSION}.tar.gz"
curl -L -O ${URL}
tar xf v${OPENJPEG_VERSION}.tar.gz
cd openjpeg-${OPENJPEG_VERSION}

mkdir build
cd build
CXXFLAGS="-sSUPPORT_LONGJMP=wasm" CFLAGS="-sSUPPORT_LONGJMP=wasm" \
    LDFLAGS="-sSUPPORT_LONGJMP=wasm"  emcmake cmake .. -DBUILD_CODEC=OFF
emmake make -j
cmake --install . --prefix ${EMSDK}/upstream/emscripten/cache/sysroot
cd /tmp && rm -rf /tmp/v${OPENJPEG_VERSION}.tar.gz \
    /tmp/openjpeg-${OPENJPEG_VERSION}
```

#### OpenSSL

Support for things like hashes and Base64 encodings.

```sh
OPENSSL_VERSION="3.1.2"
cd /tmp
curl -O https://www.openssl.org/source/openssl-${OPENSSL_VERSION}.tar.gz
tar xf openssl-${OPENSSL_VERSION}.tar.gz
cd openssl-${OPENSSL_VERSION}

emconfigure ./Configure \
  linux-generic64 \
  no-asm \
  no-threads \
  no-engine \
  no-weak-ssl-ciphers \
  no-dtls \
  no-shared \
  no-dso \
  no-afalgeng \
  no-async \
  no-egd \
  no-ktls \
  no-module \
  no-posix-io \
  no-secure-memory \
  no-shared \
  no-sock \
  no-stdio \
  no-ui-console \
  --prefix=${EMSDK}/upstream/emscripten/cache/sysroot

sed -i "" -e 's|^CROSS_COMPILE.*$|CROSS_COMPILE=|g' Makefile
emmake make install_sw -j
cd /tmp && rm -rf /tmp/openssl-${OPENSSL_VERSION}.tar.gz \
    /tmp/openssl-${OPENSSL_VERSION}
```
</details>

Once all dependencies are in place, invoke CMake to build the WebAssembly code,
minify JavaScript, *and* deploy the tool.

```sh
WEBSERVER_ROOT=/var/www/...

mkdir build && cd build
emcmake cmake -DCMAKE_INSTALL_PREFIX=${WEBSERVER_ROOT} \
    -DCMAKE_BUILD_TYPE=Release ..
emmake make -j
```

### Testing Locally

If you don't have a web server, you can instantite one temporarily using Python.

```sh
cd ${WEBSERVER_ROOT}
python3 -m http.server
# Open a web browser to http://localhost:8000
```

## Communication
If you found a bug and can provide steps to reliably reproduce it, or if you
have a feature request, please
[open an issue](https://github.com/usnistgov/frme/issues).

## Credits
This work is sponsored by NIST's [Special Programs
Office](https://www.nist.gov/spo) through the [Forensic Science Research
Program](https://www.nist.gov/spo/forensic-science-program).

## License
This work is released in the public domain. See the
[LICENSE](https://github.com/usnistgov/frme/blob/master/LICENSE.md) for details.
