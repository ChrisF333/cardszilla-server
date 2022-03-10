
//Record.model.js

const {Schema, model} = require('mongoose');

const recordSchema = new Schema (
    {record: 
        [
            { 
                eventDate: {
                    type: Date
                },
                game: { 
                    type: Schema.Types.ObjectId
                    ,ref: "Game"
                },
                winner: {
                    type: Schema.Types.ObjectId
                    ,ref: "Member"
                },
                participants: [
                    {
                        type: Schema.Types.ObjectId
                        ,ref: "PMember"
                    }
                ]
            },
            {
                // this second object adds extra properties: `createdAt` and `updatedAt`
                timestamps: true,
            }
        ],         
    }    
)

const Record = model("Record", recordSchema);

module.exports = Record;