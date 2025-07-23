const mongoose = require('mongoose');

//children has its own schema id, name, url
const childSchema = new mongoose.Schema({
    id: {type: String, required: true},
    name: {type: String, required: true},
    url: {type: String, required: true},
})

const documentSchema = new mongoose.Schema({
    id: {type: String, required: true, unique: true },
    name: {type: String, required: true},
    url: {type: String, required: true},
    description: {type: String},
    children: [childSchema] //array of child obj
});

module.exports = mongoose.model('Document', documentSchema);

