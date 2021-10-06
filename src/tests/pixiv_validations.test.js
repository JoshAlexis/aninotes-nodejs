const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');

const api = supertest(app);

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Pixiv Schema validations', () => {
  describe('All fields are required in body, should response a JSON with message \'is required\' ', () => {
    const pixivWithoutOneField = {
      idPixiv: '5121919',
      pixivName: 'moda',
      Content: 'OC, girls, palid',
      Quality: '++++',
      Link: 'https://www.pixiv.net/en/users/5121919',
    };
    it('POST request', async () => {
      const response = await api.post('/api/pixiv/').send(pixivWithoutOneField);
      expect(response.status).toBe(422);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('status');
      expect(response.body.error).toHaveProperty('message');
      expect(response.body.error.message).toMatch(/is required/);
    });

    it('PUT request', async () => {
      const response = await api.put('/api/pixiv/60627879c0b5822e6427cdef').send(pixivWithoutOneField);
      expect(response.status).toBe(422);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('status');
      expect(response.body.error).toHaveProperty('message');
      expect(response.body.error.message).toMatch(/is required/);
    });
  });

  describe('All fields not to be empty, except pixivName, should response a JSON with message \'is not allowed to be empty\'', () => {
    const pixivWithFieldEmpty = {
      idPixiv: '5121919',
      pixivName: 'moda',
      Content: 'OC, girls, palid',
      Quality: '++++',
      Favorite: '',
      Link: 'https://www.pixiv.net/en/users/5121919',
    };
    it('POST request', async () => {
      const response = await api.post('/api/pixiv/').send(pixivWithFieldEmpty);
      expect(response.status).toBe(422);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('status');
      expect(response.body.error).toHaveProperty('message');
      expect(response.body.error.message).toMatch(/is not allowed to be empty/);
    });

    it('PUT request', async () => {
      const response = await api.put('/api/pixiv/60627879c0b5822e6427cdef').send(pixivWithFieldEmpty);
      expect(response.status).toBe(422);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('status');
      expect(response.body.error).toHaveProperty('message');
      expect(response.body.error.message).toMatch(/is not allowed to be empty/);
    });
  });

  describe('GET /api/pixiv/content/ endpoint', () => {
    const bodyEmpty = {};
    const bodyWithFieldEmpty = {
      Content: '',
    };

    it('Body must include field \'Content\', should response JSON with message \'is required\'', async () => {
      const response = await api.get('/api/pixiv/content/').send(bodyEmpty);
      expect(response.status).toBe(422);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('status');
      expect(response.body.error).toHaveProperty('message');
      expect(response.body.error.message).toMatch(/is required/);
    });

    it('Body must include field \'Content\', should response JSON with message \'is not allowed to be empty\'', async () => {
      const response = await api.get('/api/pixiv/content/').send(bodyWithFieldEmpty);
      expect(response.status).toBe(422);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('status');
      expect(response.body.error).toHaveProperty('message');
      expect(response.body.error.message).toMatch(/is not allowed to be empty/);
    });
  });
});

describe('Paginated query', () => {
  describe('Get pixiv', () => {
    it('Query without page param, should response \'Must include query params\'', async () => {
      const response = await api.get('/api/pixiv/')
        .query({
          limit: 10,
        });
      expect(response.status).toBe(400);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('status');
      expect(response.body.error).toHaveProperty('message');
      expect(response.body.error.message).toMatch(/Must include query params/);
    });

    it('Query without page limit, should response \'Must include query params\'', async () => {
      const response = await api.get('/api/pixiv/')
        .query({
          page: 1,
        });
      expect(response.status).toBe(400);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('status');
      expect(response.body.error).toHaveProperty('message');
      expect(response.body.error.message).toMatch(/Must include query params/);
    });

    it('Query without query params, should response \'Must include query params\'', async () => {
      const response = await api.get('/api/pixiv/')
        .query({});
      expect(response.status).toBe(400);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('status');
      expect(response.body.error).toHaveProperty('message');
      expect(response.body.error.message).toMatch(/Must include query params/);
    });

    it('Query without value for page, should response \'Must include query params\'', async () => {
      const response = await api.get('/api/pixiv/')
        .query({
          page: '',
        });
      expect(response.status).toBe(400);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('status');
      expect(response.body.error).toHaveProperty('message');
      expect(response.body.error.message).toMatch(/Must include query params/);
    });

    it('Query without value for limit, should response \'Must include query params\'', async () => {
      const response = await api.get('/api/pixiv/')
        .query({
          limit: '',
        });
      expect(response.status).toBe(400);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('status');
      expect(response.body.error).toHaveProperty('message');
      expect(response.body.error.message).toMatch(/Must include query params/);
    });

    it('Query without value for limit and page, should response \'Must include query params\'', async () => {
      const response = await api.get('/api/pixiv/')
        .query({
          page: '',
          limit: '',
        });
      expect(response.status).toBe(400);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('status');
      expect(response.body.error).toHaveProperty('message');
      expect(response.body.error.message).toMatch(/Must include query params/);
    });
  });

  describe('Get pixiv by field Content', () => {
    const body = {
      Content: 'azur lane',
    };
    it('Query without page param, should response \'Must include query params\'', async () => {
      const response = await api.get('/api/pixiv/content/')
        .query({
          limit: 10,
        })
        .send(body);
      expect(response.status).toBe(400);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('status');
      expect(response.body.error).toHaveProperty('message');
      expect(response.body.error.message).toMatch(/Must include query params/);
    });

    it('Query without page limit, should response \'Must include query params\'', async () => {
      const response = await api.get('/api/pixiv/content/')
        .query({
          page: 1,
        })
        .send(body);
      expect(response.status).toBe(400);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('status');
      expect(response.body.error).toHaveProperty('message');
      expect(response.body.error.message).toMatch(/Must include query params/);
    });

    it('Query without value for page, should response \'Must include query params\'', async () => {
      const response = await api.get('/api/pixiv/content/')
        .query({
          page: '',
        })
        .send(body);
      expect(response.status).toBe(400);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('status');
      expect(response.body.error).toHaveProperty('message');
      expect(response.body.error.message).toMatch(/Must include query params/);
    });

    it('Query without value for limit, should response \'Must include query params\'', async () => {
      const response = await api.get('/api/pixiv/content/')
        .query({
          limit: '',
        })
        .send(body);
      expect(response.status).toBe(400);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('status');
      expect(response.body.error).toHaveProperty('message');
      expect(response.body.error.message).toMatch(/Must include query params/);
    });

    it('Query without value for limit and page, should response \'Must include query params\'', async () => {
      const response = await api.get('/api/pixiv/content/')
        .query({
          page: '',
          limit: '',
        })
        .send(body);
      expect(response.status).toBe(400);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('status');
      expect(response.body.error).toHaveProperty('message');
      expect(response.body.error.message).toMatch(/Must include query params/);
    });
  });
});

describe('Valid param in /api/pixiv/idpixiv/:idPixiv, should return JSON with message \'is not a valid param\' ', () => {
  it('Alphanumeric param', async () => {
    const response = await api.get('/api/pixiv/idpixiv/as423sd');
    expect(response.status).toBe(400);
    expect(response.headers['content-type']).toMatch(/application\/json/);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toHaveProperty('status');
    expect(response.body.error).toHaveProperty('message');
    expect(response.body.error.message).toMatch(/is not a valid param/);
  });

  it('Alphanumeric with special chars param', async () => {
    const response = await api.get('/api/pixiv/idpixiv/as-$423s*+~32ad');
    expect(response.status).toBe(400);
    expect(response.headers['content-type']).toMatch(/application\/json/);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toHaveProperty('status');
    expect(response.body.error).toHaveProperty('message');
    expect(response.body.error.message).toMatch(/is not a valid param/);
  });

  it('Empty param', async () => {
    const response = await api.get('/api/pixiv/idpixiv/as-$423sd');
    expect(response.status).toBe(400);
    expect(response.headers['content-type']).toMatch(/application\/json/);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toHaveProperty('status');
    expect(response.body.error).toHaveProperty('message');
    expect(response.body.error.message).toMatch(/is not a valid param/);
  });

  it('Only chars param', async () => {
    const response = await api.get('/api/pixiv/idpixiv/as-$423sd');
    expect(response.status).toBe(400);
    expect(response.headers['content-type']).toMatch(/application\/json/);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toHaveProperty('status');
    expect(response.body.error).toHaveProperty('message');
    expect(response.body.error.message).toMatch(/is not a valid param/);
  });
});

describe('Valid ObjectID param in /api/pixiv/:id, should return JSON with message \'is not a valid param\' ', () => {
  it('Not 24 length param', async () => {
    const response = await api.put('/api/pixiv/60627879c0b5822e6427');
    expect(response.status).toBe(400);
    expect(response.headers['content-type']).toMatch(/application\/json/);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toHaveProperty('status');
    expect(response.body.error).toHaveProperty('message');
    expect(response.body.error.message).toMatch(/is not a valid param/);
  });

  it('Not alphanumeric param', async () => {
    const response = await api.put('/api/pixiv/60627879000582226427');
    expect(response.status).toBe(400);
    expect(response.headers['content-type']).toMatch(/application\/json/);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toHaveProperty('status');
    expect(response.body.error).toHaveProperty('message');
    expect(response.body.error.message).toMatch(/is not a valid param/);
  });
});
