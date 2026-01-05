
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI);

const User = require('./schema.js');

(async () => {
  await User.updateMany(
    { money: { $exists: false } },
    { $set: { money: 10 } }
  );
  console.log('Update succes');
  process.exit();
})();