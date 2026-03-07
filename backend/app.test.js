const request = require('supertest');
const app = require('./server'); 

describe('Skill Market API Health Check', () => {
  
  it('should return 200 OK for the health endpoint', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toEqual(200);
  });

  it('should return 404 for a non-existing route', async () => {
    const res = await request(app).get('/api/skillmarket-invalid-route');
    expect(res.statusCode).toEqual(404);
  });

});