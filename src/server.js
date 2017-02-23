const http = require('http');
const url = require('url');
const query = require('querystring');

// handelers
const responseHandler = require('./responses.js');

// port
const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  '/': responseHandler.getIndex,
  '/style.css': responseHandler.getStyle,
  '/getUsers': responseHandler.notFound,
  '/notReal': responseHandler.notFound,
  '/addUser': responseHandler.notFound,
  notFound: responseHandler.notFound,
};

const onRequest = (request, response) => {
  // parse the url
  const parsedUrl = url.parse(request.url);
  const params = query.parse(parsedUrl.query);

	console.log(parsedUrl);
	
  const acceptedTypes = request.headers.accept.split(',');

  if (urlStruct[parsedUrl.pathname]) {
    console.log(parsedUrl.pathname);
    urlStruct[parsedUrl.pathname](request, response, params, acceptedTypes[0]);
  } else {
    console.log(parsedUrl.pathname);
    urlStruct.notFound(request, response, params, acceptedTypes[0]);
  }
};

// start HTTP server
http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
