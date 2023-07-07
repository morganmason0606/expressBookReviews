const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let userswithsamename = users.filter((user)=>{
        return user.username === username
    });
    if(userswithsamename.length > 0){
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
  
    if (authenticatedUser(username,password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
  
        req.session.authorization = {
            accessToken,username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const username = req.session.username;
    const review = req.query.review;
    const isbn = req.params.isbn;

    if(!(isbn in books)){return res.status(400).send("this isbn does not exist");}
    books[isbn].reviews[username] = review;
    return res.status(300).json({message: "added review"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    let isbn = req.params.isbn;
    let username = req.session.username;

    if(!isbn in books){return res.status(400).send("this isbn does not exist");}
    if(username in books[isbn].reviews)   
        delete books[isbn].reviews[username];
    return res.status(200).send("deleted review");
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
