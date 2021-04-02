const Client = require('bitcoin-core');
const service = require('./service');

const client = new Client({
  username: 'test',
  password: 'test1',
  wallet: 'testwallet2',
  network: 'testnet'
});

exports.creatnewadress = async function (userid) {
  const adrr = await client.getNewAddress()
  let insertobject = { userid: userid, adress: adrr }
  let res = await service.addUsedAdress(insertobject)
  if (res) {
    return adrr
  }
}
exports.getCurrentBalance = async function (userid) {
  //service get txid where userid
  let a = await service.getRawUserId(userid)

  return a.btc
}
exports.getCurrentAdress = async function (userid) {
  //service get txid where userid
  let a = await service.getUsedAdressWhereID(userid)

  return a
}
exports.getTXIDS = async function (userid) {
  let a = await service.getTXID(userid)
  return a
}
exports.sync = async function () {

  let wallet = await client.listTransactions();
  /*
  wallet.forEach(async element => {
    let foundadress = await service.getTXID(element.txid)
    if (!foundadress) {

      let adresSuc = await service.addTransactions({
        txid: element.txid,
        adress: element.address,
        amount: element.amount,
        type: element.category
      })
      if (adresSuc) {
        let usedAdress = await service.getUsedAdress(element.address)
        if(usedAdress){
          let userobj = await service.getRawUserId(usedAdress.userid)
          let sendamount = parseFloat (userobj.btc) + parseFloat(element.amount)
          let sendobject = { id: userobj.id, btc: sendamount }

          service.updateUser(sendobject)zzzz
         
        }
        //add funds to user accountz
      }
    }
  })

*/
  for (const element of wallet) {
    let foundadress = await service.getTXID(element.txid)
    if (!foundadress) {

      let adresSuc = await service.addTransactions({
        txid: element.txid,
        adress: element.address,
        amount: element.amount,
        type: element.category
      })
      if (adresSuc) {
        let usedAdress = await service.getUsedAdress(element.address)
        if (usedAdress) {
          let userobj = await service.getRawUserId(usedAdress.userid)
          let sendamount = parseFloat(userobj.btc) + parseFloat(element.amount)
          let sendobject = { id: userobj.id, btc: sendamount }
          service.updateUser(sendobject)
          let sendTXID = {
            txid: element.txid, userid: userobj.id
          }
          service.addTXID(sendTXID)

        }
        //add funds to user account
      }
    }


  }
}