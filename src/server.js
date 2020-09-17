const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponse.js');
const jsonHandler = require('./jsonResponse.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const handlePost = (request, response, parsedURL) => {
  if (parsedURL.pathname === '/addUser') {
    const body = [];

    request.on('error', (error) => {
      console.dir(error);
      response.statusCode = 400;
      response.end();
    });

    request.on('data', (chunk) => {
      body.push(chunk);
    });

    request.on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      const bodyParams = query.parse(bodyString);

      jsonHandler.addUser(request, response, bodyParams);
    });
  }
};

const handleGet = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/style.css') {
    htmlHandler.getCSS(request, response);
  } else if (parsedUrl.pathname === '/getUsers') {
    jsonHandler.getUsers(request, response);
  } else if (parsedUrl.pathname === '/') {
    htmlHandler.getIndex(request, response);
  } else {
    jsonHandler.notFound(request, response);
  }
};
const handleHead = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/getUsers') {
    jsonHandler.getUsersMeta(request, response);
  } else {
    jsonHandler.notFoundMeta(request, response);
  }
};

const onRequest = (request, response) => {
  const parsedurl = url.parse(request.url);

  if (request.method === 'POST') {
    handlePost(request, response, parsedurl);
  } else if (request.method === 'GET') {
    handleGet(request, response, parsedurl);
  } else if (request.method === 'HEAD') {
    handleHead(request, response, parsedurl);
  } else {
    console.dir('Invalid Method');
  }
};

http.createServer(onRequest).listen(port);
console.log(`litesting on 127.0.0.1:${port}`);
