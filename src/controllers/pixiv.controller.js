const createErrors = require('http-errors');
const mongoose = require('mongoose');
const { getTotalDocuments, getCountDocuments } = require('../utils/customQueries');
const Pixiv = require('../models/pixivModel');
const { pixivSchema, pixivContent } = require('../utils/validationSchemas');
const paginate = require('../utils/paginate');
const logger = require('../utils/logger');

const PixivController = {
  async getAll(req, res, next) {
    try {
      let { page, limit } = req.query;

      if (!page || !limit) throw createErrors.BadRequest('Must include query params');
      page = parseInt(page, 10);
      limit = parseInt(limit, 10);

      const skipIndex = (page - 1) * limit;
      const endIndex = page * limit;

      const pixiv = await Pixiv.find().limit(limit).skip(skipIndex);
      const pixivCount = await getTotalDocuments(Pixiv);

      const results = paginate(page, limit, skipIndex, endIndex, pixivCount, pixiv);
      return res.status(200).json(results);
    } catch (error) {
      if (process.env.NODE_ENV !== 'test') logger.error(error);
      next(error);
    }
  },

  async getByIdPixiv(req, res, next) {
    const { idPixiv } = req.params;
    try {
      if (!Number(idPixiv)) throw createErrors.BadRequest(`Bad Request. '${idPixiv}' is not a valid param`);
      const pixiv = await Pixiv.find({ idPixiv });
      return res.status(200).json({ status: 200, data: pixiv });
    } catch (error) {
      if (process.env.NODE_ENV !== 'test') logger.error(error);
      next(error);
    }
  },

  async getByContent(req, res, next) {
    try {
      let { page, limit } = req.query;

      if (!page || !limit) throw createErrors.BadRequest('Must include query params');
      page = parseInt(page, 10);
      limit = parseInt(limit, 10);

      const { Content: content } = await pixivContent.validateAsync(req.body);

      const skip = (page - 1) * limit;
      const startIndex = skip;
      const endIndex = page * limit;

      const query = { Content: { $regex: content, $options: 'i' } };
      const pixiv = await Pixiv.find(query).limit(limit).skip(skip);
      const pixivCount = await getCountDocuments(Pixiv, query);

      const results = paginate(page, limit, startIndex, endIndex, pixivCount, pixiv);
      return res.status(200).json(results);
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      if (process.env.NODE_ENV !== 'test') logger.error(error);
      next(error);
    }
  },

  async addPixiv(req, res, next) {
    try {
      const result = await pixivSchema.validateAsync(req.body);
      const newPixiv = Pixiv(result);
      await newPixiv.save();
      return res.status(201).json({ status: 201, message: 'Pixiv added' });
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      if (process.env.NODE_ENV !== 'test') logger.error(error);
      next(error);
    }
  },

  async updatePixiv(req, res, next) {
    const { id } = req.params;
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) throw createErrors.BadRequest(`Bad request. ${id} is not a valid param`);
      const result = await pixivSchema.validateAsync(req.body);
      await Pixiv.findByIdAndUpdate(id, result, { new: true });
      return res.status(200).json({ status: 200, message: 'Pixiv updated' });
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      if (process.env.NODE_ENV !== 'test') logger.error(error);
      next(error);
    }
  },
};

module.exports = PixivController;
