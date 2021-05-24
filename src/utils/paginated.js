/* eslint-disable no-unused-vars */
const { Document } = require('mongoose');

/**
 * Creates an object with the data for pagination.
 * @param {number} page - The number of the page.
 * @param {number} limit - The amount of documents for the page.
 * @param {number} startIndex - The index of the first element of the page.
 * Also represents the amount to skipped elements.
 * @param {number} endIndex - The index of the last element of the page.
 * @param {Document[]} items - An array of Mongo documents
 * @param {number} total - The amount of documents in the collection.
 * @param {string} url - The base URL to create the URL's for the previous and next page.
 * @returns An object with the structure of a paginated response.
 */
function paginated(
  page,
  limit,
  startIndex,
  endIndex,
  items,
  total,
  url,
) {
  const results = {};

  results.total = total;
  results.isLast = false;

  if (startIndex > 0) {
    results.prev = {
      page: page - 1,
      size: limit,
      link: `api/${url}/?page=${page - 1}&limit=${limit}`,
    };
  } else {
    results.prev = null;
  }

  if (endIndex <= total) {
    results.next = {
      page: page + 1,
      size: limit,
      link: `api/${url}/?page=${page + 1}&limit=${limit}`,
    };
  } else {
    results.next = null;
  }

  if (results.next === null) results.isLast = true;

  results.data = items;

  return results;
}

module.exports = paginated;
