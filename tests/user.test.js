const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const { userOneId, userOne, setupDatabase, userTwo } = require('./fixtures/db');

// We wipe the database so we can start adding users
beforeEach(setupDatabase);

test('Should sign up a new user', async () => {
  const response = await request(app).post('/users').send({
    name: 'Andrew',
    email: 'andrew@example.com',
    password: 'MyPass777!'
  }).expect(201)

  // Assert that the database was changed correctly
  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  // Assertions about the response
  expect(response.body).toMatchObject({
    user: {
      name: 'Andrew',
      email: 'andrew@example.com'
    },
    token: user.tokens[0].token
  })
  expect(user.password).not.toBe('MyPass777!');
});

test('Should not sign up user with invalid name/email/password', async () => {
  await request(app).post('/users').send({
    name: 'Andrew',
    email: 'andrewexample.com',
    password: 'My'
  }).expect(400)
});

test('Should login existing user', async () => {
  const response = await request(app).post('/users/login').send({
    email: userOne.email,
    password: userOne.password
  }).expect(200)

  const user = await User.findById(response.body.user._id);

  expect(response.body.token).toBe(user.tokens[1].token);
});

test('Should should not login nonexistent user', async () => {
  await request(app).post('/users/login').send({
    email: 'incorrent@email.com',
    password: 'incorrectpassword'
  }).expect(400)
});

test('Should get profile for user', async () => {
  await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
  await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})

test('Should delete account for user', async () => {
  await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

  const user = await User.findById(userOneId);
  expect(user).toBeNull();
})

test('Should not delete account for unauthenticated user', async () => {
  await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
})

test('Should upload avatar image', async () => {
  await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/profile-pic.jpg')
    .expect(200)
  
  const user = await User.findById(userOneId);
  // toBe is === while toEqual is more like ==
  expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: "Gabor"
    })
    .expect(200)

  const user = await User.findById(userOneId);
  expect(user.name).toEqual('Gabor');
})

test('Should not update invalid user fields', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      location: "Philly"
    })
    .expect(400)
})

test('Should not update user with invalid name/email/password', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      email: "Philly"
    })
    .expect(400)
})

test('Should not update user if unauthenticated', async () => {
  await request(app)
    .patch('/users/me')
    .send({
      name: "Gabor"
    })
    .expect(401)
})