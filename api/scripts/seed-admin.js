require('dotenv').config();

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const userModel = require('../src/modles/user');

const saltRounds = 10;

const cleanName = (value, fallback) => {
  const name = String(value || fallback || 'Admin')
    .replace(/[^a-zA-Z0-9 -]/g, '')
    .trim()
    .slice(0, 30);

  return name.length >= 2 ? name : 'Admin';
};

const getMongoUri = () => {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is required.');

  return process.env.MONGODB_URI;
};

const seedAdmin = async () => {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const fallbackName = email?.split('@')[0];
  const name = cleanName(process.env.ADMIN_NAME, fallbackName);

  if (!email) throw new Error('ADMIN_EMAIL is required.');
  if (!password) throw new Error('ADMIN_PASSWORD is required.');

  await mongoose.connect(getMongoUri());

  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const existingAdmin = await userModel.findOne({ email, role_type: 'admin', deleted_at: null });
  const now = new Date();

  if (existingAdmin) {
    await userModel.updateOne(
      { _id: existingAdmin._id },
      {
        $set: {
          name,
          password: hashedPassword,
          status: true,
          updated_at: now
        }
      },
      { runValidators: false }
    );
    console.log(`Admin updated: ${email}`);
  } else {
    await userModel.collection.insertOne({
      name,
      email,
      password: hashedPassword,
      role_type: 'admin',
      status: true,
      image: '',
      mobile_number: '',
      Gender: '',
      Address: '',
      created_at: now,
      updated_at: now,
      deleted_at: null,
      resetPasswordToken: '',
      resetPasswordExpires: null
    });
    console.log(`Admin created: ${email}`);
  }
};

seedAdmin()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
