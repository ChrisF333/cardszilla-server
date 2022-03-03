
//Club.model.js

const { Schema, model} = require('mongoose');

const clubSchema = new Schema (
    {
        name : {
            type: String, 
            unique: true
        }, 
        games : [
            {
                type: Schema.Types.ObjectId
                , ref: "Game"
            }
        ],
        members : [
            {
                type: Schema.Types.ObjectId
                ,ref: "Member"
            }
        ],
        record : {
            type: Schema.Types.ObjectId
            ,ref: "Record"
        },
        owner: [
            {
                type: Schema.Types.ObjectId
                ,ref: "User"
            }
        ],
        picture: String,
    },
    {
        timestamps: true, //`createdAt` and `updatedAt`
    } 
)

const Club = model("Club",clubSchema);

module.exports = Club;