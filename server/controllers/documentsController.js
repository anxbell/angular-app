const Document = require('../models/document');
const sequenceGenerator = require('../routes/sequenceGenerator');

//Get all documents
const getDocumentsList = async (req, res) => {
    try {
        const documentList = await Document.find();
        res.json(documentList)
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create Document 
const createDocument = async (req, res) => {
    try {
        let maxDocumentId = await sequenceGenerator.nextId("documents");
        const { name, url, description } = req.body;
        maxDocumentId = maxDocumentId.toString();
        if(!name || !url) {
            return res.status(400).json({ error: "All fields are required" });
        }
        //check if we have children (i won't add it bc assigned)
        const newDocument = await Document.create({ 
            id: maxDocumentId, 
            name, 
            url, 
            description
        });

        res.status(201).json({ 
            message: 'Document added successfully',
            id: newDocument.id
        });

    } catch(err) {
        res.status(500).json({message: err.message})
    }
};

//Update document by id
const updateDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if(!id) {
            return res.status(400).json({ error: 'Missing document'});
        }

        const updatedDocument = await Document.findOneAndUpdate(
            {id: id}, 
            updateData, 
            {new: true});

        if(!updatedDocument) {
            return res.status(404).json({ error: 'Document not found'})
        }

        res.status(200).json(updatedDocument);

    } catch (err) {
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

        res.status(204).json({ message: 'Document deleted' });

    } catch (err) {
        res.status(500).json({ error: error.message});
    }
};
module.exports = {
    getDocumentsList,
    createDocument,
    updateDocument,
    deleteDocument
};