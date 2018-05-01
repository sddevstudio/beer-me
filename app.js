const express = require("express");
const userCheck = require("./middleware/middleware").userCheck;
const beer = require("./endpoint/beer");
const ratebeer = require("./endpoint/ratebeer");
const port = 3003;

const app = express();

app.use(userCheck);
app.use(express.json());
app.use(express.static("./public"))

// root entrypoint which is overridden with the public/index.html
app.get('/',(req, res) => {
    res.send('--==[BeerMe]==--');
});

// entrypoint to get beers
app.get('/beer',(req, res) => {
    // beer name to search
    let beerName = req.query.name;

    // make sure beer name exist
    if (beerName === undefined || beerName === '') {
        res.json({error:'missing beer name'});
        return;
    }

    beer.getBeers(beerName,res);
});

// entrypoint to rate a beer once per beer and user
app.post('/ratebeer',(req,res) =>{
    // beer id
    let id = req.query.id;

    // make sure id exist
    if (id === undefined || id === '') {
        res.json({error:'missing id'});
        return;
    }

    // beer rating range 1 - 5
    let rating = req.body.rating;
    // beer comment
    let comment = req.body.comment;
    // user email
    let user = req.headers['x-user'];

    // save rate and comment to db
    ratebeer.saveBeerRatingAndComment(id,rating,comment,user,res);

});

app.listen(port,(err) => {
    if (err) {
        return console.log('Unable to start: ', err);
    }
    console.log(`Server is listening on: ${port}`);
});