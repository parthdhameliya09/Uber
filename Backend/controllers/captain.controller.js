const captainModel = require("../models/captain.model");
const captainService = require("../services/captain.service");
const { validationResult } = require("express-validator");

module.exports.registerCaptain = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullName, email, password, vehicle } = req.body;

  const isCaptainAlreadyExist = await captainModel.findOne({ email });
  
  if (isCaptainAlreadyExist) {
    return res.status(400).json({ message: "Captain with this email already exists" });
  }

  const hashPassword = await captainModel.hashPassword(password);

  const captain = await captainService.createCaptain({
    firstname: fullName.firstname,
    lastname: fullName.lastname,
    email,
    password: hashPassword,
    color: vehicle.color,
    plate: vehicle.plate,
    capacity: vehicle.capacity,
    vehicleType: vehicle.vehicleType
  });

    const token = captain.generateAuthToken();

    res.status(201).json({ token, captain });
};
