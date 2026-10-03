import axios from 'axios';

describe('GET /api/docs', () => {
  it('serves Swagger UI', async () => {
    const res = await axios.get(`/api/docs`);

    expect(res.status).toBe(200);
    expect(res.data).toContain('Swagger');
  });
})
