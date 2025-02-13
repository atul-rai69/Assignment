// Required modules
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const User= require('./models/User');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("connected to database successfully"))
.catch((err) => console.log(err));


app.post('/register', async (req, res) => {
    try {
        const { username, email, password, fullName, gender, dob, country } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword, fullName, gender, dob, country });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/user', async (req, res) => {
    try {
        const { query } = req.query;
        const user = await User.findOne({
            $or: [ { username: query }, { email: query } ]
        }).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start Server
const PORT =  5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
