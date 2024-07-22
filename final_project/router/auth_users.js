const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    // Filter the users array for any user with the same username
    let validusers = users.filter((user) => {
        return (user.username === username);
    });
    // Return true if any user with the same username is found, otherwise false
    return validusers.legnth > 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let authenticatedusers = users.filter((user) => {
        return (user.username === username && user.password === password)
    })
    //Return true if the username and the password match to an already registered user
    if (authenticatedusers.length > 0) {
        return true;
    } else {
        return false;
    }
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const review = req.query.review;
    const username = req.session.authorization.username;
    const isbn = req.params.isbn;

    // Add or modify the review
    books[isbn].reviews = { ...books[isbn].reviews, [username]: review };

    return res.status(200).json({
        message: `Successfully added review for the ISBN ${isbn}`,
        book: books[isbn]
    });
});


// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const username = req.session.authorization.username;
    const isbn = req.params.isbn;
    const bookReviews = books[isbn].reviews;
    delete bookReviews[username];
    // return res.status(200).json();
    return res.status(200).json({
        message: 'Successfully deleted review for the ISBN ${isbn}',
        book: books[isbn]
    });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
