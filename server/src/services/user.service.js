// imports.
const UserModel = require('../models/user.model')

const getAnUserDetails = async (reqUser) => {
  return await UserModel.findById(reqUser._id);
};

module.exports = {
  getAnUserDetails,
};
