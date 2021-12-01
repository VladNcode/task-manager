const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const { sendWelcomeEmail } = require('../utils/email');

/////////////////////////////////////////////////
//! MULTER AVATAR UPLOAD

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    return cb(null, true);
  }

  cb(new AppError('Not an image, please upload only images!', 400), false);
};

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'public/img/avatars/');
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = `${Date.now() + '-' + Math.round(Math.random() * 1e9)}.jpg`;
//     cb(null, file.fieldname + '-' + uniqueSuffix);
//   },
// });

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter: multerFilter,
  limits: { fileSize: 500000 },
});

exports.uploadMult = upload.single('avatar');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/avatars/${req.file.filename}`);

  next();
});

/////////////////////////////////////////////////

exports.createUser = catchAsync(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    age: req.body.age,
    email: req.body.email,
    password: req.body.password,
  });

  sendWelcomeEmail(req.body.email, req.body.name);

  res.status(201).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'age', 'avatar'];
  const isValidOperation = updates.every(item => allowedUpdates.includes(item));
  if (!isValidOperation)
    return next(
      new AppError(
        `You can only update: '${[...allowedUpdates]
          .join(',')
          .replace(/,/g, ', ')
          .toUpperCase()}' fields by using this route! Please exclude everything else if you want to proceed`,
        400
      )
    );

  if (Object.keys(req.body).length === 0) {
    next(new AppError('Provide some data to update.', 400));
  }

  if (req.file) req.body.avatar = req.file.filename;

  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: user,
    },
  });
});

exports.getUser = factory.getOne(User);
exports.deleteUser = factory.deleteOne(User);
exports.getAllUsers = factory.getAll(User);
