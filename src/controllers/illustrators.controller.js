const createErrors = require('http-errors');
const mongoose = require('mongoose');
const { getTotalDocuments, getCountDocuments } = require('../utils/customQueries');
const { illustratorName } = require('../utils/validation_schemas');
const Illustrators = require('../models/illustratorsModel');
const paginated = require('../utils/paginated');

class IllustratorsController {
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

      const results = paginated(page, limit, startIndex, endIndex, illustrators, illustratorsCount, 'illustratos');
      return res.status(200).json(results);
    } catch (error) {
      next(error);
    }
  }

  async getByName(req, res, next) {
    try {
      const { Name } = illustratorName.validateAsync(req.body);
      const illustrator = await Illustrators.findOne({ Name });
      if (!illustrator) return res.status(200).json({});
      return res.status(200).json(illustrator);
    } catch (err) {
      next(err);
    }
  }

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

      const skip = (page - 1) * limit;
      const startIndex = skip;
      const endIndex = page * limit;

      const illustratorsItems = await Illustrators.find().limit(limit).skip(skip);
      const illustratorsCount = await getCountDocuments(Illustrators);

      const results = paginated(page, limit, startIndex, endIndex, illustratorsItems, illustratorsCount, 'illustratos');
      return res.status(200).json(results);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new IllustratorsController();
