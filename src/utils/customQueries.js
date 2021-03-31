function getTotalDocuments(model) {
  return new Promise((resolve, reject) => {
    model.estimatedDocumentCount({}, (err, count) => {
      if (err) reject(err);
      else resolve(count);
    });
  });
}

module.exports = getTotalDocuments;
