const mongoose = require('mongoose');

const GridSchema = mongoose.Schema({
    id: Number,
    data: String
});

module.exports = mongoose.model('grid', GridSchema);