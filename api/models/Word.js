const mongoose = require('mongoose');

const WordSchema = mongoose.Schema ({
    word: String,
    length: Number,
    orientation: String,
    number: Number,
    clue: String,
    startIndex: {
        x: Number,
        y: Number
    },
    gridId: Number
        
})


module.exports = mongoose.model('word', WordSchema);
