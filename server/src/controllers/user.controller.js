const catchAsync = require("../utils/catchAsync");
const messages = require("../messages.json");

// imports.
const userService = require("../services/user.service");

// Get a user details by token.
const getAnUserDetails = catchAsync(async (req, res) => {
  const user = await userService.getAnUserDetails(req.user);

  if (user) {
    return res.status(200).send({
      serverResponse: {
        code: 200,
        message: messages.USER_FOUND,
      },
      result: {
        data: user,
      },
    });
  } else {
    return res.status(200).send({
      serverResponse: {
        code: 404,
        message: messages.USER_NOT_FOUND,
      },
    });
  }
});

module.exports = {
  getAnUserDetails,
};
