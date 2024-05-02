const Course = require("../models/Course.model");
const User = require("../models/User.model");
const router = require("express").Router();
const {
  isAuthenticated,
  isTeacher,
} = require("../middlewares/route-guard.middleware");

// /api/courses

// GET all courses of this teacher
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const allCourses = await User.find({ teacher: req.tokenPayload.userId });

    if (!allCourses.length) {
      console.log("There is no course to show");
    }
    res.status(200).json(allCourses);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});



module.exports = router
