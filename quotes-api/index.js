const express = require('express');
const app = express();
const quotesJSONArray = require('./quoteSource.json');
const port = 3000;

app.get('/',(req, res) => {
    res.send('Hey, want a quote?')
});

app.get('/quotesList',(req, res) => {
    res.send({'quotesList': quotesJSONArray});
});

app.get('/randomQuote', (req, res) => {
    const randomNumber = Math.floor(Math.random() * 21);
    const quoteItem = quotesJSONArray[randomNumber];
    res.send(quoteItem);
});

app.listen(port, () => {
    console.log(`Example of app listening at http://localhost:${port}`)
});