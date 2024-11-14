import mongoose from 'mongoose';
import User from './userModel.js';

// Parent Schema extends User Schema
const parentSchema = new mongoose.Schema({
  ward: { type: String, required: true },
  class: { type: String, required: true },
 
});

const Parent = User.discriminator('Parent', parentSchema);

export default Parent;
