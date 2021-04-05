const service = require('./service');
exports.findById = function (id, cb) {
    process.nextTick(async function () {
        var idx = await service.getRawUserId(id)
        if (idx) {
            cb(null, idx);
        } else {
            cb(new Error('User ' + id + ' does not exist'));
        }
    });
}
//if find atleast 1 in database return userobject
exports.findByUsername = function (username, cb) {
    process.nextTick(async function () {
        let a = await service.getRawUserName(username)
        return cb(null, a);

    });
}
exports.getUserFromId = async function (id) {
    return await service.getRawUserId(id)
}


exports.signup = async function (obj) {
    console.log(obj);
    let dupname = await findDuplicateUse(obj.name)
    let dupnick = await findDuplicateNick(obj.nick)
    let passlenght = await checkLenght(obj.pass)
    let nameLenght = await checkLenght(obj.name)
    let nickLenght = await checkLenght(obj.nick)
    let resobj = {
        duplname: dupname, duplnick: dupnick, passlenght: passlenght,
        nameLenght: nameLenght, nickLenght: nickLenght,
        succ: false
    }
    console.log(resobj);
    if (dupname || dupnick || passlenght || nameLenght || nickLenght) {
        console.log("failed signup");
        return resobj
    }
    let creatuser = await service.creatUser(obj)
    if (await creatuser) {
        resobj.succ = true
        return resobj
    }
}

async function findDuplicateUse(user) {
    let username = await service.getRawUserName(user)
    if (username) {
        return true
    } else { return false }
}
async function findDuplicateNick(nick) {
    let nickname = await service.getRawUserNick(nick)
    if (nickname) {
        return true
    } else { return false }
}
function checkLenght(param) {

    console.log(param.length)
    if (3 > param.length) {
        console.log("toshort");
        return true
    }
    if (param.length > 20) {
        console.log("!toshort");
        return true
    }
    return false
}