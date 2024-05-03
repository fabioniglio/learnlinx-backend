const Course = require("../models/Course.model");
const User = require("../models/User.model");
const router = require("express").Router();
const {
  isAuthenticated,
  isTeacher,
} = require("../middlewares/route-guard.middleware");

// /api/users

// GET all users of this teacher
router.get("/", (req, res) => {
  res.json("All good in user");
});

// GET all users
// router.get("/", isAuthenticated,isTeacher, async (req, res) => {
//   try {
//     const user = await User.findById(req.tokenPayload.userId);

//     if (user.isTeacher) {
//       const allCourses = await User.find({
//         teacher: req.tokenPayload.userId,
//       });

//       if (!allCourses.length) {
//         console.log("There is no course to show");
//       }
//       res.status(200).json(allCourses);
//     } else {
//       const allCourses = await Course.find({
//         studentList: req.tokenPayload.userId,
//       });
//       if (!allCourses.length) {
//         console.log("There is no course to show");
//       }
//       res.status(200).json(allCourses);
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).json(error);
//   }
// });

// GET  /api/users/:userId  - show detailes of one user
router.get("/:userId", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

//PUT /api/users/:userId - Update a specific user by id
router.put("/:userId", isAuthenticated, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      req.body,
      {
        new: true,
      }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error while updating user ->", error);
    res.status(500).json({ message: "Error while updating a single user" });
  }
});

//DELETE /api/users/:userId - Delete a specific user by id
router.delete("/:userId", isAuthenticated, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(204).send();
  } catch (error) {
    console.error("Error while deleting a user ->", error);
    res.status(500).json({ message: "Error while deleting a single user" });
  }
});

module.exports = router;
