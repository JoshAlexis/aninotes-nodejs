const createErrors = require('http-errors');
// const mongoose = require('mongoose');
const { getTotalDocuments } = require('../utils/customQueries');
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

      // const paginatedOpt = {
      //   page,
      //   limit,
      //   startIndex,
      //   endIndex,
      //   items: illustrators,
      //   total: illustratorsCount,
      //   url: 'illustrators',
      // };

      const results = paginated(page, limit, startIndex, endIndex, illustrators, illustratorsCount, 'illustratos');
      return res.status(200).json(results);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new IllustratorsController();
