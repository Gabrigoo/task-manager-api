require('../src/db/mongoose');
const Task = require('../src/models/task');

Task.findByIdAndDelete('5ffef22a51880322bca7f5d1').then((task) => {
  console.log(task);
  return Task.countDocuments({ completed: false });
}).then((result) => {
  console.log(result)
}).catch((e) => {
  console.log(e)
});

const deleteTaskAndCount = async (id) => {
  await Task.findByIdAndDelete(id);
  const count = await Task.countDocuments({ completed: false });
  return count;
};

deleteTaskAndCount('5fff54b366385333c07c9644').then((count) => {
  console.log(count);
}).catch((e) => {
  console.log(e);
})