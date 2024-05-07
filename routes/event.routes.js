const Event = require("../models/Event.model"); // Assuming Event model is in the same directory as Course model
const router = require("express").Router();
const {
  isAuthenticated,
  isTeacher,
} = require("../middlewares/route-guard.middleware");
const fileUploader = require("../config/cloudinary.config");

// GET all events
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const allEvents = await Event.find();
    res.status(200).json(allEvents);
  } catch (error) {
    console.error("Error retrieving events:", error);
    res.status(500).json(error);
  }
});

// GET events by date
router.get("/events/:date", isAuthenticated, async (req, res) => {
  const { date } = req.params;
  try {
    const eventsOnDate = await Event.find({ date });
    res.status(200).json(eventsOnDate);
  } catch (error) {
    console.error("Error retrieving events on specific date:", error);
    res.status(500).json(error);
  }
});

// GET one event by ID
router.get("/:eventId", isAuthenticated, async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    res.status(200).json(event);
  } catch (error) {
    console.error("Error finding event:", error);
    res.status(500).json(error);
  }
});

// POST one event - create a new event
router.post("/", isAuthenticated, isTeacher, async (req, res) => {
  const newEventPayload = req.body;
  try {
    const newEvent = await Event.create(newEventPayload);
    res.status(201).json(newEvent);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json(error);
  }
});

// PUT - Update an existing event
router.put("/:eventId", isAuthenticated, isTeacher, async (req, res) => {
  const { eventId } = req.params;
  try {
    const updatedEvent = await Event.findByIdAndUpdate(eventId, req.body, { new: true });
    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json(error);
  }
});

// DELETE an event
router.delete("/:eventId", isAuthenticated, isTeacher, async (req, res) => {
  const { eventId } = req.params;
  try {
    await Event.findByIdAndDelete(eventId);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json(error);
  }
});

module.exports = router;
