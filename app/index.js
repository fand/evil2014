const express = require('express');
const morgan  = require('morgan');
const path    = require('path');
const ejs     = require('ejs');

const routes   = require('./routes');

const app = express();
app.use(morgan('combined'));
app.engine('ejs', ejs.renderFile);
app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/static', express.static('static'));

app.get('/mobile', routes.mobile);
app.get('/', routes.top);
app.post('/', routes.saveSong);
app.get('/:id', routes.getSong);
app.get('/*', routes.notFound);

app.listen(3000);
