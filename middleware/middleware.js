const NoSQL = require("nosql");
const db = {
    'audit': NoSQL.load('./db/audit.nosql')
};

// check's x-user header and saves basic audit trail to db 
// ** allows access to the root '/' **
module.exports = {
    userCheck: (req, res, next) => {
        // header user email
        let user = req.headers['x-user'];
        // log data for audit
        let log = {
            date: new Date,
            user: req.headers['x-user'],
            method: req.method,
            url: req.url,
            authenticated: false
        };
        
        // proceed if root or valid user
        if (req.url == '/' || module.exports.validateUser(user)) {
            // user is valid proceed
            log['authenticated'] = true;
            module.exports.loggerSaveToDb(log);
            next();
        } else {
            // user is invalid display error
            module.exports.loggerSaveToDb(log);
            res.json({error:"Invalid user"});
        }   
    },
    loggerSaveToDb:(save) => {
        // helper to insert audit data into the db
        db['audit'].insert(save);
    },
    validateUser: (user) => {
        // regex to validate email address
        let mailFormat = /^\w+([\.\+-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
        if (user !== undefined && mailFormat.test(user)) {
            return true;
        } else {
            return false;
        }
    }
}