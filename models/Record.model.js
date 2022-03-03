
//Record.model.js

const {Schema, model} = require('mongoose');

const recordSchema = new Schema (
    {
        eventDate: Date,
        game: { 
            type: Schema.Types.ObjectId
            ,ref: "Game"
        },
        winner: {
            type: Schema.Types.ObjectId
            ,ref: "Member"
        },
        particpants: [
            {
                type: Schema.Types.ObjectId
                ,ref: "Member"
            }
        ],
    },
    {
        timestamps: true, //`createdAt` and `updatedAt`
    } 
)

const Record = model("Record", recordSchema);

module.exports = Record;