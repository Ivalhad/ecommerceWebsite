const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/database')
const path = require('path');
const cors = require('cors');

dotenv.config();
connectDB();

const app = express();

app.use(cors()); 
app.use(express.json());


app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.get('/', (req, res) => {
  res.send('server is running...');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
console.log(`http://localhost:${PORT}`);