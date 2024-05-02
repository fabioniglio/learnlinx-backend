const Course = require("../models/Course.model");
const User = require("../models/User.model");
const router = require("express").Router();
const {
  isAuthenticated,
  isTeacher,
} = require("../middlewares/route-guard.middleware");

// /api/courses

// GET all courses
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const user= await User.findById(req.tokenPayload.userId)
    console.log(user)
    if(user.isTeacher){
      console.log("A teacher")
       const allCourses = await Course.find({ teacher: req.tokenPayload.userId });

       if (!allCourses.length) {
      console.log("There is no course to show");
    }
    res.status(200).json(allCourses);
    }
    else{
      const allCourses = await Course.find({ studentList: req.tokenPayload.userId });
      if (!allCourses.length) {
        console.log("There is no course to show");
      }
      res.status(200).json(allCourses);
    }
    
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});



router.get("/current-courses", isAuthenticated, async (req, res) => {
  try {
    const allCourses = await Course.find({ teacher: req.tokenPayload.userId });

    if (!allCourses.length) {
      console.log("There is no course for this teacher");
    }
    res.status(200).json(allCourses);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});
// GET one course
router.get("/:courseId", async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    res.status(200).json(course);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// POST one course
router.post("/", isAuthenticated, isTeacher, async (req, res) => {
  const newCoursePayload = req.body;
  newCoursePayload.teacher = req.tokenPayload.userId;

  try {
    const newCourse = await Course.create(newCoursePayload);
    res.status(201).json(newCourse);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = router;
