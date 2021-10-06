const { Schema, model } = require('mongoose');

const illustratorsSchema = new Schema({
  Name: { type: String, required: true },
  Source: { type: String, required: true },
  Content: { type: String },
  Comments: { type: String, default: 'No Comments' },
});
/* eslint-disable no-unused-vars */
illustratorsSchema.set('toJSON', {
  transform: (doc, ret, options) => {
    delete ret.__v;
    return ret;
  },
});

const illustratorsModel = model('Illustrators', illustratorsSchema, 'illustrators');

module.exports = illustratorsModel;
