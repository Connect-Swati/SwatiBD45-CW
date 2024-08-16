//npm install express sqlite3 sqlite
//node BD4.5_CW/initDB.js
//node BD4.5_CW
const { Console } = require("console");
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");

const app = express();
const PORT = process.env.PORT || 3000;
let db;

(async () => {
  db = await open({
    filename: "./BD4.5_CW/database.sqlite",
    driver: sqlite3.Database,
  });
})();

app.get("/", (req, res) => {
  res.status(200).json({ message: "BD4.5_CW" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

/*
Exercise 1: Filter Movies by Year and Actor

Create an endpoint /movies/year-actor to return all movies filtered by release year and actor.

Declare 2 variables releaseYear & actor to store query parameters.

Create a function filterByYearAndActor to fetch all movies from the database based on release year and actor.

Wrap the function call in a try-catch block.

Ensure that errors are caught and return res.status(500).json({ error: error.message }) if anything goes wrong.

Return a 404 error if no data is found.

API Call:

http://localhost:3000/movies/year-actor?releaseYear=2019&actor=Hrithik%20Roshan

Expected Response:

{
  movies: [
    {
      id: 10,
      title: 'War',
      director: 'Siddharth Anand',
      genre: 'Action',
      release_year: 2019,
      rating: 4.3,
      actor: 'Hrithik Roshan',
      box_office_collection: 100,
    },
  ],
}
*/
// fucntion to filter movies by year and actor
async function filterByYearAndActor(releaseYear, actor) {
  let query = `SELECT * FROM movies WHERE release_year = ? AND actor = ?`;
  try {
    if (!db) {
      throw new Error("Database not connected");
    }
    let result = await db.all(query, [releaseYear, actor]);
    if (!result || result.length == 0) {
      throw new Error(
        "No Movies found by actor :" +
          actor +
          " with release year :" +
          releaseYear,
      );
    }
    return { movies: result };
  } catch (error) {
    console.log("Error in fetching Movies ", error.message);
    throw error;
  }
}
//end point to filter movies by year and actor
app.get("/movies/year-actor", async (req, res) => {
  try {
    let releaseYear = req.query.releaseYear;
    let actor = req.query.actor;
    let result = await filterByYearAndActor(releaseYear, actor);
    console.log(
      "Succesfully fetched " +
        result.movies.length +
        " movies found by actor :" +
        actor +
        " with release year :" +
        releaseYear,
    );
    return res.status(200).json(result);
  } catch (error) {
    if (
      error.message ===
      "No Movies found by actor :" +
        actor +
        " with release year :" +
        releaseYear
    ) {
      return res.status(404).json({ status: 404, error: error.message });
    } else {
      return res.status(500).json({ status: 500, error: error.message });
    }
  }
});

/*
Exercise 2: Fetch Award Winning Movies

Create an endpoint /movies/award-winning to return all award-winning movies.

Create a function filterAwardWinningMovies to fetch all movies from the database with a rating of 4.5 or higher & order by rating in ascending.

Wrap the function call in a try-catch block.

Ensure that errors are caught and return res.status(500).json({ error: error.message }) if anything goes wrong.

Return a 404 error if no data is found.

API Call:

http://localhost:3000/movies/award-winning

Expected Response:

 {
  movies: [
    {
      id: 4,
      title: 'Bajrangi Bhaijaan',
      director: 'Kabir Khan',
      genre: 'Drama',
      release_year: 2015,
      rating: 4.5,
      actor: 'Salman Khan',
      box_office_collection: 130,
    },
    {
      id: 13,
      title: 'Andhadhun',
      director: 'Sriram Raghavan',
      genre: 'Thriller',
      release_year: 2018,
      rating: 4.5,
      actor: 'Ayushmann Khurrana',
      box_office_collection: 60,
    },
    {
      id: 3,
      title: 'PK',
      director: 'Rajkumar Hirani',
      genre: 'Comedy',
      release_year: 2014,
      rating: 4.6,
      actor: 'Aamir Khan',
      box_office_collection: 140,
    },
    {
      id: 17,
      title: 'Article 15',
      director: 'Anubhav Sinha',
      genre: 'Drama',
      release_year: 2019,
      rating: 4.6,
      actor: 'Ayushmann Khurrana',
      box_office_collection: 35,
    },
    {
      id: 2,
      title: 'Baahubali 2: The Conclusion',
      director: 'S.S. Rajamouli',
      genre: 'Action',
      release_year: 2017,
      rating: 4.7,
      actor: 'Prabhas',
      box_office_collection: 181,
    },
    {
      id: 18,
      title: 'URI: The Surgical Strike',
      director: 'Aditya Dhar',
      genre: 'Action',
      release_year: 2019,
      rating: 4.7,
      actor: 'Vicky Kaushal',
      box_office_collection: 70,
    },
    {
      id: 1,
      title: 'Dangal',
      director: 'Nitesh Tiwari',
      genre: 'Biography',
      release_year: 2016,
      rating: 4.8,
      actor: 'Aamir Khan',
      box_office_collection: 220,
    },
    {
      id: 8,
      title: '3 Idiots',
      director: 'Rajkumar Hirani',
      genre: 'Comedy',
      release_year: 2009,
      rating: 4.9,
      actor: 'Aamir Khan',
      box_office_collection: 202,
    },
  ],
}

*/
// function to filter award winning movies
async function filterAwardWinningMovies() {
  let query = "SELECT * FROM movies WHERE rating >= 4.5 ORDER BY rating ASC";
  try {
    if (!db) {
      throw new Error("Database not connected");
    }
    let result = await db.all(query, []);
    if (!result || result.length == 0) {
      throw new Error("No Movies found with rating >= 4.5");
    }
    return { movies: result };
  } catch (error) {
    console.log("Error in fetching Movies ", error.message);
    throw error;
  }
}
//end point to filter award winning movies
app.get("/movies/award-winning", async (req, res) => {
  try {
    let result = await filterAwardWinningMovies();
    console.log(
      "Succesfully fetched " + result.movies.length + " award winning movies",
    );
    return res.status(200).json(result);
  } catch (error) {
    if (error.message === "No Movies found with rating >= 4.5") {
      return res.status(404).json({ status: 404, error: error.message });
    } else {
      return res.status(500).json({ status: 500, error: error.message });
    }
  }
});
/*
Exercise 3: Fetch Blockbuster Movies

Create an endpoint /movies/blockbuster to return all blockbuster movies.

Create a function fetchBlockbusterMovies to fetch all movies from the database with a box office collection of 100 or more & order by box_office_collection in descending.

Wrap the function call in a try-catch block.

Ensure that errors are caught and return res.status(500).json({ error: error.message }) if anything goes wrong.

Return a 404 error if no data is found.

API Call:

http://localhost:3000/movies/blockbuster

Expected Response:

{
  movies: [
    {
      id: 1,
      title: 'Dangal',
      director: 'Nitesh Tiwari',
      genre: 'Biography',
      release_year: 2016,
      rating: 4.8,
      actor: 'Aamir Khan',
      box_office_collection: 220,
    },
    {
      id: 8,
      title: '3 Idiots',
      director: 'Rajkumar Hirani',
      genre: 'Comedy',
      release_year: 2009,
      rating: 4.9,
      actor: 'Aamir Khan',
      box_office_collection: 202,
    },
    {
      id: 2,
      title: 'Baahubali 2: The Conclusion',
      director: 'S.S. Rajamouli',
      genre: 'Action',
      release_year: 2017,
      rating: 4.7,
      actor: 'Prabhas',
      box_office_collection: 181,
    },
    {
      id: 3,
      title: 'PK',
      director: 'Rajkumar Hirani',
      genre: 'Comedy',
      release_year: 2014,
      rating: 4.6,
      actor: 'Aamir Khan',
      box_office_collection: 140,
    },
    {
      id: 4,
      title: 'Bajrangi Bhaijaan',
      director: 'Kabir Khan',
      genre: 'Drama',
      release_year: 2015,
      rating: 4.5,
      actor: 'Salman Khan',
      box_office_collection: 130,
    },
    {
      id: 5,
      title: 'Sultan',
      director: 'Ali Abbas Zafar',
      genre: 'Drama',
      release_year: 2016,
      rating: 4.3,
      actor: 'Salman Khan',
      box_office_collection: 120,
    },
    {
      id: 6,
      title: 'Sanju',
      director: 'Rajkumar Hirani',
      genre: 'Biography',
      release_year: 2018,
      rating: 4.4,
      actor: 'Ranbir Kapoor',
      box_office_collection: 120,
    },
    {
      id: 7,
      title: 'Padmaavat',
      director: 'Sanjay Leela Bhansali',
      genre: 'Drama',
      release_year: 2018,
      rating: 4.2,
      actor: 'Ranveer Singh',
      box_office_collection: 112,
    },
    {
      id: 9,
      title: 'Chennai Express',
      director: 'Rohit Shetty',
      genre: 'Comedy',
      release_year: 2013,
      rating: 4,
      actor: 'Shah Rukh Khan',
      box_office_collection: 100,
    },
    {
      id: 10,
      title: 'War',
      director: 'Siddharth Anand',
      genre: 'Action',
      release_year: 2019,
      rating: 4.3,
      actor: 'Hrithik Roshan',
      box_office_collection: 100,
    },
  ],
}

*/
// function to fetch blockbuster movies
async function fetchBlockbusterMovies() {
  let query =
    "SELECT * FROM movies WHERE box_office_collection >= 100 ORDER BY box_office_collection DESC";
  try {
    if (!db) {
      throw new Error("Database not connected");
    }
    let result = await db.all(query, []);
    if (!result || result.length == 0) {
      throw new Error("No Movies found with box_office_collection >= 100");
    }
    return { movies: result };
  } catch (error) {
    console.log("Error in fetching Movies ", error.message);
    throw error;
  }
}
//end point to fetch blockbuster movies
app.get("/movies/blockbuster", async (req, res) => {
  try {
    let result = await fetchBlockbusterMovies();
    console.log(
      "Succesfully fetched " + result.movies.length + " blockbuster movies",
    );
    return res.status(200).json(result);
  } catch (error) {
    if (error.message === "No Movies found with box_office_collection >= 100") {
      return res.status(404).json({ status: 404, error: error.message });
    } else {
      return res.status(500).json({ status: 500, error: error.message });
    }
  }
});
