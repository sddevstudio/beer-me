const NoSQL = require("nosql");
const db = {
    'beers':NoSQL.load('./db/beers.nosql'),
    'ratings': NoSQL.load('./db/rating.nosql')
};

module.exports = {
    saveBeerRatingAndComment: (id,rating,comment,user,res) =>{
        // valid if valid beer id had been previously queried
        module.exports.validBeer(id,() => {
            // valid beer id found
    
            // check for valid rating 
            if (rating === undefined || rating < 1 || rating > 5) {
                res.json({error:'invalid rating, rating between 1 - 5'});
                return;
            }
    
            // save to database
            db['ratings'].insert({
            // beerUserId:beerUserId,
                beerId:id,
                rating:rating,
                comment:comment,
                user:user
            },true).where('beerId',id).and().where('user',user).callback((err,o,c) => {
                newEntry = o;
                if (o == 1){
                    res.json({
                        id:id,
                        success:true
                    });
                } else {
                    res.json( {
                        id:id,
                        success:false,
                        error:"already saved rating, only allowed one entry"    
                    });
                }
            });
        },() => {
            // invalid - missing beer id
            res.json({error:"id does not exist"});
        });    
    },
    validBeer: (id,success,failed) => {
        // check if the beer has been added to the database
        db['beers'].find().make((filter) => {
            filter.where('id', parseInt(id)); 
            filter.callback((err,res, count) => {
                if (count > 0){
                    success();
                    return;
                } else {
                    failed();
                    return;
                }
            });
        });
    }
};