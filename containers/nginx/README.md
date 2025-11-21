# Nginx Container with m1-transcode

This container includes:
- **Nginx** with RTMP module and VOD module for DASH/HLS streaming
- **m1-transcode** built from source for native platform performance

## m1-transcode Build Process

The `m1-transcode` binary is automatically compiled during Docker build from source code in `modules/m1-transcode/`.

### Build Stages

1. **m1-transcode-build**: Compiles the m1-transcode binary for the target architecture
2. **nginx-build**: Compiles Nginx with required modules
3. **vue-build**: Builds the frontend application
4. **Final stage**: Combines all built artifacts into the runtime container

### Architecture Support

The build process automatically creates the correct binary for:
- **ARM64** (Apple Silicon M1/M2/M3)
- **AMD64** (Intel/AMD x86_64)

No manual binary management needed - Docker handles platform detection automatically.

### Dependencies

Build dependencies are handled within the Docker build:
- build-essential (gcc, g++, make)
- cmake
- git
- libsndfile1-dev

### Manual Build (for development)

If you need to build m1-transcode manually outside Docker, see `modules/m1-transcode/README.md`:

```bash
cd modules/m1-transcode
cmake . -Bbuild -DCMAKE_BUILD_TYPE=Release
cmake --build build
```

---

## Legacy Manual Installation Notes

<details>
<summary>Old manual libsndfile installation (no longer needed for Docker builds)</summary>

### Install Dependencies:

 - Install libsndfile and dependencies via this tutorial: [Link](http://www.linuxfromscratch.org/blfs/view/svn/multimedia/libsndfile.html)
 	Breakdown of tutorial above:
	 - `wget https://downloads.xiph.org/releases/ogg/libogg-1.3.3.tar.xz && tar xf libogg-1.3.3.tar.xz`
	 - `cd libogg-1.3.3 && ./configure --prefix=/usr --docdir=/usr/share/doc/libogg-1.3.3 && make`
	 - `make install`
	 - `cd ../`
	 - `wget https://downloads.xiph.org/releases/vorbis/libvorbis-1.3.6.tar.xz && tar xf libvorbis-1.3.6.tar.xz`
	 - `cd libvorbis.1.3.6 && ./configure --prefix/usr && make`
	 - `make install && install -v -m644 doc/Vorbis* /usr/share/doc/libvorbis-1.3.6`
	 - `cd ../`
	 - `wget https://downloads.xiph.org/releases/flac/flac-1.3.2.tar.xz && tar xf flac-1.3.2.tar.xz`
	 - `cd flac-1.3.2 && ./configure --prefix=/usr --disable-thorough-tests && make`
	 - `make install`
	 - `cd ../`
	 - `wget http://www.mega-nerd.com/libsndfile/files/libsndfile-1.0.28.tar.gz && tar xf libsndfile-1.0.28.tar.gz`
	 - `cd libsndfile-1.0.28 && ./configure --prefix=/usr --docdir=/usr/share/doc/libsndfile-1.0.28 && make`
	 - `make install`
	 - `cd ../`

</details>
