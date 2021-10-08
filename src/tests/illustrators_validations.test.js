const supertest = require('supertest');
const mongoose = require('mongoose');
const { illustratorsTestingData } = require('./testingData');
const { illustrators } = require('../utils/endpoints');
const app = require('../app');

const api = supertest(app);

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Illustrator Schema validations', () => {
  describe('All fields are required in body, should response a JSON with message \'is required\' ', () => {
    it('POST request', async () => {
      const response = await api.post(illustrators.ADD_NEW_ILLUSTRATOR)
        .send(illustratorsTestingData.illustratorWithoutOneField);
      expect(response.status).toBe(422);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/is required/);
    });

    it('PUT request', async () => {
      const result = await api.get(illustrators.GET_ILLUSTRATOR_BY_NAME)
        .query({
          page: 1,
          limit: 10,
        })
        .send({ Name: illustratorsTestingData.illustratorName });
      const { _id } = result.body.results[0];
      const response = await api.put(`${illustrators.UPDATE_ILLUSTRATOR}${_id}`)
        .send(illustratorsTestingData.illustratorWithoutOneField);
      expect(response.status).toBe(422);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/is required/);
    });
  });

  describe('All fields not to be empty, should response a JSON with message \'is not allowed to be empty\'', () => {
    it('POST request', async () => {
      const response = await api.post(illustrators.ADD_NEW_ILLUSTRATOR)
        .send(illustratorsTestingData.illustratorWithEmptyField);
      expect(response.status).toBe(422);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/is not allowed to be empty/);
    });

    it('PUT request', async () => {
      const result = await api.get(illustrators.GET_ILLUSTRATOR_BY_NAME)
        .query({
          page: 1,
          limit: 10,
        })
        .send({ Name: illustratorsTestingData.illustratorName });
      const { _id } = result.body.results[0];
      const response = await api.put(`${illustrators.UPDATE_ILLUSTRATOR}${_id}`)
        .send(illustratorsTestingData.illustratorWithEmptyField);
      expect(response.status).toBe(422);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/is not allowed to be empty/);
    });
  });

  describe('GET /api/illustrator/name/ endpoint', () => {
    it('Body must include field \'Name\', should response JSON with message \'is required\'', async () => {
      const response = await api.get(illustrators.GET_ILLUSTRATOR_BY_NAME)
        .query({
          page: 1,
          limit: 10,
        })
        .send(illustratorsTestingData.NameBodyEmpty);
      expect(response.status).toBe(422);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/is required/);
    });

    it('Body must include field \'Name\', should response JSON with message \'is not allowed to be empty\'', async () => {
      const response = await api.get(illustrators.GET_ILLUSTRATOR_BY_NAME)
        .query({
          page: 1,
          limit: 10,
        })
        .send(illustratorsTestingData.NameBodyEmptyField);
      expect(response.status).toBe(422);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/is not allowed to be empty/);
    });
  });
});

describe('Paginated query', () => {
  describe('Get illustrators', () => {
    it('Query without page param, should response \'Must include query params\'', async () => {
      const response = await api.get(illustrators.GET_ILLUSTRATORS)
        .query({
          limit: 10,
        });
      expect(response.status).toBe(400);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/Must include query params/);
    });

    it('Query without page limit, should response \'Must include query params\'', async () => {
      const response = await api.get(illustrators.GET_ILLUSTRATORS)
        .query({
          page: 1,
        });
      expect(response.status).toBe(400);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/Must include query params/);
    });

    it('Query without query params, should response \'Must include query params\'', async () => {
      const response = await api.get(illustrators.GET_ILLUSTRATORS)
        .query({});
      expect(response.status).toBe(400);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/Must include query params/);
    });

    it('Query without value for page, should response \'Must include query params\'', async () => {
      const response = await api.get(illustrators.GET_ILLUSTRATORS)
        .query({
          page: '',
        });
      expect(response.status).toBe(400);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/Must include query params/);
    });

    it('Query without value for limit, should response \'Must include query params\'', async () => {
      const response = await api.get(illustrators.GET_ILLUSTRATORS)
        .query({
          limit: '',
        });
      expect(response.status).toBe(400);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/Must include query params/);
    });

    it('Query without value for limit and page, should response \'Must include query params\'', async () => {
      const response = await api.get(illustrators.GET_ILLUSTRATORS)
        .query({
          page: '',
          limit: '',
        });
      expect(response.status).toBe(400);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/Must include query params/);
    });
  });

  describe('Get illustrators by field Name', () => {
    it('Query without page param, should response \'Must include query params\'', async () => {
      const response = await api.get(illustrators.GET_ILLUSTRATOR_BY_NAME)
        .query({
          limit: 10,
        })
        .send(illustratorsTestingData.illustratorName);
      expect(response.status).toBe(400);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/Must include query params/);
    });

    it('Query without page limit, should response \'Must include query params\'', async () => {
      const response = await api.get(illustrators.GET_ILLUSTRATOR_BY_NAME)
        .query({
          page: 1,
        })
        .send(illustratorsTestingData.illustratorName);
      expect(response.status).toBe(400);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/Must include query params/);
    });

    it('Query without value for page, should response \'Must include query params\'', async () => {
      const response = await api.get(illustrators.GET_ILLUSTRATOR_BY_NAME)
        .query({
          page: '',
        })
        .send(illustratorsTestingData.illustratorName);
      expect(response.status).toBe(400);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/Must include query params/);
    });

    it('Query without value for limit, should response \'Must include query params\'', async () => {
      const response = await api.get(illustrators.GET_ILLUSTRATOR_BY_NAME)
        .query({
          limit: '',
        })
        .send(illustratorsTestingData.illustratorName);
      expect(response.status).toBe(400);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/Must include query params/);
    });

    it('Query without value for limit and page, should response \'Must include query params\'', async () => {
      const response = await api.get(illustrators.GET_ILLUSTRATOR_BY_NAME)
        .query({
          page: '',
          limit: '',
        })
        .send(illustratorsTestingData.illustratorName);
      expect(response.status).toBe(400);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/Must include query params/);
    });
  });

  describe('Get illustrators by field Source', () => {
    it('Query without page param, should response \'Must include query params\'', async () => {
      const response = await api
        .get(`${illustrators.GET_ILLUSTRATORS_BY_SOURCE}${illustratorsTestingData.illustratorsSource}`)
        .query({
          limit: 10,
        });
      expect(response.status).toBe(400);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/Must include query params/);
    });

    it('Query without page limit, should response \'Must include query params\'', async () => {
      const response = await api
        .get(`${illustrators.GET_ILLUSTRATORS_BY_SOURCE}${illustratorsTestingData.illustratorsSource}`)
        .query({
          page: 1,
        });
      expect(response.status).toBe(400);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/Must include query params/);
    });

    it('Query without value for page, should response \'Must include query params\'', async () => {
      const response = await api
        .get(`${illustrators.GET_ILLUSTRATORS_BY_SOURCE}${illustratorsTestingData.illustratorsSource}`)
        .query({
          page: '',
        });
      expect(response.status).toBe(400);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/Must include query params/);
    });

    it('Query without value for limit, should response \'Must include query params\'', async () => {
      const response = await api
        .get(`${illustrators.GET_ILLUSTRATORS_BY_SOURCE}${illustratorsTestingData.illustratorsSource}`)
        .query({
          limit: '',
        });
      expect(response.status).toBe(400);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/Must include query params/);
    });

    it('Query without value for limit and page, should response \'Must include query params\'', async () => {
      const response = await api
        .get(`${illustrators.GET_ILLUSTRATORS_BY_SOURCE}${illustratorsTestingData.illustratorsSource}`)
        .query({
          page: '',
          limit: '',
        });
      expect(response.status).toBe(400);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/Must include query params/);
    });
  });
});
