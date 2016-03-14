import Q from 'q';

module.exports = app => {
  const service = {};

  service.getIndexMessage = function () {
    return Q.Promise((resolve, reject) => {
      resolve({
        status: 'mean API',
      });
    });
  };

  return service;
};
