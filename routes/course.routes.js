const Course = require("../models/Course.model");
const User = require("../models/User.model");
const router = require("express").Router();
const {
  isAuthenticated,
  isTeacher,
} = require("../middlewares/route-guard.middleware");
const fileUploader = require("../config/cloudinary.config");

// /api/courses

// GET all courses
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.tokenPayload.userId);
    if (user.isTeacher) {
      const allCourses = await Course.find({
        teacher: req.tokenPayload.userId,
      })
        .populate("studentList")
        .populate("teacher");

      if (!allCourses.length) {
        console.log("There is no course to show");
      }
      res.status(200).json(allCourses);
    } else {
      const allCourses = await Course.find({
        studentList: req.tokenPayload.userId,
      })
        .populate("studentList")
        .populate("teacher");

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

  try {
    const user = await User.findById(req.tokenPayload.userId);

    if (user.isTeacher) {
      allCourses = await Course.find({
        teacher: user._id,
        endDate: { $gte: currentDate },
        startDate: { $lte: currentDate },
      })
        .populate("studentList")
        .populate("teacher");
    } else {
      allCourses = await Course.find({
        studentList: req.tokenPayload.userId,
        endDate: { $gte: currentDate },
        startDate: { $lte: currentDate },
      })
        .populate("studentList")
        .populate("teacher");
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

//Get the upcoming courses
router.get("/upcoming-courses", isAuthenticated, async (req, res) => {
  let allCourses;
  const currentDate = new Date();
  // try {
  //   const user = await User.findById(req.tokenPayload.userId);

  //   console.log(user);

  //   if (user.isTeacher) {
  //     console.log(user);
  //     allCourses = await Course.find({
  //       teacher: user._id,
  //       startDate: { $gt: currentDate },
  //     });
  //   } else {
  //     allCourses = await Course.find({
  //       studentList: req.tokenPayload.userId,
  //       startDate: { $gt: currentDate },
  //     }).populate("studentList").populate("teacher");
  //   }
  //   if (!allCourses.length) {
  //     console.log("There are no current courses for this user");
  //   }
  //   res.status(200).json(allCourses);
  // } catch (error) {
  //   console.log(error);
  //   res.status(500).json(error);
  // }
  try {
    allCourses = await Course.find({
      startDate: { $gt: currentDate },
    });

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
    const course = await Course.findById(req.params.courseId)
      .populate("studentList")
      .populate("teacher");
    res.status(200).json(course);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// POST one course - create a new course
router.post(
  "/",
  isAuthenticated,
  isTeacher,
  fileUploader.single("imageUrl"),
  async (req, res) => {
    if (req.file) {
      req.body.profilePictureUrl = req.file.path;
    }
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
  }
);

//PUT /api/courses/:courseId - Updates a specific course by id
router.put(
  "/:courseId",
  isAuthenticated,
  isTeacher,
  fileUploader.single("imageUrl"),
  async (req, res) => {
    try {
      const { studentId } = req.body;
      console.log(studentId);
      if (req.file) {
        req.body.coursePictureUrl = req.file.path;
      }
      const course = await Course.findById(req.params.courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      if (course.teacher.toHexString() !== req.tokenPayload.userId) {
        return res.status(403).json({
          message: "You do not have permission to update this course",
        });
      }

      if (studentId) {
        const updatedCourse = await Course.findByIdAndUpdate(
          req.params.courseId,
          { $addToSet: { studentList: studentId } }, // Use $addToSet to avoid duplicate entries
          { new: true }
        ).populate("studentList"); // Optionally populate the studentList to return detailed info
        console.log(" updatedCourse: ", updatedCourse);
        res.status(200).json(updatedCourse);
      } else {
        // No studentId provided, just update other fields
        const updatedCourse = await Course.findByIdAndUpdate(
          req.params.courseId,
          req.body,
          { new: true }
        );
        res.status(200).json(updatedCourse);
      }

      // if (course.teacher.toHexString() === req.tokenPayload.userId) {
      //   const updatedCourse = await Course.findByIdAndUpdate(
      //     req.params.courseId,
      //     req.body,
      //     {
      //       new: true,
      //     }
      //   );
      //   console.log(" updatedCourse: ", updatedCourse);
      //   res.status(200).json(updatedCourse);
      // } else {
      //   console.log("You don't have permission to update this course.");
      //   res.status(500).json({
      //     message: "You don't have permission to update this course.",
      //   });
      // }
    } catch (error) {
      console.error("Error while updating course ->", error);
      res.status(500).json({ message: "Error while updating a single course" });
    }
  }
);

//DELETE /api/courses/:courseId - Delete a specific course by id
router.delete("/:courseId", isAuthenticated, isTeacher, async (req, res) => {
  try {
    const user = await User.findOne({ courseId: req.params.courseId });
    if (user._id.toHexString() === req.tokenPayload.userId) {
      await Course.findByIdAndDelete(req.params.courseId);

      res.status(204).send();
    } else {
      console.log("You don't have permission to delete this course.");
      res
        .status(500)
        .json({ message: "You don't have permission to delete this course." });
    }
  } catch (error) {
    console.error("Error while deleting course ->", error);
    res.status(500).json({ message: "Error while deleting a single course" });
  }
});

module.exports = router;
