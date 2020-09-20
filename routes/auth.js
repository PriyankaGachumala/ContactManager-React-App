const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/default.json");
//when we wnat to protect routes, bring in the middleware
const auth = require("../middleware/auth");
const User = require("../models/User");
const { validationResult, check } = require("express-validator");

//@route        GET "/api/auth"
//@desc         Get logged user
//@access       Private
router.get("/", auth, async (req, res) => {
  try {
    // console.log(req.user.id);
    User.findById(req.user.id, function (err, user) {
      if (err) {
        res.status(400).send({ msg: "Invalid token" });
      } else {
        // console.log(user);
        res.json(user);
      }
    }).select("-password");
  } catch (err) {
    console.error(err.message);
    res.send(err);
  }
});

//@route        POST "/api/auth"
//@desc         authenticate user and get token
//@access       public
router.post(
  "/",
  [
    check("email", "Please enter valid email ID").isEmail(),
    check("password", "Please enter password").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: "Invalid Credentials" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid Credentials" });
      }
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.jwtSecret,
        {
          expiresIn: 40000,
        },
        (err, token) => {
          if (err) {
            throw err;
          }
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
