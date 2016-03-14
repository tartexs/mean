module.exports = app => {
  let env = process.env.NODE_ENV;
  if (!env) {
    env = process.env.NODE_ENV = 'development';
  }

  return require(`./env/${env}.js`);
};
