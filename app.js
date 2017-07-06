import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import engines from 'consolidate';

import routes from './api/routes/index';

const app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.set('views', __dirname + '/public/views/');
app.engine('html', engines.mustache);
app.set('view engine', 'html');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/', routes);

//----------------------------------------//
// Not found handler
//----------------------------------------//

// app.use((req, res, next) => {
//   res.status(404).send();
// });


//----------------------------------------//
// Error handler
//----------------------------------------//

app.use((err, req, res, next) => {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  console.log(err);
  res.status(err.status || 500).send();
});


//----------------------------------------//
// Angular handler
//----------------------------------------//

app.get('*', (req, res) => {
  res.render('layout.html')
});


export default app;