const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const path = require('path');
const cors = require('cors');

// import error middleware
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

//import routes
const adminRoutes = require('./routes/adminRoutes');
const uploadRoutes = require('./routes/uploadRoutes')

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// routes
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/', (req, res) => {
  res.send('Server is running...');
});

// error handling not found
app.use(notFound);
// error handling other errors
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
console.log(`http://localhost:${PORT}`);