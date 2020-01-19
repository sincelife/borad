const path = require('path');
const {sequelize, Sequelize} = require(path.join(__dirname, "../modules/sequelize-conn"));

class User extends Model{}
//const Model = Sequelize.Model;
sequelize.authenticate().then(() => {
    User.init({
        username: {type: Sequelize.STRING},
        userid: {type: Sequelize.STRING},
        age: {type: Sequelize.INTEGER},
    },{
        sequelize,
        modelName: "user"
    });
    User.sync({forced: false});
});
module.exports = User;























