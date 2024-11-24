// Import the Express framework for creating the server
const express = require('express');
const app = express();
const port = 4000; // Define the port number the server will listen on

// Import and use CORS middleware to enable Cross-Origin Resource Sharing
const cors = require('cors');
app.use(cors());

// Middleware to set HTTP headers for enabling CORS and allowing specific HTTP methods and headers
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // Allow requests from any origin
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"); // Allow specified HTTP methods
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); // Allow specified headers
  next(); // Pass control to the next middleware function
});

// Import and configure body-parser to parse incoming request bodies
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(bodyParser.json()); // Parse JSON bodies

// Import mongoose for interacting with MongoDB
const mongoose = require('mongoose');
// Connect to the MongoDB database using mongoose
mongoose.connect('mongodb+srv://admin:admin@martinscluster.w5rtkz0.mongodb.net/DB14');

// Define a Mongoose schema for the movie documents
const movieSchema = new mongoose.Schema({
  title: String, // Title of the movie
  year: String,  // Release year of the movie
  poster: String // URL for the movie poster
});

// Create a Mongoose model based on the schema
const movieModel = new mongoose.model('myMovies', movieSchema);

// Route to fetch all movies from the database
app.get('/api/movies', async (req, res) => {
  const movies = await movieModel.find({}); // Retrieve all movies
  res.status(200).json({ movies }); // Send movies as JSON response
});

// Route to fetch a single movie by its ID
app.get('/api/movie/:id', async (req, res) => {
  const movie = await movieModel.findById(req.params.id); // Find a movie by its ID
  res.json(movie); // Send the movie as JSON response
});

// Route to add a new movie to the database
app.post('/api/movies', async (req, res) => {
  console.log(req.body.title); // Log the movie title received in the request body
  const { title, year, poster } = req.body; // Destructure movie details from the request body

  const newMovie = new movieModel({ title, year, poster }); // Create a new movie document
  await newMovie.save(); // Save the new movie to the database

  res.status(201).json({ "message": "Movie Added!", Movie: newMovie }); // Send a success response
});

// Duplicate route for fetching a movie by ID (not needed as it duplicates the earlier route)
app.get('/api/movie/:id', async (req, res) => {
  let movie = await movieModel.findById({ _id: req.params.id }); // Find a movie by its ID
  res.send(movie); // Send the movie as the response
});

// Route to update a movie by its ID
app.put('/api/movie/:id', async (req, res) => {
  let movie = await movieModel.findByIdAndUpdate(req.params.id, req.body, { new: true }); // Update movie details
  res.send(movie); // Send the updated movie as the response
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`); // Log the server's URL
});
