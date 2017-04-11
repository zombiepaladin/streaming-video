## streaming-video
An example streaming video server written in Node.js

## Installation
While this example does not require any node packages, it does expect a couple of video files downloaded from NASA servers to exist in the videos folder.  Because Github has a file limitation size, these are downloaded via curl using the npm install command:

```
$ npm install
```

Alternatively, you can manually download the files into the _videos_ folder.  The files are:
* [https://cdn.spacetelescope.org/archives/videos/medium_podcast/hubblecast95a.mp4](https://cdn.spacetelescope.org/archives/videos/medium_podcast/hubblecast95a.mp4)
* [https://cdn.spacetelescope.org/archives/videos/hd_and_apple/hubblecast95a.m4v](https://cdn.spacetelescope.org/archives/videos/hd_and_apple/hubblecast95a.m4v)

As a third alternative, you can put your own video files in the videos folder, and alter the `<source>` tags in _index.html_ to reflect these files.

## Running the Server

To run the server, use the **npm start** command:

```
$ npm start
```

By default, the server will run on port 3000.  This can be changed by modifying the **PORT** constant in _server.js_.
