const { Schema, model } = require('mongoose');

const pixivSchema = new Schema({
  idPixiv: { type: String, required: true, unique: true },
  pixivName: { type: String, default: 'InJapanese' },
  Content: { type: String, required: true },
  Quality: { type: String, required: true },
  Favorite: { type: String, required: true },
  Link: { type: String, required: true },
});

pixivSchema.set('toJSON', {
  transform: (doc, ret, options) => {
    delete ret.__v;
    return ret;
  },
});

const pixivModel = model('Pixiv', pixivSchema, 'pixiv');

module.exports = pixivModel;
