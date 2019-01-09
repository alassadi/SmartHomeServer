const test = require('firebase-functions-test')();
const myFunctions = require('../app/index.js'); // relative path to functions code
const sinon = require('sinon');
const admin = require('firebase-admin');
var request = require('supertest');
var app = require('../app/index');

// If index.js calls admin.initializeApp at the top of the file,
// we need to stub it out before requiring index.js. This is because the
// functions will be executed as a part of the require process.
// Here we stub admin.initializeApp to be a dummy function that doesn't do anything.
var adminInitStub = sinon.stub(admin, 'initializeApp');
// Now we can require index.js and save the exports inside a namespace called myFunctions.

describe('GET /rooms', function() {
  it('respond with html and 404', function(done) {
    request(app)
      .get('/rooms/')
      .set('Authorization', 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjBmNzM4YTUyYTJjZTlmMzE3MjBhNjdhYjFjY2E4ZTM3OGVkMTBkMTIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vc21hcnRob21lLTNjNmI5IiwiYXVkIjoic21hcnRob21lLTNjNmI5IiwiYXV0aF90aW1lIjoxNTQ2OTc5NTg2LCJ1c2VyX2lkIjoiMldaQ3hqTlRqWVhUSFZZV2F4NzBRSTJodjVFMiIsInN1YiI6IjJXWkN4ak5UallYVEhWWVdheDcwUUkyaHY1RTIiLCJpYXQiOjE1NDY5Nzk1ODYsImV4cCI6MTU0Njk4MzE4NiwiZW1haWwiOiJhYm9vZEB0ZXN0LmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJhYm9vZEB0ZXN0LmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.W937_b0ckfGGK2peFrwb72rreKsRw4smqXXhT2KIKMLToX4cCBlObRRGn1nx-tM-tpUnnulubF6pARBB3JeMYfoYNg5HQcRE_KsMw0ezrHnwtvl-GNo9QTETN_PbLor_Bt3xtYZW_q-jZtw6G8EXXtWaQlvI06rmiGLNWU2nX4vSIFxdeTuH7ysYbW6QhgQvIHZLtPKeRI8Rb7F14ZvDuGOgGCxp7XBgXXKo-T9tJOu8ZUkPz7yuMn54NF-"Cw2lQEM_fu2IlLiYdm9PC4Q8dnwShrFyoUrKdeKiJi_D6Fn1XUKZhuAJP1lheMmvfKGhdqRpVmhJYyia8RYEvRNRAXA')
      .set('Accept', 'application/json')
      .expect('Content-Type', /html/)
      .expect(404, done);
  });
});

describe('POST /rooms', function() {
  it('respond with html and 404', function(done) {
    request(app)
      .post('/rooms/')
      .send({test: "data"})
      .set('Authorization', 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjBmNzM4YTUyYTJjZTlmMzE3MjBhNjdhYjFjY2E4ZTM3OGVkMTBkMTIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vc21hcnRob21lLTNjNmI5IiwiYXVkIjoic21hcnRob21lLTNjNmI5IiwiYXV0aF90aW1lIjoxNTQ2OTc5NTg2LCJ1c2VyX2lkIjoiMldaQ3hqTlRqWVhUSFZZV2F4NzBRSTJodjVFMiIsInN1YiI6IjJXWkN4ak5UallYVEhWWVdheDcwUUkyaHY1RTIiLCJpYXQiOjE1NDY5Nzk1ODYsImV4cCI6MTU0Njk4MzE4NiwiZW1haWwiOiJhYm9vZEB0ZXN0LmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJhYm9vZEB0ZXN0LmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.W937_b0ckfGGK2peFrwb72rreKsRw4smqXXhT2KIKMLToX4cCBlObRRGn1nx-tM-tpUnnulubF6pARBB3JeMYfoYNg5HQcRE_KsMw0ezrHnwtvl-GNo9QTETN_PbLor_Bt3xtYZW_q-jZtw6G8EXXtWaQlvI06rmiGLNWU2nX4vSIFxdeTuH7ysYbW6QhgQvIHZLtPKeRI8Rb7F14ZvDuGOgGCxp7XBgXXKo-T9tJOu8ZUkPz7yuMn54NF-"Cw2lQEM_fu2IlLiYdm9PC4Q8dnwShrFyoUrKdeKiJi_D6Fn1XUKZhuAJP1lheMmvfKGhdqRpVmhJYyia8RYEvRNRAXA')
      .set('Accept', 'application/json')
      .expect('Content-Type', /html/)
      .expect(404, done);
  });
});

describe('GET /users', function() {
  it('respond with html and 404', function(done) {
    request(app)
      .get('/users/')
      .set('Authorization', 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjBmNzM4YTUyYTJjZTlmMzE3MjBhNjdhYjFjY2E4ZTM3OGVkMTBkMTIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vc21hcnRob21lLTNjNmI5IiwiYXVkIjoic21hcnRob21lLTNjNmI5IiwiYXV0aF90aW1lIjoxNTQ2OTc5NTg2LCJ1c2VyX2lkIjoiMldaQ3hqTlRqWVhUSFZZV2F4NzBRSTJodjVFMiIsInN1YiI6IjJXWkN4ak5UallYVEhWWVdheDcwUUkyaHY1RTIiLCJpYXQiOjE1NDY5Nzk1ODYsImV4cCI6MTU0Njk4MzE4NiwiZW1haWwiOiJhYm9vZEB0ZXN0LmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJhYm9vZEB0ZXN0LmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.W937_b0ckfGGK2peFrwb72rreKsRw4smqXXhT2KIKMLToX4cCBlObRRGn1nx-tM-tpUnnulubF6pARBB3JeMYfoYNg5HQcRE_KsMw0ezrHnwtvl-GNo9QTETN_PbLor_Bt3xtYZW_q-jZtw6G8EXXtWaQlvI06rmiGLNWU2nX4vSIFxdeTuH7ysYbW6QhgQvIHZLtPKeRI8Rb7F14ZvDuGOgGCxp7XBgXXKo-T9tJOu8ZUkPz7yuMn54NF-"Cw2lQEM_fu2IlLiYdm9PC4Q8dnwShrFyoUrKdeKiJi_D6Fn1XUKZhuAJP1lheMmvfKGhdqRpVmhJYyia8RYEvRNRAXA')
      .set('Accept', 'application/json')
      .expect('Content-Type', /html/)
      .expect(404, done);
  });
});

describe('POST /users', function() {
  it('respond with html and 404', function(done) {
    request(app)
      .post('/users/')
      .send({test: "data"})
      .set('Authorization', 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjBmNzM4YTUyYTJjZTlmMzE3MjBhNjdhYjFjY2E4ZTM3OGVkMTBkMTIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vc21hcnRob21lLTNjNmI5IiwiYXVkIjoic21hcnRob21lLTNjNmI5IiwiYXV0aF90aW1lIjoxNTQ2OTc5NTg2LCJ1c2VyX2lkIjoiMldaQ3hqTlRqWVhUSFZZV2F4NzBRSTJodjVFMiIsInN1YiI6IjJXWkN4ak5UallYVEhWWVdheDcwUUkyaHY1RTIiLCJpYXQiOjE1NDY5Nzk1ODYsImV4cCI6MTU0Njk4MzE4NiwiZW1haWwiOiJhYm9vZEB0ZXN0LmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJhYm9vZEB0ZXN0LmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.W937_b0ckfGGK2peFrwb72rreKsRw4smqXXhT2KIKMLToX4cCBlObRRGn1nx-tM-tpUnnulubF6pARBB3JeMYfoYNg5HQcRE_KsMw0ezrHnwtvl-GNo9QTETN_PbLor_Bt3xtYZW_q-jZtw6G8EXXtWaQlvI06rmiGLNWU2nX4vSIFxdeTuH7ysYbW6QhgQvIHZLtPKeRI8Rb7F14ZvDuGOgGCxp7XBgXXKo-T9tJOu8ZUkPz7yuMn54NF-"Cw2lQEM_fu2IlLiYdm9PC4Q8dnwShrFyoUrKdeKiJi_D6Fn1XUKZhuAJP1lheMmvfKGhdqRpVmhJYyia8RYEvRNRAXA')
      .set('Accept', 'application/json')
      .expect('Content-Type', /html/)
      .expect(404, done);
  });
});

describe('POST /units', function() {
  it('respond with html and 404', function(done) {
    request(app)
      .post('/units/')
      .send({test: "data"})
      .set('Authorization', 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjBmNzM4YTUyYTJjZTlmMzE3MjBhNjdhYjFjY2E4ZTM3OGVkMTBkMTIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vc21hcnRob21lLTNjNmI5IiwiYXVkIjoic21hcnRob21lLTNjNmI5IiwiYXV0aF90aW1lIjoxNTQ2OTc5NTg2LCJ1c2VyX2lkIjoiMldaQ3hqTlRqWVhUSFZZV2F4NzBRSTJodjVFMiIsInN1YiI6IjJXWkN4ak5UallYVEhWWVdheDcwUUkyaHY1RTIiLCJpYXQiOjE1NDY5Nzk1ODYsImV4cCI6MTU0Njk4MzE4NiwiZW1haWwiOiJhYm9vZEB0ZXN0LmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJhYm9vZEB0ZXN0LmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.W937_b0ckfGGK2peFrwb72rreKsRw4smqXXhT2KIKMLToX4cCBlObRRGn1nx-tM-tpUnnulubF6pARBB3JeMYfoYNg5HQcRE_KsMw0ezrHnwtvl-GNo9QTETN_PbLor_Bt3xtYZW_q-jZtw6G8EXXtWaQlvI06rmiGLNWU2nX4vSIFxdeTuH7ysYbW6QhgQvIHZLtPKeRI8Rb7F14ZvDuGOgGCxp7XBgXXKo-T9tJOu8ZUkPz7yuMn54NF-"Cw2lQEM_fu2IlLiYdm9PC4Q8dnwShrFyoUrKdeKiJi_D6Fn1XUKZhuAJP1lheMmvfKGhdqRpVmhJYyia8RYEvRNRAXA')
      .set('Accept', 'application/json')
      .expect('Content-Type', /html/)
      .expect(404, done);
  });
});

describe('GET /devices', function() {
  it('respond with html and 404', function(done) {
    request(app)
      .get('/devices/')
      .set('Authorization', 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjBmNzM4YTUyYTJjZTlmMzE3MjBhNjdhYjFjY2E4ZTM3OGVkMTBkMTIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vc21hcnRob21lLTNjNmI5IiwiYXVkIjoic21hcnRob21lLTNjNmI5IiwiYXV0aF90aW1lIjoxNTQ2OTc5NTg2LCJ1c2VyX2lkIjoiMldaQ3hqTlRqWVhUSFZZV2F4NzBRSTJodjVFMiIsInN1YiI6IjJXWkN4ak5UallYVEhWWVdheDcwUUkyaHY1RTIiLCJpYXQiOjE1NDY5Nzk1ODYsImV4cCI6MTU0Njk4MzE4NiwiZW1haWwiOiJhYm9vZEB0ZXN0LmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJhYm9vZEB0ZXN0LmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.W937_b0ckfGGK2peFrwb72rreKsRw4smqXXhT2KIKMLToX4cCBlObRRGn1nx-tM-tpUnnulubF6pARBB3JeMYfoYNg5HQcRE_KsMw0ezrHnwtvl-GNo9QTETN_PbLor_Bt3xtYZW_q-jZtw6G8EXXtWaQlvI06rmiGLNWU2nX4vSIFxdeTuH7ysYbW6QhgQvIHZLtPKeRI8Rb7F14ZvDuGOgGCxp7XBgXXKo-T9tJOu8ZUkPz7yuMn54NF-"Cw2lQEM_fu2IlLiYdm9PC4Q8dnwShrFyoUrKdeKiJi_D6Fn1XUKZhuAJP1lheMmvfKGhdqRpVmhJYyia8RYEvRNRAXA')
      .set('Accept', 'application/json')
      .expect('Content-Type', /html/)
      .expect(404, done);
  });
});

describe('POST /devices', function() {
  it('respond with html and 404', function(done) {
    request(app)
      .post('/devices/')
      .send({test: "data"})
      .set('Authorization', 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjBmNzM4YTUyYTJjZTlmMzE3MjBhNjdhYjFjY2E4ZTM3OGVkMTBkMTIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vc21hcnRob21lLTNjNmI5IiwiYXVkIjoic21hcnRob21lLTNjNmI5IiwiYXV0aF90aW1lIjoxNTQ2OTc5NTg2LCJ1c2VyX2lkIjoiMldaQ3hqTlRqWVhUSFZZV2F4NzBRSTJodjVFMiIsInN1YiI6IjJXWkN4ak5UallYVEhWWVdheDcwUUkyaHY1RTIiLCJpYXQiOjE1NDY5Nzk1ODYsImV4cCI6MTU0Njk4MzE4NiwiZW1haWwiOiJhYm9vZEB0ZXN0LmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJhYm9vZEB0ZXN0LmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.W937_b0ckfGGK2peFrwb72rreKsRw4smqXXhT2KIKMLToX4cCBlObRRGn1nx-tM-tpUnnulubF6pARBB3JeMYfoYNg5HQcRE_KsMw0ezrHnwtvl-GNo9QTETN_PbLor_Bt3xtYZW_q-jZtw6G8EXXtWaQlvI06rmiGLNWU2nX4vSIFxdeTuH7ysYbW6QhgQvIHZLtPKeRI8Rb7F14ZvDuGOgGCxp7XBgXXKo-T9tJOu8ZUkPz7yuMn54NF-"Cw2lQEM_fu2IlLiYdm9PC4Q8dnwShrFyoUrKdeKiJi_D6Fn1XUKZhuAJP1lheMmvfKGhdqRpVmhJYyia8RYEvRNRAXA')
      .set('Accept', 'application/json')
      .expect('Content-Type', /html/)
      .expect(404, done);
  });
});