const createErrors = require('http-errors');
const mongoose = require('mongoose');
const { getTotalDocuments, getCountDocuments } = require('../utils/customQueries');
const { illustratorName, illustratorSchema } = require('../utils/validationSchemas');
const Illustrators = require('../models/illustratorsModel');
const paginate = require('../utils/paginate');
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

      const results = paginate(page, limit, startIndex, endIndex, illustratorsCount, illustrators);
      return res.status(200).json(results);
    } catch (error) {
      if (process.env.NODE_ENV !== 'test') logger.error(error);
      next(error);
    }
  },

  async getByName(req, res, next) {
    try {
      let { page, limit } = req.query;

      if (!page || !limit) throw createErrors.BadRequest('Must include query params');
      page = parseInt(page, 10);
      limit = parseInt(limit, 10);

      const { Name: name } = await illustratorName.validateAsync(req.body);
      const query = { Name: { $regex: name } };

      const skipIndex = (page - 1) * limit;
      const endIndex = page * limit;

      const illustrators = await Illustrators.find(query).limit(limit).skip(skipIndex);
      const illustratorCount = await getCountDocuments(Illustrators, query);
      const results = paginate(page, limit, skipIndex, endIndex,
        illustratorCount, illustrators);

      return res.status(200).json(results);
    } catch (err) {
      if (err.isJoi === true) err.status = 422;
      if (process.env.NODE_ENV !== 'test') logger.error(err);
      next(err);
    }
  },

  async getBySource(req, res, next) {
    try {
      const { source } = req.params;
      let { page, limit } = req.query;

      if (source === '') throw createErrors.BadRequest(`Bad Request. ${source} is not a valid param.`);

      if (!page || !limit) throw createErrors.BadRequest('Must include query params');
      page = parseInt(page, 10);
      limit = parseInt(limit, 10);

      const query = { Source: source };
      const skipIndex = (page - 1) * limit;
      const endIndex = page * limit;

      const illustratorsItems = await Illustrators.find(query).limit(limit).skip(skipIndex);
      const illustratorsCount = await getCountDocuments(Illustrators, query);

      const results = paginate(page, limit, skipIndex, endIndex, illustratorsCount,
        illustratorsItems);
      return res.status(200).json(results);
    } catch (error) {
      if (process.env.NODE_ENV !== 'test') logger.error(error);
      next(error);
    }
  },

  async addIllustrator(req, res, next) {
    try {
      const body = await illustratorSchema.validateAsync(req.body);
      const newIllustrator = Illustrators(body);
      await newIllustrator.save();
      return res.status(201).json({ status: 201, message: 'Illustrator added' });
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
      return res.status(200).json({ status: 200, message: 'Illustrator updated' });
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      if (process.env.NODE_ENV !== 'test') logger.error(error);
      next(error);
    }
  },
};

module.exports = IllustratorsController;
