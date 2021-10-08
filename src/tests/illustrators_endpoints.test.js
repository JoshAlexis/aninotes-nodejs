const supertest = require('supertest');
const mongoose = require('mongoose');
const illustratorsModel = require('../models/illustratorsModel');
const { illustratorsTestingData } = require('./testingData');
const { illustrators } = require('../utils/endpoints');
const app = require('../app');

const api = supertest(app);

beforeEach(async () => {
  await illustratorsModel.deleteMany({});
  await illustratorsModel.insertMany(illustratorsTestingData.illustratorsItems);
  jest.setTimeout(10000);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Illustrators endpoints with 200 status code', async () => {
  it('Get illustrators, should return an object where field \'results\' is not empty', async () => {
    const result = await api.get(illustrators.GET_ILLUSTRATORS).query({
      page: 1,
      limit: 10,
    });
    expect(result.status).toBe(200);
    expect(result.headers['content-type']).toMatch(/application\/json/);
    expect(result.body.results).toHaveLength(illustratorsTestingData.illustratorsItems.length);
  });

  it('Get illustrators by Name, should return an object where field \'results\' is not empty', async () => {
    const result = await api.get(illustrators.GET_ILLUSTRATOR_BY_NAME)
      .query({
        page: 1,
        limit: 10,
      })
      .send({ Name: illustratorsTestingData.illustratorName });

    expect(result.status).toBe(200);
    expect(result.headers['content-type']).toMatch(/application\/json/);
    expect(result.body.results[0]).toHaveProperty('_id');
    expect(result.body.results[0]).toHaveProperty('Name');
    expect(result.body.results[0]).toHaveProperty('Source');
    expect(result.body.results[0]).toHaveProperty('Comments');
  });

  it('Add illustrator, should return an object', async () => {
    await api
      .post(illustrators.ADD_NEW_ILLUSTRATOR)
      .send(illustratorsTestingData.newIllustrator)
      .expect(201)
      .expect('Content-Type', /application\/json/)
      .expect({ status: 201, message: 'Illustrator added' });
  });

  it('Update illustrator, should return an object', async () => {
    const result = await api.get(illustrators.GET_ILLUSTRATOR_BY_NAME)
      .query({
        page: 1,
        limit: 10,
      })
      .send({ Name: illustratorsTestingData.updateIllustrator.Name });
    const { _id } = result.body.results[0];
    await api
      .put(`${illustrators.UPDATE_ILLUSTRATOR}${_id}`)
      .send(illustratorsTestingData.updateIllustrator)
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .expect({ status: 200, message: 'Illustrator updated' });
  });
});
