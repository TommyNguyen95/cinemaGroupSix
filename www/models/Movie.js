const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create a schema for seat

let movieSchema = new Schema({
    "title": String,
    "genre": String,
    "language": String,
    "subtitles": String
    
});




module.exports = db.model('Seat', movieSchema);