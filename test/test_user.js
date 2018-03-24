import chai from 'chai';
import mocha from 'mocha';
import chaiHttp from 'chai-http';
import server from '../src/index';

const { it, describe } = mocha;

chai.use(chaiHttp);

const testUser = {
  profileId: 'abcd1234',
  email: 'test@test.com',
};
let createdUser;

describe('Test User', () => {
  it('should get created', (done) => {
    chai.request(server)
      .post('/user')
      .send(testUser)
      .end((err, res) => {
        chai.assert.equal(res.status, 201);
        chai.assert.equal(res.body.email, testUser.email);
        createdUser = res.body;
        done();
      });
  });

  it('should get retrieved', (done) => {
    chai.request(server)
      .get(`/user/${createdUser.userId}`)
      .end((err, res) => {
        chai.assert.equal(res.status, 200);
        chai.assert.equal(res.body.email, testUser.email);
        done();
      });
  });

  it('should not get retrieved', (done) => {
    chai.request(server)
      .get('/user/fail')
      .end((err, res) => {
        chai.assert.equal(res.status, 404);
        done();
      });
  });

  it('should get deleted', (done) => {
    chai.request(server)
      .delete(`/user/${createdUser.userId}`)
      .end((err, res) => {
        chai.assert.equal(res.status, 200);
        done();
      });
  });
});
