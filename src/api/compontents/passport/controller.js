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

exports.getUserProfile = async function (param) {
    let user = await service.getRawUserNick(param)
    if (await user) {
        let reviewRes = await service.getReviews(user.id)
        let reviews = await Promise.all(reviewRes.map(async function (param) {
            let returnobject = {
                text: param.text,
                rating: param.rating
            }
            return await returnobject
        }))
        let returnobject = {
            wonDisputes: user.wonDisputes,
            lostDisputes: user.lostDisputes,
            disc: user.disc,
            rating: user.rating,
            ratingNr: user.ratingNr,
            nick: user.nick,
            reviews: reviews
        }
        return await returnobject
    }
    return false

}
exports.signup = async function (obj) {
    let dupname = await findDuplicateUse(obj.name)
    let dupnick = await findDuplicateNick(obj.nick)
    let passduplicate = false;
    let passlenght = await checkLenght(obj.pass)
    let nameLenght = await checkLenght(obj.name)
    let nickLenght = await checkLenght(obj.nick)
    if (obj.pass != obj.pass2) {
        passduplicate = true
    }
    let resobj = {
        duplname: dupname, duplnick: dupnick, passlenght: passlenght,
        nameLenght: nameLenght, nickLenght: nickLenght, passduplicate,
        succ: false
    }
    if (dupname || dupnick || passlenght || nameLenght || nickLenght || passduplicate) {

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