const User = require("../models/User.model");
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
  isAuthenticated,
  isTeacher,
} = require("../middlewares/route-guard.middleware");

router.get("/", (req, res) => {
  res.json("All good in auth");
});

// POST to signup
router.post("/signup", async (req, res) => {
  const {
    email,
    password,
    firstName,
    lastName,
    profilePictureUrl,
    phoneNumber,
    courseId,
    isTeacher,
  } = req.body;

  // Basic validation for empty fields
  if (!email || !password || !firstName || !lastName) {
    return res
      .status(400)
      .json({ message: "Provide email, password, and name" });
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Provide a valid email address." });
  }

  // Password complexity validation
  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        "Password must have at least 6 characters and include at least one number, one lowercase and one uppercase letter.",
    });
  }

  // Check for duplicate email
  try {
    const foundUser = await User.findOne({ email });
    if (foundUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Hash password and create user if email is not found
    const salt = bcrypt.genSaltSync(13);
    const passwordHash = bcrypt.hashSync(password, salt);

    const newUser = await User.create({
      email,
      passwordHash,
      firstName,
      lastName,
      profilePictureUrl,
      phoneNumber,
      courseId,
      isTeacher,
    });

    res
      .status(201)
      .json({ message: "User created successfully.", userId: newUser._id });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error during signup" });
  }
});

//POST to login
router.post("/login", async (req, res) => {
  //Get back the credentials from the body
  //Check if we have a user with this username
  try {
    const potentialUser = await User.findOne({ email: req.body.email });
    if (potentialUser) {
      //Check if the password is correct
      if (bcrypt.compareSync(req.body.password, potentialUser.passwordHash)) {
        //User has the right credentials

        const authToken = jwt.sign(
          {
            userId: potentialUser._id,
          },
          process.env.TOKEN_SECRET,
          {
            algorithm: "HS256",
            expiresIn: "6h",
          }
        );
        console.log(potentialUser.isTeacher);
        res.status(200).json({
          message: `Welcome back ${potentialUser.firstName}`,
          token: authToken,
          isTeacher: potentialUser.isTeacher,
        });
      } else {
        res.status(400).json({ message: "Incorrect password" });
      }
    } else {
      res.status(400).json({ message: "There is no user with this email" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "There is a problem here" });
  }
});

//GET to verify
router.get("/verify", isAuthenticated, async (req, res) => {
  try {
    // Assuming req.tokenPayload.userId contains the user's ID
    const user = await User.findById(req.tokenPayload.userId);
    if (!user) throw new Error("User not found");

    res.json({
      message: "Verified user details",
      userId: user._id,
      email: user.email,
      isTeacher: user.isTeacher,
      data: req.tokenPayload,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
