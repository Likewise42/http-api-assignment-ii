const http = require('http');
const url = require('url');
const query = require('querystring');

// handelers
const responseHandler = require('./responses.js');

// port
const port = process.env.PORT || process.env.NODE_PORT || 3000;

const onRequest = (request, response) => {
  // parse the url
  const parsedUrl = url.parse(request.url);

  if (request.method === 'GET') {
    if (parsedUrl.pathname === '/') {
      responseHandler.getIndex(request, response);
    } else if (parsedUrl.pathname === '/style.css') {
      responseHandler.getStyle(request, response);
    } else if (parsedUrl.pathname === '/getUsers') {
      responseHandler.getUsers(request, response);
    } else {
      responseHandler.notFound(request, response);
    }
  } else if (request.method === 'HEAD') {
    if (parsedUrl.pathname === '/getUsers') {
      responseHandler.getUsersMeta(request, response);
    } else {
      responseHandler.notFoundMeta(request, response);
    }
  } else if (request.method === 'POST' && parsedUrl.pathname === '/addUser') {
    const res = response;

    const body = [];

    request.on('error', () => {
      res.statusCode = 400;
      res.end();
    });

    request.on('data', (chunk) => {
      body.push(chunk);
    });

    request.on('end', () => {
      console.log(Buffer.concat(body).toString());

      const bodyString = Buffer.concat(body).toString();

      const bodyParams = query.parse(bodyString);

      responseHandler.addUser(request, res, bodyParams);
    });
  } else {
    responseHandler.notFound(request, response);
  }
};

// start HTTP server
http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
