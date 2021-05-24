const supertest = require('supertest');
const mongoose = require('mongoose');
const { app, server } = require('../src/index');
const illustratorsModel = require('../src/models/illustratorsModel');
const { illustratorsItems } = require('../src/utils/testingData');

const api = supertest(app);

beforeEach(async () => {
  await illustratorsModel.deleteMany({});
  await illustratorsModel.insertMany(illustratorsItems);
});

afterAll(() => {
  server.close();
  mongoose.connection.close();
});

describe('Illustrators endpoints with 200 status code', () => {
  it('Get pixiv, should return an object where field \'data\' is not empty', async () => {
    const result = await api.get('/api/illustrators/').query({
      page: 1,
      limit: 10,
    });
    expect(result.status).toBe(200);
    expect(result.headers['content-type']).toMatch(/application\/json/);
    expect(result.body.data).toHaveLength(illustratorsItems.length);
  });
});
