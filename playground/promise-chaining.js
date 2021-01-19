require('../src/db/mongoose');
const { count } = require('../src/models/user');
const User = require('../src/models/user');

// User.findByIdAndUpdate('5fff58f54daa11494c20bf4c', { age: 1 }).then((user) => {
//   console.log(user);
//   return User.countDocuments({ age: 1 });
// }).then((result) => {
//   console.log(result)
// }).catch((e) => {
//   console.log(e)
// });

const updateAgeAndCount = async (id, age) => {
  const user = await User.findByIdAndUpdate((id), { age });
  const count = await User.countDocuments({ age });
  return count;
}

updateAgeAndCount('5fff58f54daa11494c20bf4c', 2).then((count) => {
  console.log(count);
}).catch((e) => {
  console.log(e);
});