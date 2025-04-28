const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId; // Import ObjectId
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

const PORT = 3000;
const uri = 'mongodb://localhost:27017'; // MongoDB URI
const dbName = 'quizdb';

app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
let db;
MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        db = client.db(dbName);
        console.log('Connected to Database');
    })
    .catch(error => console.error('Failed to connect to the database:', error));

// GET all quizzes
app.get('/api/quizzes', async (req, res) => {
    try {
        const quizzes = await db.collection('quizzes').find().toArray();
        res.json(quizzes);
    } catch (error) {
        console.error('Error fetching quizzes:', error);
        res.status(500).send({ message: 'Server error' });
    }
});

// POST a new quiz
// POST a new quiz
app.post('/api/quizzes', async (req, res) => {
    const quizData = req.body;
    console.log("Received quiz data:", quizData);  // Log the received data

    // Ensure that the quiz data is valid
    if (!quizData.title || !quizData.questions || quizData.questions.length === 0) {
        console.log("Missing required quiz fields.");  // Log the missing fields
        return res.status(400).send({ message: 'Quiz data is missing required fields' });
    }

    try {
        const result = await db.collection('quizzes').insertOne(quizData);
        console.log("Quiz created with ID:", result.insertedId); // Log inserted quiz ID
        res.status(201).send({ message: 'Quiz created successfully', quizId: result.insertedId });
    } catch (error) {
        console.error('Error creating quiz:', error);
        res.status(500).send({ message: 'Server error' });
    }
});



// DELETE a quiz by its ID
app.delete('/api/quizzes/:id', async (req, res) => {
    const quizId = req.params.id;
    console.log("Received request to delete quiz with ID:", quizId);  // Log the received ID

    // Check if the ID is a valid ObjectId
    if (!ObjectId.isValid(quizId)) {
        console.log("Invalid quizId format:", quizId);
        return res.status(400).send({ message: 'Invalid Quiz ID format' });
    }

    try {
        // Convert quizId to ObjectId
        const objectId = new ObjectId(quizId);
        console.log("Converted ObjectId:", objectId);  // Log the converted ObjectId

        // Delete the quiz from the database
        const result = await db.collection('quizzes').deleteOne({ _id: objectId });

        if (result.deletedCount === 0) {
            console.log("No quiz found with the provided ID");
            return res.status(404).send({ message: 'Quiz not found' });
        }

        console.log("Quiz deleted successfully with ObjectId:", objectId);
        res.status(200).send({ message: 'Quiz deleted successfully' });
    } catch (error) {
        console.error('Error deleting quiz:', error);
        res.status(500).send({ message: 'Server error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
