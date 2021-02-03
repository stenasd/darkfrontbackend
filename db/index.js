// https://dev.to/lars124/how-i-structure-my-rest-apis-11k4
// https://github.com/aionic-org/aionic-core/tree/master/src
const colors = require('colors');
const { Sequelize } = require('sequelize');

// Option 2: Passing parameters separately (other dialects)
const sequelize = new Sequelize('main', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
  logging: msg => console.log(msg.magenta)
});

exports.start = async function mysqlConnection() {
  try {
    await sequelize.authenticate();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }


};
exports.sequelize = sequelize;