const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');

//login admin
const authAdmin = async (req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne ({ email });
    //cek admin ada atau engga
    if (user && (await user.matchPassword(password)) && user.role === 'admin') {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        })
    } else {
        res.status(401).json({message: 'Invalid email or password'});
    }
}

//admin profile
const getAdminProfile = async (req, res) => {

    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phoneNumber: user.phoneNumber,
        });
    } else {
        res.status(404).json({ message: 'Admin not found' });
    }
};

//admmin update
const updateAdminProfile = async (req, res) => {
  
  const user = await User.findById(req.user._id);

  if (user) {
    // update data jika ada input baru
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phoneNumber = req.body.phoneNumber || user.phoneNumber;

    // cek admmin mengirim password baru
    if (req.body.password) {
      user.password = req.body.password; 
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      phoneNumber: updatedUser.phoneNumber,
      //kirim token baru
      token: generateToken(updatedUser._id), 
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

//admin logout
const logoutAdmin = (req, res) => {

  
  res.status(200).json({ message: 'Admin logged out successfully' });
};


module.exports = { authAdmin, getAdminProfile, updateAdminProfile, logoutAdmin};