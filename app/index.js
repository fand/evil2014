const express    = require('express');
const morgan     = require('morgan');
const helmet     = require('helmet');
const bodyParser = require('body-parser');
const favicon    = require('serve-favicon');
const path       = require('path');

const ect         = require('ect');
const ectRenderer = ect({ watch: true, root: __dirname + '/views', ext : '.ect' });

const routes = require('./routes');

const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(helmet());

app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'ect');
app.engine('ect', ectRenderer.render);
app.use('/static', express.static('static'));
app.use(favicon(__dirname + '/../static/favicon.ico'));

app.get('/mobile', routes.mobile);
app.get('/', routes.top);
app.post('/', routes.saveSong);
app.get('/:id', routes.getSong);
app.get('/*', routes.notFound);

app.listen(process.env.PORT || 3000);
