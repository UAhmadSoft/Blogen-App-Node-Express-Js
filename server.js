// const app = require('./app');
var server;
// console.log(app);
// console.log('environment variables are: ', process.env);

const port = process.env.PORT || 4000;
module.exports.getServer = () => server;
module.exports.appListen = (app) => {
  server = app.listen(port, () => {
    console.log(`listening to PORT ${port}`);
  });
};
