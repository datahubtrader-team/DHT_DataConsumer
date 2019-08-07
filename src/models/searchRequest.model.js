const mongoose = require('mongoose');

const searchRequestSchema = mongoose.Schema({
    search: String,
    participant_min: String,
    participant_max: String,
    activity: String,
    deadline: String,
    value: String,
    buyerId: String
}, {
    timestamps: true
});

module.exports = mongoose.model('searchRequest', searchRequestSchema);