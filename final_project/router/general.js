const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    if (username && password) {
        if (!doesExist(username)) { 
          users.push({"username":username,"password":password});
          return res.status(200).json({message: "User successfully registred. Now you can login"});
        } else {
          return res.status(404).json({message: "User already exists!"});    
        }
    } 
    return res.status(404).json({message: "Unable to register user."});
    

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.status(200).send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    if(isbn in books){
        return res.status(200).send(books[isbn]);
    }else {
        return res.status(400).send('there is no book with that ISBN number.');
    }
  
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;
  let booksByAuthor = []
  for (isbn in books){
      let book = books[isbn];
      if (book.author === author){booksByAuthor.push(book);}
  }
  if(booksByAuthor.length>0){
      return res.status(200).send(booksByAuthor)
  }else{
      return res.status(400).send("There are no books by that author");
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title;
    let booksWTitle = []
    for (isbn in books){
        let book = books[isbn];
        if (book.title === title){booksWTitle.push(book);}
    }
    if(booksWTitle.length>0){
        return res.status(200).send(booksWTitle)
    }else{
        return res.status(400).send("There are no books by that title");
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    if(isbn in books){
        return res.status(200).send(books[isbn].reviews);
    }else {
        return res.status(400).send('there is no book with that ISBN number.');
    }
});


module.exports.general = public_users;
