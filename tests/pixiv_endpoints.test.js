const supertest = require('supertest');
const mongoose = require('mongoose');
const pixivModel = require('../src/models/pixivModel');
const { pixivItems, newPixiv, body } = require('../src/utils/testingData');
const { app, server } = require('../src/index');

const api = supertest(app);

beforeAll(async () => {
  await pixivModel.deleteMany({});
  await pixivModel.insertMany(pixivItems);
});

afterAll(() => {
  server.close();
  mongoose.connection.close();
});

describe('Pixiv endpoints with 200 status code', () => {
  it('Get pixiv, should return an object where field \'data\' is not empty', async () => {
    const result = await api.get('/api/pixiv/').query({
      page: 1,
      limit: 10,
    });
    expect(result.status).toBe(200);
    expect(result.headers['content-type']).toMatch(/application\/json/);
    expect(result.body.data).toHaveLength(pixivItems.length);
  });

  it('Create pixiv, should return object with message', async () => {
    await api
      .post('/api/pixiv/')
      .send(newPixiv)
      .expect(201)
      .expect('Content-Type', /application\/json/)
      .expect({ message: 'Pixiv created' });
  });

  describe('Get pixiv by field Content', () => {
    it('No paginated, should return a not empty array', async () => {
      const result = await api.get('/api/pixiv/content/').send(body);
      expect(result.status).toBe(200);
      expect(result.headers['content-type']).toMatch(/application\/json/);
      expect(result.body).not.toHaveLength(0);
    });

    it('Paginated, should have field \'data\' and return a not empty array', async () => {
      const result = await api.get('/api/pixiv/content/')
        .query({
          page: 1,
          limit: 10,
        })
        .send(body);
      expect(result.status).toBe(200);
      expect(result.headers['content-type']).toMatch(/application\/json/);
      expect(result.body).toHaveProperty('data');
      expect(result.body.data).not.toHaveLength(0);
    });
  });

  it('Get pixiv by idPixiv, should return a a object with all fields', async () => {
    const idPixiv = '14764274';
    const result = await api.get(`/api/pixiv/idpixiv/${idPixiv}`);

    expect(result.status).toBe(200);
    expect(result.headers['content-type']).toMatch(/application\/json/);
    expect(result.body).toHaveProperty('_id');
    expect(result.body).toHaveProperty('idPixiv');
    expect(result.body).toHaveProperty('pixivName');
    expect(result.body).toHaveProperty('Content');
    expect(result.body).toHaveProperty('Quality');
    expect(result.body).toHaveProperty('Favorite');
    expect(result.body).toHaveProperty('Link');
  });

  it('Update pixiv, should return a object with message', async () => {
    const updatePixiv = {
      idPixiv: '5121919',
      pixivName: 'moda',
      Content: 'OC, girls, palid',
      Quality: '++++',
      Favorite: 'FF+',
      Link: 'https://www.pixiv.net/en/users/5121919',
    };
    const _id = '60627879c0b5822e6427cdef';
    await api
      .put(`/api/pixiv/${_id}`)
      .send(updatePixiv)
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .expect({ message: 'Pixiv updated' });
  });
});
