const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const style = fs.readFileSync(`${__dirname}/../client/style.css`);

const respond = (request, response, status, content, type) => {
  response.writeHead(status, { 'Content-Type': type });

  console.log(type);

  let cont = content;

  if (type === 'text/xml') {
    cont = convertJSONtoXML(content, status);
  } else {
    cont = JSON.stringify(content);
  }

  response.write(cont);

  response.end();
};

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

const notFound = (request, response, params, type) => {
  const responseJSON = {
    msg: 'The page was not found',
    id: 'notFound',
  };
  respond(request, response, 404, responseJSON, type);
};
module.exports.notFound = notFound;
