module.exports = app => {
  /**
   * @api {get} / API Status
   * @apiGroup Status
   * @apiSuccess {String} status API Status' message
   * @apiSuccessExample {json} Success
   *    HTTP/1.1 200 OK
   *    {"status": "mean API"}
   */
  app.get('/api/v1', (req, res) => {
    app.services.core.getIndexMessage()
      .then((status) => res.json(status))
      .catch((error) => res.json(error));
  });
};
