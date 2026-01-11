
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI);

const User = require('./schema.js');


(async () => {
  /*
  await User.updateMany(
    { money: { $exists: false } },
    { $set: { money: 10 } }
  );

  await User.updateMany(
    { lastUsernameChange: { $exists: false } },
    { $set: { lastUsernameChange: new Date() } }
  );
  */

  await User.updateMany(
    {profilePic: { $exists: false } },
    { $set: { profilePic: 0 } }
  )
  
  console.log('Update succes');
  process.exit();
})();


