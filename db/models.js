const { DataTypes } = require('sequelize');
const seq = require('./index');
const { sequelize } = seq;


/* 
models-chat = chat_session chat_message= chat session id 
chat_message= id-sessionid-autor    will creat a new room when a request has been sent


*/



const userModel = sequelize.define('userList', {
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
    },
    pass: {
        type: DataTypes.STRING,

    },
    nick: {
        type: DataTypes.STRING,
    },
    refkey: {
        type: DataTypes.STRING,
    },
}, {

});
exports.userModel = userModel;
const transactionRoom = sequelize.define('transRoom', {
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    roomid: {
        type: DataTypes.INTEGER,
    },
}, {

});
exports.transactionRoom = transactionRoom;

const partic = sequelize.define('partic', {
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    room: {
        type: DataTypes.INTEGER,
    },
    seller: {
        type: DataTypes.BOOLEAN,
    },
}, {

});
exports.partic = partic;
const messages = sequelize.define('messages', {
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    roomid: {
        type: DataTypes.INTEGER,
    },
    userid: {
        type: DataTypes.INTEGER,
    },
    text: {
        type: DataTypes.STRING,
    },
    image: {
        type: DataTypes.STRING,
    },

}, {

});

exports.messages = messages;

const refkey = sequelize.define('messages', {
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    referalcode: {
        type: DataTypes.INTEGER,
    }
}, {
});

exports.refkey = refkey;

