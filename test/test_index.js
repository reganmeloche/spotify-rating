import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/index.js';

chai.use(chaiHttp);

describe('Example Node Server', () => {
  it('should return 200', done => {
    chai.request(server)
      .get('/test')
      .end((err, res) => {
        chai.assert.equal(res.status, 200);
        done();
      });
  });
});