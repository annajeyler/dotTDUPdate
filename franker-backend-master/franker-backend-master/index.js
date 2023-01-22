const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const compress = require('compression');
const cors = require('cors');
const helmet = require('helmet');

const config = require('./config');
const logger = require('./logger');
const aws = require('./aws')(config);

//////////////////
// App settings //
//////////////////

const app = express();
const server = require('http').Server(app); // eslint-disable-line new-cap

// parse body params and attache them to req.body

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// for rate limiter behind reverse proxy
app.enable('trust proxy');

app.use(compress());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

//////////////////
// Env settings //
//////////////////

if (config.get('env') === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan(config.get('logLevel')));
}

app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

// GET ALL ITEMS

let cachedItems = null;

app.get('/items', async (req, res) => {
  // TODO: cache
  if (cachedItems === null) {
    cachedItems = await aws.getAllItems();
  }
  res.json({ items: cachedItems, });
});

// REQUEST SIGNED URL

app.post('/signed', async (req, res) => {
  // TODO: throttle?
  const { fileName, } = req.body;
  const url = await aws.generateSignedUrl(fileName);
  res.json({ url, });
});

// SUBMIT IMAGE AND TEXT

app.post('/submit', async (req, res) => {
  // TODO: throttle?
  const { url, text, fortuneId, } = req.body;
  await aws.createNewItem(url, text, fortuneId);
  cachedItems = null;
  res.json({ success: true, });
});

// no need to render errors for now, just show them
app.use((err, req, res, next) => {
  logger.warn(`api error ${err.message}`);
  res.sendStatus(err.status || 500);
});

server.listen(config.get('port'), () => {
  logger.info(`Server started on port ${config.get('port')}`);
});
