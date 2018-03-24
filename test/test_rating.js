import chai from 'chai';
import mocha from 'mocha';
import chaiHttp from 'chai-http';
import server from '../src/index';

const { it, describe } = mocha;

chai.use(chaiHttp);

const testRating = {
  albumName: 'Test Album',
  artist: 'Test Artist',
  rating: 10,
  comments: 'It was great!',
};
let createdRating;
let userId;

describe('Set up user', () => {
  const testUser = {
    profileId: 'abcd1234',
    email: 'test@test.com',
  };

  it('should get created', (done) => {
    chai.request(server)
      .post('/user')
      .send(testUser)
      .end((err, res) => {
        chai.assert.equal(res.status, 201);
        ({ userId } = res.body);
        done();
      });
  });
});

describe('Test Ratings', () => {
  it('should get created', (done) => {
    chai.request(server)
      .post(`/rating?user_id=${userId}`)
      .send(testRating)
      .end((err, res) => {
        chai.assert.equal(res.status, 201);
        chai.assert.equal(res.body.rating, 10);
        createdRating = res.body;
        done();
      });
  });

  it('should get not get created', (done) => {
    const badRating = JSON.parse(JSON.stringify(testRating));
    badRating.rating = 11;
    chai.request(server)
      .post(`/rating?user_id=${userId}`)
      .send(badRating)
      .end((err, res) => {
        chai.assert.equal(res.status, 400);
        done();
      });
  });

  it('should update', (done) => {
    const updatedRating = JSON.parse(JSON.stringify(testRating));
    updatedRating.rating = 5;
    chai.request(server)
      .put(`/rating/${createdRating.ratingId}?user_id=${userId}`)
      .send(updatedRating)
      .end((err, res) => {
        chai.assert.equal(res.status, 200);
        chai.assert.equal(res.body.rating, 5);
        done();
      });
  });

  it('should not update', (done) => {
    const badRating = JSON.parse(JSON.stringify(testRating));
    badRating.rating = 11;
    chai.request(server)
      .put(`/rating/${createdRating.ratingId}?user_id=${userId}`)
      .send(badRating)
      .end((err, res) => {
        chai.assert.equal(res.status, 400);
        done();
      });
  });

  it('should get retrieved', (done) => {
    chai.request(server)
      .get(`/rating/${createdRating.ratingId}?user_id=${userId}`)
      .end((err, res) => {
        chai.assert.equal(res.status, 200);
        chai.assert.equal(res.body.albumName, testRating.albumName);
        done();
      });
  });

  it('should get all', (done) => {
    chai.request(server)
      .get(`/rating?user_id=${userId}`)
      .end((err, res) => {
        chai.assert.equal(res.status, 200);
        chai.assert.isTrue(res.body.length > 0);
        done();
      });
  });

  it('should not get retrieved', (done) => {
    chai.request(server)
      .get(`/rating/fail?user_id=${userId}`)
      .end((err, res) => {
        chai.assert.equal(res.status, 404);
        done();
      });
  });

  it('should get deleted', (done) => {
    chai.request(server)
      .delete(`/rating/${createdRating.ratingId}?user_id=${userId}`)
      .end((err, res) => {
        chai.assert.equal(res.status, 200);
        done();
      });
  });
});

describe('Tear down user', () => {
  it('should get deleted', (done) => {
    chai.request(server)
      .delete(`/user/${userId}`)
      .end((err, res) => {
        chai.assert.equal(res.status, 200);
        done();
      });
  });
});
