const request = require('supertest');
const app = require('../src/app');
const Task = require('../src/models/task');
const { taskOne, userOne, userTwo, setupDatabase, userOneId, taskTwo, taskThree } = require('./fixtures/db');

// We wipe the database so we can start adding users
beforeEach(setupDatabase);

test('Should create task for user', async () => {
  const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: 'From my test'
    })
    .expect(201)

  const task = await Task.findById(response.body._id);
  expect(task).not.toBeNull();
  expect(task.completed).toEqual(false);
})

test('Should not create task with invalid description/completed', async () => {
  await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      completed: 'From my test'
    })
    .expect(400)
})

test('Should not update another users task', async () => {
  await request(app)
    .patch(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send({
      completed: true
    })
    .expect(404)
})

test('Should not update task with invalid description/completed', async () => {
  await request(app)
    .patch(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      completed: 'From my test'
    })
    .expect(400)
})

test('Should fetch all tasks for user', async () => {
  const response = await request(app)
  .get('/tasks')
  .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
  .send()
  .expect(200)

  expect(response.body.length).toEqual(2)
})

test('Should fetch all completed tasks for user', async () => {
  const response = await request(app)
  .get('/tasks?completed=true')
  .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
  .send()
  .expect(200)

  expect(response.body.length).toEqual(1)
})

test('Should fetch all incomplete tasks for user', async () => {
  const response = await request(app)
  .get('/tasks?completed=false')
  .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
  .send()
  .expect(200)

  expect(response.body.length).toEqual(1)
})

test('Should sort tasks by createdAt ascending', async () => {
  await request(app)
  .get('/tasks?sortBy=createdAt:asc')
  .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
  .send()
  .expect(200)

})

test('Should fetch user task by id', async () => {
  const response = await request(app)
  .get(`/tasks/${taskTwo._id}`)
  .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
  .send()
  .expect(200)

  expect(response.body).toMatchObject({
    description: 'Second task',
    completed: true,
  })
})

test('Should not fetch user task by id if unauthenticated', async () => {
  await request(app)
  .get(`/tasks/${taskThree._id}`)
  .send()
  .expect(401)
})

test('Should not fetch other users task', async () => {
  await request(app)
  .get(`/tasks/${taskThree._id}`)
  .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
  .send()
  .expect(404)
})

test('Should delete user task', async () => {
  await request(app)
  .delete(`/tasks/${taskOne._id}`)
  .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
  .send()
  .expect(200)

  const task = await Task.findById(taskOne._id);
  expect(task).toBeNull();
})

test('Should not delete user task if unauthenticated', async () => {
  await request(app)
  .delete(`/tasks/${taskOne._id}`)
  .send()
  .expect(401)

  const task = await Task.findById(taskOne._id);
  expect(task).not.toBeNull();
})

test('Should fail at deleting another users task', async () => {
  await request(app)
  .delete(`/tasks/${taskOne._id}`)
  .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
  .send()
  .expect(404)

  const task = await Task.findById(taskOne._id);
  expect(task).not.toBeNull();
})