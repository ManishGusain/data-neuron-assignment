const db_url = "mongodb+srv://manishgusain66:dGFd2M0tuZdcYnVh@celestial-cluster.aidsjxm.mongodb.net/"

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

let addCount = 0;
let updateCount = 0;

mongoose.connect(db_url, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

// Check MongoDB connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
  const componentSchema = new mongoose.Schema({
    content: String,
  });

  // Create model
  const ComponentModel = mongoose.model('Component', componentSchema);

  app.post('/api/add', async (req, res) => {
    try {
      const { title, content } = req.body;

      const newComponent = new ComponentModel({ title, content });

      await newComponent.save();

      addCount += 1;

      res.json({ success: true, message: 'Data added successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });

  app.put('/api/update', async (req, res) => {
    try {
      const { id, content } = req.body;

      // Find and update the document in the database
      await ComponentModel.findOneAndUpdate({ _id: id }, { title, content });

      // Increment the update count
      updateCount += 1;

      res.json({ success: true, message: 'Data updated successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });


  app.get('/api/count', async (req, res) => {
    try {
      const documentCount = await ComponentModel.countDocuments();
      console.log(documentCount)
      res.json({ count: documentCount });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });


  app.get('/api/latest', async (req, res) => {
    try {
      const latestDocument = await ComponentModel.findOne().sort({ _id: -1 }).limit(1);
      res.json(latestDocument);
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });


  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
