const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const User = require("../models/user");
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcryptjs");

router.post(
  "/",
  [
    check("name", "name is required").not().isEmpty(),
    check("email", "Invalid email").isEmail(),
    check("password", "password must be at least 6 character").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    try {
      //email exist database
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: "user already exist" });
      }
      //avatar associated with email
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });
      //instance user
      user = new User({
        name,
        email,
        password,
        avatar,
      });
      //decrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      //use save in database
      await user.save();
      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 50000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Eroor" });
    }
    //token id
  }
);

module.exports = router;
