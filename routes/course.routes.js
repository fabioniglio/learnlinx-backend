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
    const user = await User.findById(req.tokenPayload.userId);
    console.log("tokenPayload: ", req.tokenPayload);
    if (user.isTeacher) {
      console.log("A teacher");
      const allCourses = await Course.find({
        teacher: req.tokenPayload.userId,
      });

      if (!allCourses.length) {
        console.log("There is no course to show");
      }
      res.status(200).json(allCourses);
    } else {
      const allCourses = await Course.find({
        studentList: req.tokenPayload.userId,
      });
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

//Get the current courses
router.get("/current-courses", isAuthenticated, async (req, res) => {
  let allCourses;
  const currentDate = new Date();
  console.log("currentDate:", currentDate);
  try {
    const user = await User.findById(req.tokenPayload.userId);
    console.log(user);

    if (user.isTeacher) {
      console.log(user);
      allCourses = await Course.find({
        teacher: user._id,
        endDate: { $gte: currentDate },
        startDate: { $lte: currentDate },
      });
    } else {
      allCourses = await Course.find({
        studentList: req.tokenPayload.userId,
        endDate: { $gte: currentDate },
        startDate: { $lte: currentDate },
      });
    }
    if (!allCourses.length) {
      console.log("There are no current courses for this user");
    }
    res.status(200).json(allCourses);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

//Get the upcomming courses
router.get("/current-courses", isAuthenticated, async (req, res) => {
  let allCourses;
  const currentDate = new Date();
  console.log("currentDate:", currentDate);
  try {
    const user = await User.findById(req.tokenPayload.userId);
    console.log(user);

    if (user.isTeacher) {
      console.log(user);
      allCourses = await Course.find({
        teacher: user._id,
        startDate: { $gt: currentDate },
      });
    } else {
      allCourses = await Course.find({
        studentList: req.tokenPayload.userId,
        startDate: { $gt: currentDate },
      });
    }
    if (!allCourses.length) {
      console.log("There are no current courses for this user");
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
    const user = await User.findById(req.tokenPayload.userId);
    const newCourse = await Course.create(newCoursePayload);
    user.courseId.push(newCourse._id);
    await user.save();

    res.status(201).json(newCourse);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

//PUT /api/courses/:courseId - Updates a specific course by id
router.put("/:courseId",isAuthenticated, isTeacher, async (req, res) => {
  try {
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.courseId,
      req.body
    );
    res.status(200).json(updatedCourse);
  } catch (error) {
    console.error("Error while updating course ->", error);
    res.status(500).json({ message: "Error while updating a single course" });
  }
});

//DELETE /api/courses/:courseId - Delete a specific course by id
router.delete("/:courseId", isAuthenticated, isTeacher, async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.courseId);

    res.status(204).send();
  } catch (error) {
    console.error("Error while deleting student ->", error);
    res.status(500).json({ message: "Error while deleting a single student" });
  }
});

module.exports = router;

