module.exports = app => {
  const env = process.env.NODE_ENV;
  if (env) {
    return require(`./env/${env}.js`);
  }
  return require('./env/development.js');
};
