
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Query = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    query: { type: String, required: true },
    Answer: { type: String, required: true },
    Documents: {
        type: [String],
        default:[] 
    },
    feedback:{
        referencedDocument:{
            type: String
        },
        feedback1:{
            type: String
        },
        relaventAnswer:{
            type: String
        },
       feedback2:{
            type: String
        }
    },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Query', Query);
