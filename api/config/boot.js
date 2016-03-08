import https from 'https';
import fs from 'fs';

module.exports = app => {
  if (process.env.NODE_ENV !== 'test') {
    const credentials = {
      key: fs.readFileSync('api/config/certs/mean.key', 'utf8'),
      cert: fs.readFileSync('api/config/certs/mean.cert', 'utf8'),
    };
    app.db.sequelize.sync().done(() => {
      https.createServer(credentials, app)
        .listen(app.get('port'), () => {
          console.log(`NTask API - Port ${app.get('port')}`);
        });
    });
  }
  else {
    app.db.sequelize.sync().done(); 
  }
};
