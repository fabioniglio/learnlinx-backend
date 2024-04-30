const User = require("../models/User.model");
const router = require("express").Router();
const bcrypt = require('bcryptjs')


router.get("/", (req, res) => {
  res.json("All good in auth");
});

//POST to signup
router.post("/signup", async(req,res)=>{
     
    const {
        email,
        password,
        firstName,
        lastName,
        profilePictureUrl,
        phoneNumber,
        courseId,
        isTeacher
    } = req.body
    console.log(req.body)

    if (
        !email ||
        !password ||
        !firstName ||
        !lastName ||
        email === "" ||
        password === "" ||
        firstName === "" ||
        lastName === ""
      ) {
        res.status(400).json({ message: "Provide email, password and name" });
        return;
      }
    
      // Use regex to validate the email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({ message: "Provide a valid email address." });
        return;
      }
    
      // Use regex to validate the password format
      const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
      if (!passwordRegex.test(password)) {
        res.status(400).json({
          message:
            "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
        });
        return;
      }
    
      // Check the users collection if a user with the same email already exists
    //   User.findOne({ email })
    //     .then((foundUser) => {
    //       // If the user with the same email already exists, send an error response
    //       if (foundUser) {
    //         res.status(400).json({ message: "User already exists." });
    //         return;
    //       }
    async function findUserByEmail(email, res) {
        try {
            const foundUser = await User.findOne({ email });
            
            if (foundUser) {
                res.status(400).json({ message: "User already exists." });
                return;
            }
    
            // Continue with further processing if no user is found
            // For example, creating a new user
            // await User.create({ email, ...otherData });
            // res.status(201).json({ message: "User created successfully." });
    
        } catch (error) {
            // Handle potential errors, such as database connection issues
            res.status(500).json({ message: "Server error" });
        }
    }
    

    const salt = bcrypt.genSaltSync(13)
    const passwordHash =  bcrypt.hashSync(req.body.password,salt)

    try {
        const newUser = await User.create({
            email: req.body.email,
            passwordHash: passwordHash,
            firstName: req.body.firstName,
            lastName:req.body.lastName,
            profilePictureUrl:req.body.profilePictureUrl,
            phoneNumber:req.body.phoneNumber,
            courseId:req.body.courseId,
            isTeacher:req.body.isTeacher
        })
        res.status(201).json(newUser)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
        
    }

})


//POST to login

//GET to verify

module.exports = router;
