const express = require('express');
const app = express();
const quotesJSONArray = require('./quoteSource.json');
const port = 3000;
// mongodb connection setup
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors')
require('dotenv').config()

// mongodb no longer takes callback function with the connect() method
// mongoose.connect(process.env.DB_CONNECTION_URL, { useNewUrlParser: true}, (err) => {
//     if(err){
//         console.error(err);
//     } else {
//         console.log("connected");
//     }
// });

//mongodb connection using async/await
async function conneciton() {
    try{
        await mongoose.connect(process.env.DB_CONNECTION_URL, {
            userNewUrlParser: true,
            useUnifiedTopology: true, // to avoid deprecation warnings
        });
        console.log('MongoDB conencted');
    } catch (err) {}
}

// allow localhost access in frontend

app.use(cors())

// routes for quotes
const quotesRoute = require('./routes/quotes');
app.use(bodyParser.json());
app.use('/quotes', quotesRoute);
app.get('/', (req, res) => {
    res.send('Hello again')
});

// app.get('/',(req, res) => {
//     res.send('Hey, want a quote?')
// });

// app.get('/quotesList',(req, res) => {
//     res.send({'quotesList': quotesJSONArray});
// });

// app.get('/randomQuote', (req, res) => {
//     const randomNumber = Math.floor(Math.random() * 21);
//     const quoteItem = quotesJSONArray[randomNumber];
//     res.send(quoteItem);
// });

app.listen(port, () => {
    console.log(`Example of app listening at http://localhost:${port}`)
});