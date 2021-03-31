const { Schema, model } = require('mongoose');

const pixivSchema = new Schema({
  idPixiv: { type: String, required: true, unique: true },
  pixivName: String,
  Content: { type: String, required: true },
  Quality: { type: String, required: true },
  Favorite: { type: String, required: true },
  Link: { type: String, required: true },
});

module.exports = model('Pixiv', pixivSchema, 'pixiv');
