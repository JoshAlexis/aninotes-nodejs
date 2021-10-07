/* eslint-disable no-unused-vars */
const { Document } = require('mongoose');

/**
 * Creates an object with the data for pagination.
 * @param {number} page - The number of the page.
 * @param {number} limit - The amount of documents for the page.
 * @param {number} startIndex - The index of the first element of the page.
 * Also represents the amount to skipped elements.
 * @param {number} endIndex - The index of the last element of the page.
 * @param {number} total - total amount of documents in the collection
 * @param {Document[]} items - An array of Mongo documents
 * @returns An object with the structure of a paginated response.
 */
function paginated(
  page,
  limit,
  startIndex,
  endIndex,
  total,
  items,
) {
  const result = {};

  if (startIndex > 0) {
    result.prev = {
      page: page - 1,
      limit,
    };
  }

  if (endIndex < total) {
    result.next = {
      page: page + 1,
      limit,
    };
  }

  result.results = items;

  return result;
}

module.exports = paginated;
