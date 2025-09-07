const { StreamChat } = require('stream-chat');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

require('dotenv').config();

const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STREAM_API_SECRET;
const app_id = process.env.STREAM_APP_ID || process.env.STREAM_API_ID;

const signup = async (req, res) => {
    try {
        const { fullName, username, password, phoneNumber } = req.body;
        const userId = crypto.randomBytes(16).toString('hex');
        
        // Initialize server client
        const serverClient = StreamChat.getInstance(api_key, api_secret);
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create user in Stream Chat with custom fields
        await serverClient.upsertUser({
            id: userId,
            name: fullName,
            username: username,
            phoneNumber: phoneNumber,
            hashedPassword: hashedPassword, // Store hashed password as custom field
            role: 'user'
        });
        
        const token = serverClient.createToken(userId);

        res.status(200).json({ 
            token, 
            fullName, 
            username, 
            userId, 
            phoneNumber 
        });
    } catch (error) {
        console.log('Signup error:', error);
        res.status(500).json({ message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Initialize server client
        const serverClient = StreamChat.getInstance(api_key, api_secret);
        
        // Query users including custom fields - use the correct field name
        const response = await serverClient.queryUsers(
            { username: username }, // Query by username
            { 'hashedPassword': 1 } // Include the custom field
        );
        
        console.log('Query response:', response); // Debug log
        
        if (!response.users || response.users.length === 0) {
            return res.status(400).json({ message: 'User not found' });
        }
        
        const user = response.users[0];
        
        // Check if hashedPassword custom field exists
        if (!user.hashedPassword) {
            console.log('User found but no hashedPassword field:', user);
            return res.status(400).json({ message: 'Password not set for user' });
        }
        
        // Compare passwords
        const success = await bcrypt.compare(password, user.hashedPassword);
        const token = serverClient.createToken(user.id);

        if (success) {
            res.status(200).json({ 
                token, 
                fullName: user.name, 
                username: user.username, 
                userId: user.id,
                phoneNumber: user.phoneNumber
            });
        } else {
            res.status(401).json({ message: 'Incorrect password' });
        }
    } catch (error) {
        console.log('Login error:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { signup, login };