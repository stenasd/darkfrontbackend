
const models = require('./db/models');
async function modelinit() {
    console.log("modelinit");
    await models.userModel.sync({ alter: true });
    await models.inRoom.sync({ alter: true });
    await models.messages.sync({ alter: true });
    await models.orders.sync({ alter: true });
    await models.listings.sync({ alter: true });
    await models.inListing.sync({ alter: true });
    await models.products.sync({ alter: true });
    await models.refkey.sync({ alter: true });
    await models.prodInOrder.sync({alter: true});
    await models.transactions.sync({alter: true});
    await models.usedAdresses.sync({alter: true});
    await models.ownedTXID.sync({alter: true});
}

modelinit()
