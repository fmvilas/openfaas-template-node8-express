const http = require('http')
const express = require('express')
const handler = require('./function/handler');
const bodyParser = require('body-parser');
const Router = express.Router;

const app = express();

app.use(bodyParser.json());
app.disable('x-powered-by');

const entrypoint = (req, res, next) => {
  const fakeRequest = new http.IncomingMessage();

  fakeRequest.baseUrl = req.body.baseUrl;
  fakeRequest.body = req.body.body;
  fakeRequest.cookies = req.body.cookies;
  fakeRequest.fresh = req.body.fresh;
  fakeRequest.headers = req.body.headers;
  fakeRequest.hostname = req.body.hostname;
  fakeRequest.ip = req.body.ip;
  fakeRequest.ips = req.body.ips;
  fakeRequest.method = req.body.method;
  fakeRequest.originalUrl = req.body.originalUrl;
  fakeRequest.path = req.body.path;
  fakeRequest.protocol = req.body.protocol;
  fakeRequest.query = req.body.query;
  fakeRequest.route = req.body.route;
  fakeRequest.secure = req.body.secure;
  fakeRequest.signedCookies = req.body.signedCookies;
  fakeRequest.stale = req.body.stale;
  fakeRequest.subdomains = req.body.subdomains;
  fakeRequest.url = req.body.url;
  fakeRequest.xhr = req.body.xhr;

  for (const prop in req.body.req) {
    fakeRequest[prop] = req.body.req[prop];
  }

  fakeRequest.api = req.body.api;
  fakeRequest.block = req.body.block;

  const router = new Router();
  router.use(handler);
  router.use((req, res) => {
    res.status(404).send({
      message: 'Not Found',
    });
  });
  router.handle(fakeRequest, res, next);
};

app.get('/_health', (req, res, next) => {
  res.status(200).send();
});
app.post('/', entrypoint);
app.get('/', entrypoint);

const port = process.env.http_port || 3000;

app.listen(port, () => {
  console.log(`OpenFaaS Node.js listening on port: ${port}`)
});
