// const Course = require("../models/Course.model");
// const User = require("../models/User.model");
// const router = require("express").Router();
// const {
//   isAuthenticated,
//   isTeacher,
// } = require("../middlewares/route-guard.middleware");

// // /api/courses

// // GET all courses of this teacher
// router.get("/", isAuthenticated, async (req, res) => {
//   try {
//     const allCourses = await User.find({ teacher: req.tokenPayload.userId });

//     if (!allCourses.length) {
//       console.log("There is no course to show");
//     }
//     res.status(200).json(allCourses);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json(error);
//   }
// });

// // Route to get all courses for a specific student
// router.get("/users/:userId/courses", isAuthenticated, async (req, res) => {
//   try {
//     const studentId = req.params.userId;

//     // Find the student to verify existence
//     const student = await User.findById(studentId);
//     if (!student) {
//       return res.status(404).send("Student not found");
//     }

//     // Find all courses that the student is enrolled in
//     const courses = await Course.find({ studentList: userId }).populate(
//       "studentList",
//       "firstName lastName"
//     );

//     res.json(courses);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// module.exports = router;


