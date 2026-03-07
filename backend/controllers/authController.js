const User = require('../models/User');
const Service = require('../models/Service');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const generateToken = (id, email, role) => {
  return jwt.sign({ id, email, role }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password, university } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "This email address is already in use." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      university
    });

    res.status(201).json({
      message: "You have registered successfully.",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        university: newUser.university,
        role: newUser.role,
      },
      token: generateToken(newUser._id, newUser.email, newUser.role)
    });

  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No user found with this email address." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password." });
    }

    res.status(200).json({
      message: "You have logged in successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        university: user.university,
        role: user.role
      },
      token: generateToken(user._id, user.email, user.role)
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      res.status(200).json({
        id: user._id,
        name: user.name,
        email: user.email,
        university: user.university,
        role: user.role
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.university = req.body.university || user.university;

      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
      }

      const updatedUser = await user.save();
      res.status(200).json({
        message: "Profile updated successfully!",
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          university: updatedUser.university
        }
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteUserProfile = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    if (!userId) {
      return res.status(400).json({ message: "User ID not found." });
    }

    const deleteResult = await Service.deleteMany({ seller: userId });
    console.log(`Deleted Gigs count: ${deleteResult.deletedCount}`);

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User profile not found." });
    }

    res.status(200).json({ 
      message: "Account and all listed gigs deleted successfully! ✅",
      deletedGigsCount: deleteResult.deletedCount
    });

  } catch (error) {
    console.error("Delete Account Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  updateUserProfile, 
  deleteUserProfile 
};