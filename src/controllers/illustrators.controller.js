const createErrors = require('http-errors');
const mongoose = require('mongoose');
const { getTotalDocuments, getCountDocuments } = require('../utils/customQueries');
const { illustratorName, illustratorSchema } = require('../utils/validationSchemas');
const Illustrators = require('../models/illustratorsModel');
const paginated = require('../utils/paginated');
const logger = require('../utils/logger');

const IllustratorsController = {
  async getAll(req, res, next) {
    try {
      let { page, limit } = req.query;

      if (!page || !limit) throw createErrors.BadRequest('Must include query params');
      page = parseInt(page, 10);
      limit = parseInt(limit, 10);

      const skip = (page - 1) * limit;
      const startIndex = skip;
      const endIndex = page * limit;

      const illustrators = await Illustrators.find().limit(limit).skip(skip);
      const illustratorsCount = await getTotalDocuments(Illustrators);

      const results = paginated(page, limit, startIndex, endIndex, illustratorsCount, illustrators);
      return res.status(200).json(results);
    } catch (err) {
      if (process.env.NODE_ENV !== 'test') logger.error(err);
      next(err);
    }
  },

  async getByName(req, res, next) {
    try {
      const { Name: name } = await illustratorName.validateAsync(req.body);
      const query = { Name: { $regex: name } };
      const illustrator = await Illustrators.find(query);
      if (!illustrator) return res.status(200).json([]);
      return res.status(200).json(illustrator);
    } catch (err) {
      if (process.env.NODE_ENV !== 'test') logger.error(err);
      next(err);
    }
  },

  async getBySource(req, res, next) {
    const { source } = req.params;
    try {
      let { page, limit } = req.query;

      if (source === '') throw createErrors.BadRequest(`Bad Request. ${source} is not a valid param.`);

      if (Object.keys(req.query).length === 0) {
        const illustratorsItems = await Illustrators.find({ Source: source });

        if (!illustratorsItems) return res.status(200).json([]);
        return res.status(200).json(illustratorsItems);
      }

      if (!page || !limit) throw createErrors.BadRequest('Must include query params');
      page = parseInt(page, 10);
      limit = parseInt(limit, 10);

      const skipIndex = (page - 1) * limit;
      const endIndex = page * limit;

      const illustratorsItems = await Illustrators.find().limit(limit).skip(skipIndex);

      const results = paginated(page, limit, skipIndex, endIndex, illustratorsItems);
      return res.status(200).json(results);
    } catch (err) {
      if (process.env.NODE_ENV !== 'test') logger.error(err);
      next(err);
    }
  },

  async addIllustrator(req, res, next) {
    try {
      const body = await illustratorSchema.validateAsync(req.body);
      const newIllustrator = Illustrators(body);
      await newIllustrator.save();
      return res.status(201).json({ message: 'Illustrator added' });
    } catch (err) {
      if (err.isJoi === true) err.status = 422;
      if (process.env.NODE_ENV !== 'test') logger.error(err);
      next(err);
    }
  },

  async updateIllustrator(req, res, next) {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) throw createErrors.BadRequest(`Bad request. ${id} is not a valid param`);
      const body = await illustratorSchema.validateAsync(req.body);
      await Illustrators.findByIdAndUpdate(id, body, { new: true });
      return res.status(200).json({ message: 'Illustrator updated' });
    } catch (err) {
      if (err.isJoi === true) err.status = 422;
      if (process.env.NODE_ENV !== 'test') logger.error(err);
      next(err);
    }
  },
};

module.exports = IllustratorsController;
