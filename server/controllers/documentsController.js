const Document = require('../models/document');
const sequenceGenerator = require('../routes/sequenceGenerator');

//Get all documents
const getDocumentsList = async (req, res) => {
    try {
        const documentList = await Document.find().sort({ name: 1 });
        res.json(documentList)
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create Document 
const createDocument = async (req, res) => {
    try {
        let maxDocumentId = await sequenceGenerator.nextId("documents");
        const { 
            name, 
            url, 
            description, 
            price, 
            brand, 
            frameType, 
            lensColor, 
            uvProtection 
        } = req.body;
        
        maxDocumentId = maxDocumentId.toString();
        
        if(!name || !url) {
            return res.status(400).json({ error: "Product name and URL are required" });
        }

        const newDocument = await Document.create({ 
            id: maxDocumentId, 
            name, 
            url, 
            description,
            price: price ? parseFloat(price) : undefined,
            brand,
            frameType,
            lensColor,
            uvProtection,
            children: [] // Initialize empty children array
        });

        res.status(201).json({ 
            message: 'Eyeglass product added successfully',
            document: newDocument
        });

    } catch(err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ 
                error: 'Validation failed', 
                details: err.message 
            });
        }
        res.status(500).json({message: err.message})
    }
};

//Update document by id
const updateDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };

        if(!id) {
            return res.status(400).json({ error: 'Missing document ID'});
        }

        // Convert price to number if provided
        if (updateData.price) {
            updateData.price = parseFloat(updateData.price);
        }

        const updatedDocument = await Document.findOneAndUpdate(
            {id: id}, 
            updateData, 
            {new: true, runValidators: true}
        );

        if(!updatedDocument) {
            return res.status(404).json({ error: 'Document not found'})
        }

        res.status(200).json({
            message: 'Document updated successfully',
            document: updatedDocument
        });

    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ 
                error: 'Validation failed', 
                details: err.message 
            });
        }
        res.status(500).json({message: err.message})
    }
};

// Delete by id
const deleteDocument = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'Missing document id'});
        }

        const deletedDocument = await Document.findOneAndDelete({ id: id });

        if(!deletedDocument) {
            return res.status(404).json({ error: 'Document not found'});
        }

        res.status(200).json({ 
            message: 'Document deleted successfully',
            deletedDocument: deletedDocument
        });

    } catch (err) {
        res.status(500).json({ error: err.message});
    }
};

// Get single document by id
const getDocument = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'Missing document id'});
        }

        const document = await Document.findOne({ id: id });

        if(!document) {
            return res.status(404).json({ error: 'Document not found'});
        }

        res.status(200).json(document);

    } catch (err) {
        res.status(500).json({ error: err.message});
    }
};

module.exports = {
    getDocumentsList,
    createDocument,
    updateDocument,
    deleteDocument,
    getDocument
};