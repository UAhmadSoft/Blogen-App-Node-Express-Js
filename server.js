// const app = require('./app');
var server;
// console.log(app);
const port = process.env.PORT || 3000;
module.exports.getServer = () => server;
module.exports.appListen = (app) => {
  server = app.listen(port, () => {
    console.log(`listening to PORT ${port}`);
  });
};
