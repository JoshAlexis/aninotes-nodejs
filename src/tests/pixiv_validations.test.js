const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const { pixiv } = require('../utils/endpoints');
const { pixivTestingData } = require('./testingData');

const api = supertest(app);

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Pixiv Schema validations', () => {
  describe('All fields are required in body, should response a JSON with message \'is required\' ', () => {
    it('POST request', async () => {
      const response = await api.post(pixiv.ADD_NEW_PIXIV)
        .send(pixivTestingData.pixivWithoutOneField);
      expect(response.status).toBe(422);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/is required/);
    });

    it('PUT request', async () => {
      const response = await api.put(`${pixiv.UPDATE_PIXIV}${pixivTestingData._id}`)
        .send(pixivTestingData.pixivWithoutOneField);
      expect(response.status).toBe(422);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/is required/);
    });
  });

  describe('All fields not to be empty, except pixivName, should response a JSON with message \'is not allowed to be empty\'', () => {
    it('POST request', async () => {
      const response = await api.post(pixiv.ADD_NEW_PIXIV)
        .send(pixivTestingData.pixivWithFieldEmpty);
      expect(response.status).toBe(422);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/is not allowed to be empty/);
    });

    it('PUT request', async () => {
      const response = await api.put(`${pixiv.UPDATE_PIXIV}${pixivTestingData._id}`)
        .send(pixivTestingData.pixivWithFieldEmpty);
      expect(response.status).toBe(422);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/is not allowed to be empty/);
    });
  });

  describe('GET /api/pixiv/content/ endpoint', () => {
    it('Body must include field \'Content\', should response JSON with message \'is required\'', async () => {
      const response = await api.get(pixiv.GET_PIXIV_BY_CONTENT)
        .query({
          page: 1,
          limit: 10,
        })
        .send(pixivTestingData.bodyEmpty);
      expect(response.status).toBe(422);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/is required/);
    });

    it('Body must include field \'Content\', should response JSON with message \'is not allowed to be empty\'', async () => {
      const response = await api.get(pixiv.GET_PIXIV_BY_CONTENT)
        .query({
          page: 1,
          limit: 10,
        })
        .send(pixivTestingData.bodyWithFieldEmpty);
      expect(response.status).toBe(422);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/is not allowed to be empty/);
    });
  });
});

describe('Paginated query', () => {
  describe('Get pixiv', () => {
    it('Query without page param, should response \'Must include query params\'', async () => {
      const response = await api.get(pixiv.GET_PIXIV)
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
      const response = await api.get(pixiv.GET_PIXIV)
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
      const response = await api.get(pixiv.GET_PIXIV)
        .query({});
      expect(response.status).toBe(400);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/Must include query params/);
    });

    it('Query without value for page, should response \'Must include query params\'', async () => {
      const response = await api.get(pixiv.GET_PIXIV)
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
      const response = await api.get(pixiv.GET_PIXIV)
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
      const response = await api.get(pixiv.GET_PIXIV)
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

  describe('Get pixiv by field Content', () => {
    it('Query without page param, should response \'Must include query params\'', async () => {
      const response = await api.get(pixiv.GET_PIXIV_BY_CONTENT)
        .query({
          limit: 10,
        })
        .send(pixivTestingData.contentBody);
      expect(response.status).toBe(400);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/Must include query params/);
    });

    it('Query without page limit, should response \'Must include query params\'', async () => {
      const response = await api.get(pixiv.GET_PIXIV_BY_CONTENT)
        .query({
          page: 1,
        })
        .send(pixivTestingData.contentBody);
      expect(response.status).toBe(400);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/Must include query params/);
    });

    it('Query without value for page, should response \'Must include query params\'', async () => {
      const response = await api.get(pixiv.GET_PIXIV_BY_CONTENT)
        .query({
          page: '',
        })
        .send(pixivTestingData.contentBody);
      expect(response.status).toBe(400);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/Must include query params/);
    });

    it('Query without value for limit, should response \'Must include query params\'', async () => {
      const response = await api.get(pixiv.GET_PIXIV_BY_CONTENT)
        .query({
          limit: '',
        })
        .send(pixivTestingData.contentBody);
      expect(response.status).toBe(400);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/Must include query params/);
    });

    it('Query without value for limit and page, should response \'Must include query params\'', async () => {
      const response = await api.get(pixiv.GET_PIXIV_BY_CONTENT)
        .query({
          page: '',
          limit: '',
        })
        .send(pixivTestingData.contentBody);
      expect(response.status).toBe(400);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/Must include query params/);
    });
  });
});

describe('Valid param in /api/pixiv/idpixiv/:idPixiv, should return JSON with message \'is not a valid param\' ', () => {
  it('Alphanumeric param', async () => {
    const response = await api.get(`${pixiv.GET_PIXIV_BY_IDPIXIV}as423sd`);
    expect(response.status).toBe(400);
    expect(response.headers['content-type']).toMatch(/application\/json/);
    expect(response.body).toHaveProperty('status');
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toMatch(/is not a valid param/);
  });

  it('Alphanumeric with special chars param', async () => {
    const response = await api.get(`${pixiv.GET_PIXIV_BY_IDPIXIV}as-$423s*+~32ad`);
    expect(response.status).toBe(400);
    expect(response.headers['content-type']).toMatch(/application\/json/);
    expect(response.body).toHaveProperty('status');
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toMatch(/is not a valid param/);
  });

  it('Empty param', async () => {
    const response = await api.get(`${pixiv.GET_PIXIV_BY_IDPIXIV}as-$423sd`);
    expect(response.status).toBe(400);
    expect(response.headers['content-type']).toMatch(/application\/json/);
    expect(response.body).toHaveProperty('status');
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toMatch(/is not a valid param/);
  });

  it('Only chars param', async () => {
    const response = await api.get(`${pixiv.GET_PIXIV_BY_IDPIXIV}as-$423sd`);
    expect(response.status).toBe(400);
    expect(response.headers['content-type']).toMatch(/application\/json/);
    expect(response.body).toHaveProperty('status');
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toMatch(/is not a valid param/);
  });
});
