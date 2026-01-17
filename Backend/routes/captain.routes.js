const captainController = require("../controllers/captain.controller");
const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invalid email address"),
    body("fullName.firstname").isLength({ min: 3 }).withMessage("First name must be at least 3 characters long"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    body("vehicle.color").isLength({ min: 3 }).withMessage("Vehicle color must be at least 3 characters long"),
    body("vehicle.plate").isLength({ min: 3 }).withMessage("Vehicle plate must be at least 3 characters long"),
    body("vehicle.capacity").isInt({ min: 1 }).withMessage("Vehicle capacity must be at least 1"),
    body("vehicle.vehicleType").isIn(["car", "motorcycle", "auto"]).withMessage("Invalid vehicle type"),
  ],
  captainController.registerCaptain,
);

module.exports = router;
