const createErrors = require('http-errors');
const mongoose = require('mongoose');
const { getTotalDocuments, getCountDocuments } = require('../utils/customQueries');
const Pixiv = require('../models/pixivModel');
const { pixivSchema, pixivContent } = require('../utils/validation_schemas');
const paginated = require('../utils/paginated');
const pixivModel = require('../models/pixivModel');

class PixivController {
  async getAll(req, res, next) {
    try {
      let { page, limit } = req.query;

      if (!page || !limit) throw createErrors.BadRequest('Must include query params');
      page = parseInt(page, 10);
      limit = parseInt(limit, 10);

      const skip = (page - 1) * limit;
      const startIndex = skip;
      const endIndex = page * limit;

      const pixiv = await Pixiv.find().limit(limit).skip(skip);
      const pixivCount = await getTotalDocuments(Pixiv);

      const paginatedOpt = {
        page,
        limit,
        startIndex,
        endIndex,
        items: pixiv,
        total: pixivCount,
        url: 'pixiv',
      };

      const results = paginated(paginatedOpt);
      return res.status(200).json(results);
    } catch (error) {
      next(error);
    }
  }

  async getByIdPixiv(req, res, next) {
    const { idPixiv } = req.params;
    try {
      if (!Number(idPixiv)) throw createErrors.BadRequest(`Bad Request. '${idPixiv}' is not a valid param`);
      const pixiv = await Pixiv.findOne({ idPixiv });
      if (!pixiv) return res.status(200).json({});
      return res.status(200).json(pixiv);
    } catch (error) {
      next(error);
    }
  }

  async getByContent(req, res, next) {
    try {
      const { Content: content } = await pixivContent.validateAsync(req.body);

      if (Object.keys(req.query).length === 0) {
        const pixiv = await Pixiv.find({ Content: { $regex: content, $options: 'i' } });

        if (!pixiv) return res.status(200).json([]);
        return res.status(200).json(pixiv);
      }

      let { page, limit } = req.query;

      if (!page || !limit) throw createErrors.BadRequest('Must include query params');
      page = parseInt(page, 10);
      limit = parseInt(limit, 10);

      const skip = (page - 1) * limit;
      const startIndex = skip;
      const endIndex = page * limit;

      const query = { Content: { $regex: content, $options: 'i' } };
      const pixiv = await Pixiv.find(query).limit(limit).skip(skip);
      const pixivCount = await getCountDocuments(pixivModel, query);

      const paginatedOpt = {
        page,
        limit,
        startIndex,
        endIndex,
        items: pixiv,
        total: pixivCount,
        url: 'pixiv/content',
      };

      const results = paginated(paginatedOpt);
      return res.status(200).json(results);
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  }

  async addPixiv(req, res, next) {
    try {
      const result = await pixivSchema.validateAsync(req.body);
      const newPixiv = Pixiv(result);
      await newPixiv.save();
      return res.status(201).json({ message: 'Pixiv created' });
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  }

  async updatePixiv(req, res, next) {
    const { id } = req.params;
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) throw createErrors.BadRequest(`Bad request. ${id} is not a valid param`);
      const result = await pixivSchema.validateAsync(req.body);
      await Pixiv.findByIdAndUpdate(id, result, { new: true });
      return res.status(200).json({ message: 'Pixiv updated' });
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  }
}

module.exports = new PixivController();
