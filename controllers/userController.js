const User = require('../model/userModel');

exports.createUser = async (userName, userAge, userEmail, userPassword) => {
  const user = await User.create({
    name: userName,
    age: userAge,
    email: userEmail,
    password: userPassword,
  });
  console.log(user);
};
