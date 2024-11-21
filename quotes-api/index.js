// const express = require('express');
// const app = express();
const quotesJSONArray = require('./quoteSource.json');
// const port = 3000;
// // mongodb connection setup
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const cors = require('cors')
// require('dotenv').config()

// // // mongodb Connection
// // mongoose.connect(process.env.DB_CONNECTION_URL, { useNewUrlParser: true}, (err) => {
// //     if(err){
// //         console.error(err);
// //     } else {
// //         console.log("connected");
// //     }
// // });

// //mongodb connection using async/await
// async function connectDB() {
//     try{

//         const conn = await mongoose.connect(process.env.DB_CONNECTION_URL);
//         conn;
//         // await mongoose.connect(process.env.DB_CONNECTION_URL, {
//         //     useNewUrlParser: true,
//         //     useUnifiedTopology: true, // to avoid deprecation warnings
//         // });
//         console.log('MongoDB conencted');
//         console.log(`${conn.connection.host}`);
        
//     } catch (err) {
//         console.error('MongoDB connection error:', err);
//     }
// }

// connectDB()

// // allow localhost access in frontend

// app.use(cors())

// // routes for quotes
// const quotesRoute = require('./routes/quotes');
// app.use(bodyParser.json());
// app.use('/quotes', quotesRoute);
// app.get('/', (req, res) => {
//     res.send('Hello again')
// });

// app.get('/',(req, res) => {
//     res.send('Hey, want a quote?')
// });



// app.listen(port, () => {
//     console.log(`Example of app listening at http://localhost:${port}`)
// });

const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

// MongoDB connection setup
// async function connectDB() {
//     try {
//         const conn = await mongoose.connect(process.env.DB_CONNECTION_URL);
//         console.log('MongoDB connected');
//         console.log(`${conn.connection.host}`);
//     } catch (err) {
//         console.error('MongoDB connection error:', err);
//     }
// }

// Quote model (ensure it's in models/quote.js)
const Quote = require('./models/Quotes');

async function connectDB() {
    try {
        const conn = await mongoose.connect(process.env.DB_CONNECTION_URL);
        console.log('MongoDB connected');

        // Check if there are documents in the 'Quotes' collection
        const quotesCount = await Quote.countDocuments();
        if (quotesCount > 0) {
            console.log(`${quotesCount} quotes found in the database.`);
        } else {
            console.log('No quotes found in the database.');
        }

        console.log(`${conn.connection.host}`);
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
}

connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());



// Routes for quotes
app.get('/', (req, res) => {
    res.send('Hey, want a quote?');
});

app.get('/quotes', async (req, res) => {
    try {
        const quotes = await Quote.find(); // Fetch all quotes from MongoDB
        res.json(quotes);
    } catch (err) {
        res.status(500).send('Error fetching quotes');
    }
});

app.get('/quotesList',(req, res) => {
    res.send({'quotesList': quotesJSONArray});
});

app.get('/random', (req, res) => {
    const randomNumber = Math.floor(Math.random() * 21);
    const quoteItem = quotesJSONArray[randomNumber];
    res.send(quoteItem);
});

// app.get('/randomQuote', async (req, res) => {
//     try {
//         const count = await Quote.countDocuments(); // Get the number of quotes
//         const randomIndex = Math.floor(Math.random() * count); // Generate a random index
//         const randomQuote = await Quote.findOne().skip(randomIndex); // Fetch a random quote
//         res.json(randomQuote);
//     } catch (err) {
//         res.status(500).send('Error fetching random quote');
//     }
// });
app.get('/randomQuote', async (req, res) => {
    try {
        const count = await Quote.countDocuments(); // Get the number of quotes in the database
        if (count === 0) {
            return res.status(404).send('No quotes available');
        }
        
        const randomIndex = Math.floor(Math.random() * count); // Generate a random index
        const randomQuote = await Quote.findOne().skip(randomIndex); // Skip to the random index and fetch the quote

        // Check if randomQuote is null
        if (!randomQuote) {
            return res.status(500).send('Error fetching random quote');
        }

        res.json(randomQuote);
    } catch (err) {
        console.error('Error fetching random quote:', err);
        res.status(500).send('Error fetching random quote');
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
