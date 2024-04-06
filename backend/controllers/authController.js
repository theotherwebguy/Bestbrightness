const { default: mongoose } = require("mongoose");

const User = require('./models/User')
// const User = mongoose.model('UserInfo')

const registerUser = async (req, res) => {


    try {
        const { username, password } = req.body;

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const newUser = new User({ username, password });
        await newUser.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error signing up:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { registerUser };