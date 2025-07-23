const mongoose = require('mongoose');

const sequenceSchema  = new mongoose.Schema({
    maxDocumentId: {type: String, required: true},
    maxMessageId: {type: String, require: true},
    maxContactId: {type: String, require: true}
});

module.exports = mongoose.model('Sequence', sequenceSchema);