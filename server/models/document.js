const mongoose = require('mongoose');

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
    children: [childSchema],
    price: {type: Number, min: 0},
    brand: {type: String, maxlength: 50},
    frameType: {
        type: String, 
        enum: ['Metal', 'Acetate', 'TR90', 'Titanium', 'Plastic', 'O Matter', 'Mixed', '']
    },
    lensColor: {type: String, maxlength: 50},
    uvProtection: {
        type: String,
        enum: ['100% UV', '100% UV + Polarized', 'Blue Light Blocking', 'Anti-Reflective', 'UV Protection Available', '']
    }
});

module.exports = mongoose.model('Document', documentSchema);  