import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/userModel.js';
import { userSchema } from '../validators/userValidator.js';

// Login logic
export const login = async (req, res,next) => {
  try {
    const { username, password } = req.body;

    // Validate input
    const { error } = userSchema.validate({ username, password });
    if (error) return res.status(400).json({ message: error.details[0].message });

    // Find user by email
    const user = await UserModel.findOne({ email: username });
    if (!user) return res.status(400).json({ message: 'Invalid username or password' });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid username or password' });

    // Generate token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: error.message });
    next(error)
  }
};

// Profile update logic
export const completeProfile = async (req, res, next) => {
  try {
    req.body
    // Role-based profile update logic here (use Joi validation and update database)
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    next(error)
    res.status(500).json({ message: error.message });
    
  }
};
