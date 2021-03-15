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
    console.log(adrr);
    return adrr
  }
}
exports.getCurrentAdress = async function (userid) {
  let a =  await service.getUsedAdressWhereID(userid)
  console.log(a);
  return a
}
exports.sync = async function () {
  console.log("sync transactions");
  let wallet = await client.listTransactions();
  /*
  wallet.forEach(async element => {
    let foundadress = await service.getTXID(element.txid)
    if (!foundadress) {
      console.log(element.amount)
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
          console.log(userobj.btc)
          service.updateUser(sendobject)
         
        }
        //add funds to user account
      }
    }
  })

*/
  for(const element of wallet){
    let foundadress = await service.getTXID(element.txid)
    if (!foundadress) {
      console.log(element.amount)
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
          console.log(userobj.btc+" "+element.amount)
          console.log("sendamoutn"+JSON.stringify(sendobject))
          service.updateUser(sendobject)
         
        }
        //add funds to user account
      }
    }


  }
}