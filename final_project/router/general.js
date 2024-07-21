const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(300).json({message: books});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  let book = books[isbn];
  if(book){
    return res.status(300).json({message: book});
  }
  else{
    res.status(404).json({ message: "No books found by this ISBN" });
  }
 });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const bookKeys = Object.keys(books);
    const booksByAuthor = bookKeys.filter(key => books[key].author.toLowerCase() === author.toLowerCase()).map(key => books[key]);

    if (booksByAuthor.length > 0) {
        res.json(booksByAuthor);
    } else {
        res.status(404).json({ message: "No books found by this author" });
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const bookKeys = Object.keys(books);
    const booksByTitle = bookKeys.filter(key => books[key].title.toLowerCase() === title.toLowerCase()).map(key => books[key]);

    if (booksByTitle.length > 0) {
        res.json(booksByTitle);
    } else {
        res.status(404).json({ message: "No books found by this title" });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  let reviewsByISBN = books[isbn].reviews;
  if(reviewsByISBN.length > 0){
    return res.status(300).json({message: reviewsByISBN});
  }
  else{
    res.status(404).json({ message: "This ISBN has no reviews" });
  }
});

module.exports.general = public_users;
