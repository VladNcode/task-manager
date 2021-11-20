const Kitten = require('../model/kittenModel');

exports.createKitten = async kittenName => {
  const kitten = await Kitten.create({ name: kittenName });
  console.log(kitten);
};

exports.deleteKitten = async kittenName => {
  const kitten = await Kitten.deleteOne({ name: kittenName });
  console.log(kitten);
};

exports.updateKitten = async (kittenName, newName) => {
  const kitten = await Kitten.findOneAndUpdate(
    { name: kittenName },
    { $set: { name: newName } },
    {
      new: true,
      runValidators: true,
    }
  );
  console.log(kitten);
};
