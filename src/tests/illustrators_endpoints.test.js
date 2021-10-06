const supertest = require('supertest');
const mongoose = require('mongoose');
const illustratorsModel = require('../models/illustratorsModel');
const { illustratorsItems, newIllustrator } = require('../utils/testingData');
const app = require('../app');

const api = supertest(app);

beforeEach(async () => {
  await illustratorsModel.deleteMany({});
  await illustratorsModel.insertMany(illustratorsItems);
  jest.setTimeout(10000);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Illustrators endpoints with 200 status code', async () => {
  it('Get illustrators, should return an object where field \'results\' is not empty', async () => {
    const result = await api.get('/api/illustrators/').query({
      page: 1,
      limit: 10,
    });
    expect(result.status).toBe(200);
    expect(result.headers['content-type']).toMatch(/application\/json/);
    expect(result.body.results).toHaveLength(illustratorsItems.length);
  });

  it('Get illustrators by Name, should return an object where field \'results\' is not empty', async () => {
    const name = 'DM-iTH';
    const result = await api.get('/api/illustrators/name/')
      .query({
        page: 1,
        limit: 10,
      })
      .send({ Name: name });

    expect(result.status).toBe(200);
    expect(result.headers['content-type']).toMatch(/application\/json/);
    expect(result.body.results[0]).toHaveProperty('_id');
    expect(result.body.results[0]).toHaveProperty('Name');
    expect(result.body.results[0]).toHaveProperty('Source');
    expect(result.body.results[0]).toHaveProperty('Comments');
  });

  it('Add illustrator, should return an object', async () => {
    await api
      .post('/api/illustrators/add')
      .send(newIllustrator)
      .expect(201)
      .expect('Content-Type', /application\/json/)
      .expect({ message: 'Illustrator added' });
  });

  it('Update illustrator, should return an object', async () => {
    const updateIllustrator = {
      Name: 'DM-iTH',
      Source: 'Artstation',
      Content: 'OC',
      Comments: 'R18',
    };
    const result = await api.get('/api/illustrators/name/')
      .query({
        page: 1,
        limit: 10,
      })
      .send({ Name: updateIllustrator.Name });
    const { _id } = result.body.results[0];
    await api
      .put(`/api/illustrators/update/${_id}`)
      .send(updateIllustrator)
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .expect({ message: 'Illustrator updated' });
  });
});
