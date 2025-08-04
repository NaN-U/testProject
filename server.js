const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Define Mongoose Schema and Model
const internSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // In a real app, hash this!
  referralCode: { type: String, unique: true },
  totalDonationsRaised: { type: Number, default: 0 },
  rewards: [{ type: String }],
});

const Intern = mongoose.model('Intern', internSchema);

// Dummy Data Seeder (run once to populate database)
async function seedData() {
  try {
    await Intern.deleteMany({}); // Clear existing data
    await Intern.insertMany([
      {
        name: "Alex Johnson",
        email: "alex@example.com",
        password: "password123", // Hash this in production!
        referralCode: "alexj2025",
        totalDonationsRaised: 1250,
        rewards: ["Bronze Badge (First 100)", "Silver Star (First 500)", "Exclusive Webinar Access (First 1000)"]
      },
      {
        name: "Maria Garcia",
        email: "maria@example.com",
        password: "password123",
        referralCode: "mariag2025",
        totalDonationsRaised: 1800,
        rewards: ["Gold Medal (Top Earner)", "Exclusive Webinar Access (First 1000)"]
      },
      {
        name: "Chen Wei",
        email: "chen@example.com",
        password: "password123",
        referralCode: "chenw2025",
        totalDonationsRaised: 980,
        rewards: ["Bronze Badge (First 100)"]
      },
      {
        name: "Sarah Lee",
        email: "sarah@example.com",
        password: "password123",
        referralCode: "sarahl2025",
        totalDonationsRaised: 750,
        rewards: []
      },
      {
        name: "David Kim",
        email: "david@example.com",
        password: "password123",
        referralCode: "davidk2025",
        totalDonationsRaised: 620,
        rewards: []
      },
    ]);
    console.log('Dummy data seeded successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

// Uncomment the line below to seed data when the server starts (run once, then comment out)
seedData();

// API Routes
app.get('/api/intern-data/:email', async (req, res) => {
  try {
    const intern = await Intern.findOne({ email: req.params.email });
    if (!intern) {
      return res.status(404).json({ message: 'Intern not found' });
    }
    res.json({
      name: intern.name,
      referralCode: intern.referralCode,
      totalDonationsRaised: intern.totalDonationsRaised,
      rewards: intern.rewards
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

app.get('/api/leaderboard', async (req, res) => {
  try {
    const leaderboard = await Intern.find({})
      .select('name totalDonationsRaised')
      .sort({ totalDonationsRaised: -1 }) // Sort by donations descending
      .limit(10); // Top 10
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Dummy Login (no actual auth, just checks if credentials match a seeded user)
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body; // 'username' here is expected to be 'email'
  try {
    const intern = await Intern.findOne({ email: username, password: password });
    if (intern) {
      // In a real app, you'd generate and send a JWT token here
      res.status(200).json({ message: 'Login successful (dummy)', token: 'dummy-token-123', user: { email: intern.email, name: intern.name } });
    } else {
      res.status(401).json({ message: 'Invalid username or password.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

app.get('/api/dummy-users', async (req, res) => {
  try {
    const interns = await Intern.find({}, 'name email'); // Only return name and email
    const users = interns.map(user => ({
      name: user.name,
      email: user.email,
      password: 'password123', // Show dummy password for demo purposes
    }));
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch dummy users' });
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});