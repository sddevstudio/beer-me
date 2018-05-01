const request = require("request");
const NoSQL = require("nosql");
const cache = require("memory-cache");
const db = {
    'beers':NoSQL.load('./db/beers.nosql')
};

module.exports = {
    getBeers: (beerName,res) => {
        // check cache, if not cached yet grab from api
        if (!cache.get(beerName)) {
            console.log(beerName,'beer: api request');
            module.exports.requestBeers(beerName,res);
        } else {
            console.log(beerName,'beer: cached request');
            module.exports.outputBeers(cache.get(beerName),res);
        }
    },
    requestBeers: (beerName,res) => {
        // url to beer API
        let url = 'https://api.punkapi.com/v2/beers?beer_name=' + beerName;

        // request data from beer API
        request(url, function (error, response, body) {
            // check if response is good
            if (!error && response.statusCode == 200) {
                //parse
                let results;
                try {
                    results = JSON.parse(body);
                    cache.put(beerName,results);
                } catch(err) {
                    results = [];
                }
                module.exports.addBeersToDb(results);
                module.exports.outputBeers(results,res);
            }
        });
    },
    addBeersToDb: (beers) => {
        // iterate through all beers and update/add to DB (could limit data inputed but dumping all data)
        beers.map((beer,i,beers) => {
            db['beers'].modify(beer,beer).where('id',beer.id)
        });
        
    },
    outputBeers: (beersArray,res) => {
        let beers = [];
        beersArray.map(beer => {
            let b = {
                id:beer.id,
                name:beer.name,
                description:beer.description, 
                first_brewed:beer.first_brewed, 
                food_pairings:beer.food_pairings
            }
            beers.push(b);
        });
        res.json(beers);
    } 
};