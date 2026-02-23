const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio';
mongoose.connect(mongoURI, {
  serverSelectionTimeoutMS: 5000,
  family: 4
})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Error:', err));

// Routes
const routesPath = path.join(__dirname, 'routes');
if (fs.existsSync(routesPath)) {
  fs.readdirSync(routesPath).forEach(file => {
    const route = require(`./routes/${file}`);
    app.use('/api', route);
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Link: http://localhost:5000');
});