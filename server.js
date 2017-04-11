const PORT = 3000;
var fs = require('fs');
var http = require('http');

/* Create the webserver */
var server = new http.Server(handleRequest);
server.listen(PORT, function(){
  console.log("Listening on port", PORT);
});

/**
 * @function handleRequest
 * sends streaming video requests to streamVideo(),
 * and all other requests to serveIndex.
 * @param {http.incomingRequest} req - the request object
 * @param {http.clientResponse} res - the response object
 */
function handleRequest(req, res) {
  if(req.url.split('/')[1] == 'videos') {
    streamVideo(req, res);
  } else {
    serveIndex(req, res);
  }
}

/** @function serveIndex(req, res)
 * Serves the index.html file
 * @param {http.incomingRequest} req - the request object
 * @param {http.clientResponse} res - the response object
 */
function serveIndex(req, res) {
  fs.readFile('index.html', function(err, data) {
    res.writeHead(200, "Content-Type: text/html");
    res.end(data);
  });
}

/** @function streamVideo
 * Serves a portion of the requested video file.
 * The video file is embodied in the request url
 * (in the form /videos/{video file name}), and
 * the range of bytes to serve is contained in the
 * request http range header.  See
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Range
 * for details.
 * @param {http.incomingRequest} req - the request object
 * @param {http.clientResponse} res - the response object
 */
function streamVideo(req, res) {
  // The range header specifies the part of the file to send
  // in the form bytes={start}-{end}, where {start} is
  // the starting byte position in the file to stream, and
  // {end} is the ending byte position (or blank)
  var range = req.headers.range;
  var positions = range.replace(/bytes=/, "").split("-");
  var start = parseInt(positions[0], 10);
  // Extract the video file name from the url, and
  // use the extension to set up the file type
  var path = 'videos/' + req.url.match(/\/videos\/([^\/]+)/)[1];
  var type = 'video/' + path.split('.')[1];
  // We need to stat the video file to determine the
  // correct ending byte index (as the client may be
  // requesting more bytes than our file contains)
  fs.stat(path, (err, stats) => {
    if(err) {
      console.error(err);
      res.statusCode = 404;
      res.end();
      return;
    }
    var total = stats.size;
    // Set the end position to the specified end, or the total
    // number of bytes - 1, whichever is smaller.
    var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
    // The chunk size is the number of bytes we are sending,
    // i.e. the end-start plus one.
    var chunksize = (end - start) + 1;
    // Set the response status code to 206: partial content,
    // and set the headers to specify the part of the video
    // we are sending
    res.writeHead(206, {
      "Content-Range": "bytes " + start + "-" + end + "/" + total,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": type
    });
    // Pipe the portion of the file we want to send to the
    // response object.
    var stream = fs.createReadStream(path, {start: start, end: end})
      .on('open', () => stream.pipe(res))
      .on('error', (err) => res.end(err));
  });
}
