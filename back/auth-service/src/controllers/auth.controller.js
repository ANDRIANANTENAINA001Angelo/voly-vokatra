const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const { generateToken } = require('../services/auth.service');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const password_hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password_hash });
    const token = generateToken(user);
    res.status(201).json({ token, user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }
    const token = generateToken(user);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.logout = async (req, res) => {
  res.status(200).json({ message: 'Déconnecté avec succès (client side)' });
};

exports.me = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password_hash');
  res.json(user);
};

exports.updateProfile = async (req, res) => {
  const { name, culture_ids, location_ids} = req.body;
  const updated = await User.findByIdAndUpdate(
    req.user.id,
    { name, culture_ids, location_ids },
    { new: true }
  ).select('-password_hash');
  res.json(updated);
};

exports.getAllUsers = async (req,res)=>{
  const users = await User.find({});
  res.status(200).json(users)
}

