import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const getSecret = () => process.env.JWT_SECRET || 'vyaparflow_super_secret_dev_key';

/**
 * Controller handling new user registration.
 */
export const signupUser = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Basic validation
    if (!email || !password || !name) {
      return res.status(400).json({ success: false, error: 'Name, email, and password are required.' });
    }

    // Prevent duplicate registrations
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'An account with this email already exists.' });
    }

    // Securely hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });
    
    await newUser.save();

    // Issue the first session token
    const token = jwt.sign({ id: newUser._id, email: newUser.email }, getSecret(), { expiresIn: '1d' });

    res.status(201).json({
      success: true,
      token,
      user: { 
        id: newUser._id, 
        name: newUser.name, 
        email: newUser.email,
        isOnboarded: false, // New users must complete onboarding
        businessType: 'freelancer'
      }
    });
  } catch (error) {
    console.error('Signup Registration Error:', error);
    res.status(500).json({ success: false, error: 'An internal server error occurred during registration.' });
  }
};

/**
 * Controller handling user authentication.
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid authentication credentials.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, error: 'Invalid authentication credentials.' });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, getSecret(), { expiresIn: '1d' });

    res.json({
      success: true,
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        isOnboarded: user.isOnboarded,
        businessName: user.businessName,
        businessAddress: user.businessAddress,
        businessType: user.businessType,
        bankDetails: user.bankDetails,
        upiId: user.upiId
      }
    });
  } catch (error) {
    console.error('Login Authentication Error:', error);
    res.status(500).json({ success: false, error: 'An internal server error occurred during login.' });
  }
};

/**
 * Controller handling the initial onboarding profile setup.
 */
export const updateProfile = async (req, res) => {
  const { businessName, businessAddress, businessType, upiId, bankDetails } = req.body;
  
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User profile not found.' });
    }

    // Update user profile fields
    user.businessName = businessName;
    user.businessAddress = businessAddress;
    user.businessType = businessType || user.businessType;
    user.upiId = upiId;
    user.bankDetails = bankDetails;
    
    // Mark the user as successfully onboarded
    user.isOnboarded = true;

    await user.save();
    
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isOnboarded: user.isOnboarded,
        businessName: user.businessName,
        businessAddress: user.businessAddress,
        businessType: user.businessType,
        upiId: user.upiId,
        bankDetails: user.bankDetails
      }
    });
  } catch (error) {
    console.error('Profile Update Error:', error);
    res.status(500).json({ success: false, error: 'Failed to save profile configuration.' });
  }
};
