
//club.routes.js

const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const Club = require("../models/Club.model");
const Game = require("../models/Game.model");
const { isAuthenticated } = require('./../middleware/jwt.middleware.js'); 
const router = require("./auth.routes");

// ROUTES //

// ***** GET for games (list when creating a club)
router.get("/create", (req, res, next) => {
    Game.find()
    .then((gamesList) => {
        res.status(200).json( {game: gamesList});
    })
    .catch(err => {
        res.status(500).json( {message: "Error while retrieving games list"})
    })
});
    
// ***** POST for /createClub
router.post("/create", isAuthenticated, (req, res, next) => {
    const { name, games } = req.body;
    const { _id } = req.payload;

    if ( name === "") {
        res.status(400).json({message: "Your club must have a name!"});
             return;
    }

    if ( games === "") {
        res.status(400).json({message: "You run a card club that plays no games??"});
             return;
    }

    return Club.create({ name: name, games: games, owner: _id})
     .then((createdClub) => { //return the created Club
        const { name, games } = createdClub;
        const club = { name, games };
        res.status(201).json({club: club}); //201 means 'created'
     })
     .catch(err => {
         console.log(err);
         res.status(500).json({message: "Server error on club creation"});
     });
});

// ***** GET for /clubDetails/:id
router.get("/clubDetails/:id", (req, res, next) => { //does not require authentication so that owner can share with members
    const { id } = req.params;
    
    Club.findById(id)
    .populate('games')
    .then((foundClub) => {
        if(!foundClub) {
            res.status(404).json({message: "Club not found"})
        }
     
        console.log(foundClub);
        res.status(200).json({club: foundClub})
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({message: "Server error on club creation"});
        });
});


module.exports = router;