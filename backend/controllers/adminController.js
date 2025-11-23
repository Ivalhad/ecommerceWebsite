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

module.exports = { authAdmin };