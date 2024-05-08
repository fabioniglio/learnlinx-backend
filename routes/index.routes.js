const router = require('express').Router()


router.get('/', (req, res) => {
  res.json('All good in here')
})

const courseRoutes = require("./course.routes")
router.use("/courses",courseRoutes)

const userRoutes = require("./user.routes")
router.use("/users",userRoutes)

const eventRoutes = require("./event.routes")
router.use("/events",eventRoutes)

module.exports = router
