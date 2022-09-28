const mongoose = require('mongoose');

const addTemperature = mongoose.Schema({
    name: { type: String, required: true},
    temp: { type: Number, required: true},
    led: { type: Boolean, required: true},
    time : { type : Date, default: Date.now }
});

module.exports = mongoose.model('values', addTemperature);