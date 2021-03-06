import ACL from 'acl';

let acl = null;

module.exports = app => {
  if (!acl) {
    acl = new ACL(new ACL.memoryBackend());
  }


  acl.checkRoles = (req, res, next) => {
    const roles = (req.user) ? [req.user.role] : ['guest'];

    // Check for user roles
    app.acl
      .areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), (err, isAllowed) => {
        if (err) {
          // An authorization error occurred.
          res.status(500).send('Unexpected authorization error');
        } else {
          if (isAllowed) {
            // Access granted! Invoke next middleware
            next();
          } else {
            res.status(403).json({
              message: 'User is not authorized',
            });
          }
        }
      });
  };

  return acl;
};
