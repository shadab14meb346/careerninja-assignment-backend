const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const cors = require('cors');
const errorHandler = require('./middleware/error');
const {connectDB} = require('./config/db');

// Load env vars
dotenv.config({path: './config/config.env'});

// Connect to database
connectDB();

// Route files
const routes = require('./routes/routes');

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Mount routers
app.use('/battle-api', routes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(
	PORT,
	console.log(
		`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
	)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
	console.log(`Error: ${err.message}`.red);
});
