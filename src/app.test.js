const request = require('supertest');
const app = require('./app'); // Adjust the path as necessary

describe('POST /submit', () => {
  it('should detect prototype pollution vulnerability', async () => {
    const response = await request(app)
      .post('/submit')
      .send('__proto__[isAdmin]=true'); // Sending payload as x-www-form-urlencoded

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('VULNERABILITY DETECTED!');
    expect(response.body.message).toBe('A property was unexpectedly added to the object prototype. Object.prototype was polluted!');
  });

  it('should return success for non-malicious payload', async () => {
    const response = await request(app)
      .post('/submit')
      .send({ username: 'testuser', data: 'testdata' }); // Sending a normal JSON payload

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('Success');
    expect(response.body.message).toBe('Data received successfully. (No obvious prototype pollution detected in this request, try the exploit payload!)');
  });
});

describe('GET /', () => {
  it('should return a 200 status and the correct message', async () => {
    const response = await request(app)
      .get('/');

    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Vulnerable Node.js backend is running. Send POST requests to /submit.');
  });
});
