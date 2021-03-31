const createErrors = require('http-errors');
const getTotalDocuments = require('../utils/customQueries');
const Pixiv = require('../models/pixivModel');
const { pixivSchema, pixivContent } = require('../utils/validation_schemas');

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
      const results = {};

      results.total = pixivCount;
      results.isLast = false;

      if (startIndex > 0) {
        results.prev = {
          page: page - 1,
          size: limit,
          link: `api/pixiv/?page=${page - 1}&limit=${limit}`,
        };
      }

      if (endIndex <= pixivCount) {
        results.next = {
          page: page + 1,
          size: limit,
          link: `api/pixiv/?page=${page + 1}&limit=${limit}`,
        };
      } else {
        results.next = null;
      }

      if (results.next === null) results.isLast = true;

      results.data = pixiv;
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

      if (pixiv) return res.status(200).json(pixiv);
      return res.status(200).json({});
    } catch (error) {
      next(error);
    }
  }

  async getByContent(req, res, next) {
    try {
      const result = await pixivContent.validateAsync(req.body);
      const pixiv = await Pixiv.find({ Content: { $regex: `.*${result}.*`, $options: 'i' } });
      if (pixiv) return res.status(200).json(pixiv);
      return res.status(200).json({});
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
