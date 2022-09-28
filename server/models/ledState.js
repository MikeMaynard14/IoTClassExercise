const mongoose = require('mongoose');

const ledState = mongoose.Schema({
    name: { type: String, required: true},
    led: { type: Boolean, required: true},
});

module.exports = mongoose.model('led', ledState);