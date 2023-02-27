const mongoose = require('mongoose');

const data = mongoose.Schema({
    GuildId : String,
});

let BlackList = mongoose.model('blacklist', data);

module.exports = { BlackList }
