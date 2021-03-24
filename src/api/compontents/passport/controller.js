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

    let dupname = await findDuplicateUse(obj.name)
    let dupnick = await findDuplicateNick(obj.nick)
    let resobj = { duplname: dupname, duplnick: dupnick, succ: false }
    if (dupname) {

        return resobj
    }
    if (dupnick) {

        return resobj
    }
    let creatuser = await service.creatUser(obj)
    if (creatuser) {
        resobj.succ = true
        return resobj
    }
}

async function findDuplicateUse(user) {
    let username = await service.getRawUserName(user)
    if (username) {
        return true
    }
    else { return false }
}
async function findDuplicateNick(nick) {
    if (nickname) {
        return true
    } else { return false }
}


