const Sequence = require('../models/sequence');

let maxDocumentId;
let maxMessageId;
let maxContactId;
let sequenceId = null;

function SequenceGenerator() {}
//Using try/catch
//Prev. we had async db code (not good at all)
// Constructor can't be async — use init() before using nextId()
SequenceGenerator.prototype.init = async function () {
  try {
    const sequence = await Sequence.findOne().exec();
    if (!sequence) {
      throw new Error("Sequence document not found");
    }
    sequenceId = sequence._id;
    maxDocumentId = sequence.maxDocumentId;
    maxMessageId = sequence.maxMessageId;
    maxContactId = sequence.maxContactId;
  } catch (err) {
    console.error("SequenceGenerator init failed:", err);
    throw err;
  }
};
// Remains the same
SequenceGenerator.prototype.nextId = async function (collectionType) {
  if (!sequenceId) {
    throw new Error("SequenceGenerator not initialized.");
  }

  let updateObject = {};
  let nextId;

  switch (collectionType) {
    case 'documents':
      maxDocumentId++;
      updateObject = { maxDocumentId };
      nextId = maxDocumentId;
      break;
    case 'messages':
      maxMessageId++;
      updateObject = { maxMessageId };
      nextId = maxMessageId;
      break;
    case 'contacts':
      maxContactId++;
      updateObject = { maxContactId };
      nextId = maxContactId;
      break;
    default:
      return -1;
  }

  try { //using await instead of callback to update the sequence
    await Sequence.updateOne({ _id: sequenceId }, { $set: updateObject });
  } catch (err) {
    console.log("nextId error =", err);
    return null;
  }

  return nextId;
};

module.exports = new SequenceGenerator();
