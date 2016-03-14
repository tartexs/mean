module.exports = app => {
  /**
   * Tasks policy
   * ACL configuration
   */
  app.acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/v1/tasks',
      permissions: '*',
    }, {
      resources: '/api/v1/tasks/:taskId',
      permissions: '*',
    }],
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/v1/tasks',
      permissions: ['get', 'post'],
    }, {
      resources: '/api/v1/tasks/:taskId',
      permissions: '*',
    }],
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/v1/tasks',
      permissions: ['get'],
    }, {
      resources: '/api/v1/tasks/:taskId',
      permissions: ['get'],
    }],
  }]);

  /**
   * @api {get} /tasks List the user's tasks
   * @apiGroup Tasks
   * @apiHeader {String} Authorization Token of authenticated user
   * @apiHeaderExample {json} Header
   *    {"Authorization": "JWT xyz.abc.123.hgf"}
   * @apiSuccess {Object[]} tasks Task's list
   * @apiSuccess {Number} tasks.id Task id
   * @apiSuccess {String} tasks.title Task title
   * @apiSuccess {Boolean} tasks.done Task is done?
   * @apiSuccess {Date} tasks.updated_at Update's date
   * @apiSuccess {Date} tasks.created_at Register's date
   * @apiSuccess {Number} tasks.user_id Id do usuário
   * @apiSuccessExample {json} Success
   *    HTTP/1.1 200 OK
   *    [{
   *      "id": 1,
   *      "title": "Study",
   *      "done": false
   *      "updated_at": "2016-02-10T15:46:51.778Z",
   *      "created_at": "2016-02-10T15:46:51.778Z",
   *      "user_id": 1
   *    }]
   * @apiErrorExample {json} List error
   *    HTTP/1.1 412 Precondition Failed
   */
  app
  .get('/api/v1/tasks', (req, res) => {
    app.services.tasks.getAll(req.user)
      .then(result => res.json(result))
      .catch(error => {
        res.status(412).json({ msg: error.message });
      });
  });


  /**
   * @api {post} /tasks Register a new task
   * @apiGroup Tasks
   * @apiHeader {String} Authorization Token of authenticated user
   * @apiHeaderExample {json} Header
   *    {"Authorization": "JWT xyz.abc.123.hgf"}
   * @apiParam {String} title Task title
   * @apiParamExample {json} Input
   *    {"title": "Study"}
   * @apiSuccess {Number} id Task id
   * @apiSuccess {String} title Task title
   * @apiSuccess {Boolean} done=false Task is done?
   * @apiSuccess {Date} updated_at Update's date
   * @apiSuccess {Date} created_at Register's date
   * @apiSuccess {Number} user_id User id
   * @apiSuccessExample {json} Success
   *    HTTP/1.1 200 OK
   *    {
   *      "id": 1,
   *      "title": "Study",
   *      "done": false,
   *      "updated_at": "2016-02-10T15:46:51.778Z",
   *      "created_at": "2016-02-10T15:46:51.778Z",
   *      "user_id": 1
   *    }
   * @apiErrorExample {json} Register error
   *    HTTP/1.1 412 Precondition Failed
   */
  app
  .post('/api/v1/tasks', app.acl.checkRoles, (req, res) => {
    req.body.user_id = req.user.id;
    app.services.tasks.create(req.body)
      .then(result => res.json(result))
      .catch(error => res.status(412).json({ msg: error.message }));
  });


  /**
   * @api {get} /tasks/:id Get a task
   * @apiGroup Tasks
   * @apiHeader {String} Authorization Token of authenticated user
   * @apiHeaderExample {json} Header
   *    {"Authorization": "JWT xyz.abc.123.hgf"}
   * @apiParam {id} id Task id
   * @apiSuccess {Number} id Task id
   * @apiSuccess {String} title Task title
   * @apiSuccess {Boolean} done Task is done?
   * @apiSuccess {Date} updated_at Update's date
   * @apiSuccess {Date} created_at Register's date
   * @apiSuccess {Number} user_id User id
   * @apiSuccessExample {json} Success
   *    HTTP/1.1 200 OK
   *    {
   *      "id": 1,
   *      "title": "Study",
   *      "done": false
   *      "updated_at": "2016-02-10T15:46:51.778Z",
   *      "created_at": "2016-02-10T15:46:51.778Z",
   *      "user_id": 1
   *    }
   * @apiErrorExample {json} Task not found error
   *    HTTP/1.1 404 Not Found
   * @apiErrorExample {json} Find error
   *    HTTP/1.1 412 Precondition Failed
   */
  app
  .get('/api/v1/tasks/:taskId', app.acl.checkRoles, (req, res) => {
    app.services.tasks.findById(req.params.taskId, req.user)
      .then(result => {
        if (result) {
          res.json(result);
        } else {
          res.sendStatus(404);
        }
      })
      .catch(error => res.status(412).json({ msg: error.message }));
  });


  /**
   * @api {put} /tasks/:id Update a task
   * @apiGroup Tasks
   * @apiHeader {String} Authorization Token of authenticated user
   * @apiHeaderExample {json} Header
   *    {"Authorization": "JWT xyz.abc.123.hgf"}
   * @apiParam {id} id Task id
   * @apiParam {String} title Task title
   * @apiParam {Boolean} done Task is done?
   * @apiParamExample {json} Input
   *    {
   *      "title": "Work",
   *      "done": true
   *    }
   * @apiSuccessExample {json} Success
   *    HTTP/1.1 204 No Content
   * @apiErrorExample {json} Update error
   *    HTTP/1.1 412 Precondition Failed
   */
  app
  .put('/api/v1/tasks/:taskId', app.acl.checkRoles, (req, res) => {
    app.services.tasks.update(req.params.taskId, req.body, req.user)
      .then(result => res.sendStatus(204))
      .catch(error => res.status(412).json({ msg: error.message }));
  });


  /**
   * @api {delete} /tasks/:id Remove a task
   * @apiGroup Tasks
   * @apiHeader {String} Authorization Token of authenticated user
   * @apiHeaderExample {json} Header
   *    {"Authorization": "JWT xyz.abc.123.hgf"}
   * @apiParam {id} id Task id
   * @apiSuccessExample {json} Success
   *    HTTP/1.1 204 No Content
   * @apiErrorExample {json} Delete error
   *    HTTP/1.1 412 Precondition Failed
   */
  app
  .delete('/api/v1/tasks/:taskId', app.acl.checkRoles, (req, res) => {
    app.services.tasks.destroy(req.params.taskId, req.user)
      .then(result => res.sendStatus(204))
      .catch(error => res.status(412).json({ msg: error.message }));
  });
};
