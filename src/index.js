const app = require('./app');
const port = process.env.PORT;

app.listen(port, () => {
  console.log('Server is up on port ' + port);
})
// This is the middleware for express
// app.use((req, res, next) => {
//   if (req.method === 'GET') {
//     res.send('GET requests are disabled')
//   } else {
//     next()
//   }
// });

// app.use((req, res, next) => {
//   res.status(503).send('Server is under maintenance');
// });

// Multer is for uploading images or other multi-part files
// const multer = require('multer');
// const upload = multer({
//   dest: 'images',
//   limits: {
//     fileSize: 1000000
//   },
//   fileFilter(req, file, cb) {
//     if (!file.originalname.match(/\.(doc|docx)$/)) {
//       return cb(new Error('Please upload a word document'));
//     }
//     cb(undefined, true);
//   }
// });

// const errorMiddleware = (req, res, next) => {
//   throw new Error('From my middleware')
// }
//                   // this is middleware
// app.post('/upload', upload.single('upload'), (req, res) => {
//   res.send();
// }, (error, req, res, next) => {
//   res.status(400).send({ error: error.message })
// });

// const jwt = require('jsonwebtoken');

// const myFunction = async () => {
//   const token = jwt.sign({ _id: 'abc123' }, 'thisismynewcourse', { expiresIn: '7 days' });
//   console.log(token);

//   const data = jwt.verify(token, 'thisismynewcourse');
//   console.log(data);
// }

// myFunction();

// const Task = require('./models/task');
// const User = require('./models/user');

// const main = async () => {
//   const task = await Task.findById('6005c47d7d2be80458fbfffb');
//   await task.populate('owner').execPopulate();
//   console.log(task.owner);

//   const user = await User.findById('6005c39e6816cd2b88b471a1');
//   await user.populate('tasks').execPopulate();
//   console.log(user.tasks);
// }

// main();