//middleware is a function which has access to req and res
//when we hit an endpoint we can fire of middleware and we can check if we have any token in the header

const jwt = require("jsonwebtoken");
const config = require("../config/default.json");

//when we have a middleware, we can do what we want and then we hace to call the next function which says move on to next middleware
module.exports = function (req, res, next) {
  //getting token from header
  const token = req.header("x-auth-token");

  //check if token doesnot exists
  if (!token) {
    return res
      .status(401)
      .json({ msg: "There is no token, Authorization is denied" });
  }
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    //assign the user and pull out the payload
    // console.log(decoded);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.json(err);
  }
};
