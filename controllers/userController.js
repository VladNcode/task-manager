const User = require('../model/userModel');

exports.createUser = async (userName, userAge) => {
  const user = await User.create({ name: userName, age: userAge });
  console.log(user);
};
