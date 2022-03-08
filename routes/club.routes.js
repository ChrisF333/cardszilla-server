
//club.routes.js

const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const Club = require("../models/Club.model");
const Game = require("../models/Game.model");
const Record = require("../models/Record.model");
const { isAuthenticated } = require('./../middleware/jwt.middleware.js'); 
const router = require("./auth.routes");
const Member = require("../models/Member.model");

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
    const userId = _id;

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
        const { _id, name, games } = createdClub;
        const club = { _id, name, games };
        res.status(201).json({club: club}); //201 means 'created'
        return User.findByIdAndUpdate( userId, {$push: {ownedClubs: club._id}} );        
     })
     .catch(err => {
         console.log(err);
         res.status(500).json({message: "Server error on club creation"});
     });
});

// ***** PUT for /update clubs
router.put('/update/:id', (req, res, next) => {
    const { name, games } = req.body;
    const { id } = req.params;

    Club.findByIdAndUpdate(id, {$set: {name: name, games: games}})
    .then(() => {
        res.status(200).json({message: "Club updated"}); 
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({message: "Server error on club update"});
    });
})

// ***** GET for /getUserClubs
router.get('/userClubs', isAuthenticated, (req, res, next) => {
    const { _id } = req.payload

    User.findById(_id)
    .populate('ownedClubs')
    .then((foundClubs) => {
        res.status(200).json( {clubs: foundClubs});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({message: "Server error on club search"});
    });
})

// ***** GET for /clubDetails/:id
router.get("/clubDetails/:id", (req, res, next) => { //does not require authentication so that owner can share with members
    const { id } = req.params;
    
    Club.findById(id)
    .populate('games')
    .populate('members')
    .then((foundClub) => {
        if(!foundClub) {
            res.status(404).json({message: "Club not found"})
        }
        res.status(200).json({club: foundClub})
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({message: "Server error on retrieving club details"});
        });
});

// ***** GET for /clubRecordCard/:id
router.get('/clubRecordCard/:id', (req,res, next) => {
    const { id } = req.params;

    if(id === "undefined") {
        res.status(200).json({message: "No record found for this club"})
    } else {
        Record.findById(id) //foundRecords.sort({ eventDate: -1}).limit(5) //sort to get most recent records and limit to last five
        .populate('record.game')
        .populate('record.winner')
        .then((foundRecords) => {
            if(!foundRecords) {
                res.status(200).json({message: "No events found"})
            }
           /* //sort by event date and then filter last five events for return
            let forReturn = foundRecords.record
            forReturn = forReturn.sort(function(a, b) {
                return b.eventDate - a.eventDate;
             });
            forReturn = forReturn.slice(0,5)*/
    
            res.status(200).json({recordCard: foundRecords})
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({message: "Error retrieving record card"})
        });
    }
})

// ***** POST for /createMember/:id
router.post('/createMember/:id', (req,res, next) => {
    const { id } = req.params;
    const { name, nickname, wins, losses } = req.body;

    Member.create( {name: name, nickname: nickname, wins: wins, losses: losses}) 
    .then((newMember) => {
       return Club.findByIdAndUpdate(id, {$push: {members: newMember._id}}); //must return for this to take effect
    })
    .then(() => {
        res.status(201).json({message: "Member created and added to club"})
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({message: "Error on adding member"})
    });
    
})

// ***** POST for /createEvent/:id
router.post('/createEvent/:id', (req,res, next) => {
    const { id } = req.params;
    const { record, eventDate, game, winner, participants } = req.body;
    
    if (!record) { //if there's no record yet, we need to create one and add it to the club
        Record.create({record: { eventDate: eventDate, game: game, winner: winner, participants: participants }})
        .then((newRecord) => {
            return Club.findByIdAndUpdate(id, {$set: { record: newRecord._id}});
        })
        .then(() => {
            res.status(201).json({message: "Record and event created and added to club"})
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({message: "Error on creating event"});
        });
    } else { //if there is a record then we need to find and update it with the new event
        Record.findByIdAndUpdate(record, {$push: {record: {eventDate: eventDate, game: game, winner: winner, participants: participants}}})
        .then((newRecord) => {
            const latestObjectNumber = newRecord.length
            Record.updateOne(
                 { record: { $elemMatch: { _id: newRecord._id } } },
                 {
                     $push: { "record.$.participants": participants}
                 }
            )
        })
        .then(() => {
            res.status(201).json({message: "Event created and added to club"})
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({message: "Error on adding event"});
        });
    }
})

//***** POST for /deleteEvent/:id
router.post('/deleteEvent/:id', (req,res, next) => {
    //console.log(req.params, req.body.eventId);
    const { id } = req.params;
    const { eventId } = req.body;
    
    Record.findOneAndUpdate({ _id: id},
        { $pull: { record: { _id: eventId }}},
        function(err,result){
            console.log(result);
        }        
    );
    return res.status(200).json({ message: "Event deleted" });
})

//***** POST for /deleteMember/
router.post('/deleteMember/', (req,res, next) => {
    const { memberId } = req.body;
    
    Member.findByIdAndRemove(memberId)
    .then(() => {
        return res.status(200).json({ message: "Member deleted" });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({message: "Error on deleting member"});
    })
})

// ***** POST for /delete/ club
router.post('/delete/', (req,res, next) => {
    const { clubId } = req.body;

    Club.findByIdAndRemove(clubId)
    .then(() => {
        return res.status(200).json({ message: "Club deleted" });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({message: "Error on deleting club"});
    })

})

module.exports = router;