
//Member.model.js

const { Schema, model} = require('mongoose');

const memberSchema = new Schema (
    {
        name: {
            type: String,
            required: true
        },
        nickname: String,
        wins: Number,
        losses: Number,
    },
    {
        timestamps: true, //`createdAt` and `updatedAt`
    } 
)

const Member = model("Member", memberSchema);

module.exports = Member;