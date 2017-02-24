const fs = require('fs');
const crypto = require('crypto');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const style = fs.readFileSync(`${__dirname}/../client/style.css`);

const users = {};

let etag = crypto.createHash('sha1').update(JSON.stringify(users));
let digest = etag.digest('hex');

// index and css
const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });

  response.write(index);

  response.end();
};
module.exports.getIndex = getIndex;

const getStyle = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });

  response.write(style);

  response.end();
};
module.exports.getStyle = getStyle;

// responds
const respond = (request, response, status, content) => {
  const headers = {
    'Content-Type': 'application/json',
    etag: digest,
  };

  console.dir(content);

  response.writeHead(status, headers);
  response.write(JSON.stringify(content));
  response.end();
};

const respondMeta = (request, response, status) => {
  const headers = {
    'Content-Type': 'application/json',
    etag: digest,
  };

  response.writeHead(status, headers);
  response.end();
};

// add users
const addUser = (request, response, body) => {
  const responseJSON = {
    message: 'need both name and age',
  };

  if (!body.name || !body.age) {
    responseJSON.id = 'missing params';
    return respond(request, response, 400, responseJSON);
  }

  let responseCode = 201;

  if (users[body.name]) {
    responseCode = 204;
  } else {
    users[body.name] = {};
  }

  users[body.name].name = body.name;
  users[body.name].age = body.age;

  etag = crypto.createHash('sha1').update(JSON.stringify(users));
  digest = etag.digest('hex');

  if (responseCode === 201) {
    responseJSON.message = 'Created user successfully';
    return respond(request, response, responseCode, responseJSON);
  }

  return respondMeta(request, response, responseCode);
};
module.exports.addUser = addUser;

// not head and 304
const getUsers = (request, response) => {
  const responseJSON = {
    users,
  };

  if (request.headers['if-none-match'] === digest) {
    return respondMeta(request, response, 304);
  }

  return respond(request, response, 200, responseJSON);
};
module.exports.getUsers = getUsers;

const notFound = (request, response, params, type) => {
  const responseJSON = {
    message: 'The page was not found',
    id: 'notFound',
  };
  respond(request, response, 404, responseJSON, type);
};
module.exports.notFound = notFound;


// 304 and head

const getUsersMeta = (request, response) => {
  if (request.headers['if-none-match'] === digest) {
    return respondMeta(request, response, 304);
  }

  return respondMeta(request, response, 200);
};
module.exports.getUsersMeta = getUsersMeta;

const notFoundMeta = (request, response) => {
  respondMeta(request, response, 404);
};
module.exports.notFoundMeta = notFoundMeta;
