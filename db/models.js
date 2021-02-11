const { DataTypes } = require('sequelize');
const seq = require('./index');
const { sequelize } = seq;


/* 
models-chat = chat_session chat_message= chat session id 
chat_message= id-sessionid-autor    will creat a new room when a request has been sent


*/



const userModel = sequelize.define('userModel', {
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


const inRoom = sequelize.define('inRoom', {
    // Model attributes are defined here
    userid: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    inroom: {
        type: DataTypes.INTEGER,
    },
}, {

});
exports.inRoom = inRoom;
const chatRoom = sequelize.define('chatRoom', {
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    orderid: {
        type: DataTypes.INTEGER,
    },
    seller: {
        type: DataTypes.INTEGER,
    },
    titel: {
        type: DataTypes.STRING,
    },
}, {

});
exports.chatRoom = chatRoom;
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

const refkey = sequelize.define('refkey', {
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

const orders = sequelize.define('orders', {
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
    sellerid: {
        type: DataTypes.INTEGER,
    },
    productid: {
        type: DataTypes.INTEGER,
    },

}, {

});
exports.orders = orders
const products = sequelize.define('products', {
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    sellerid: {
        type: DataTypes.INTEGER,
    },
    name: {
        type: DataTypes.STRING,
    },
    price: {
        type: DataTypes.STRING,
    },
}, {

});
exports.products = products

const listings = sequelize.define('listings', {
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    sellerid: {
        type: DataTypes.INTEGER,
    },
    name: {
        type: DataTypes.STRING,
    },
}, {
});
exports.listings = listings
const inListing = sequelize.define('inListing', {
    // Model attributes are defined here
    productid: {
        type: DataTypes.INTEGER,
        
    },
    listingid: {
        type: DataTypes.INTEGER,
    },
}, {

});
exports.inListing = inListing

