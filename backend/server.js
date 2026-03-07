const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');

dotenv.config();
const app = express();

app.use(express.json()); 
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Database connected");
  })
  .catch((error) => {
    console.log(error);
  });

app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);

app.get('/', (req, res) => {
  res.send("Skill Sharing Marketplace API work!");
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}.`);
});

module.exports = app;