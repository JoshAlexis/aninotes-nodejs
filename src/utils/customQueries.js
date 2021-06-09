/* eslint-disable no-unused-vars */
const { Model } = require('mongoose');

/**
 * Fetch the amount of documents inside the specified collection.
 * @param {Model} model The mongoose model of the collection.
 * @returns {Promise.<number>} The total count of documents in the database.
 */
function getTotalDocuments(model) {
  return new Promise((resolve, reject) => {
    model.estimatedDocumentCount((err, count) => {
      if (err) reject(err);
      else resolve(count);
    });
  });
}
/**
 * Obtains the amount of documents from the specified query.
 * @param {Model} model The mongoose model of the collection.
 * @param {Object} query An object with the params for a Mongo query.
 * @returns {Promise.<number>} The count of documents from the query.
 */
function getCountDocuments(model, query) {
  return new Promise((resolve, reject) => {
    model.countDocuments(query, (err, count) => {
      if (err) reject(err);
      else resolve(count);
    });
  });
}

module.exports = {
  getTotalDocuments,
  getCountDocuments,
};
