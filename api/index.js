import express from 'express';
import consign from 'consign';

const app = express();

consign({ 
  verbose: false,
  cwd: 'api' 
})
  .include('config/config.js')
  .then('db.js')
  .then('auth.js')
  .then('config/middlewares.js')
  .then('services')
  .then('routes')
  .then('config/boot.js')
  .into(app);

module.exports = app;
