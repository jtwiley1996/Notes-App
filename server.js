const express = require('express');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 3001;
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from 'public' directory
app.use(express.static('public'));

// Define the path to the db.json file
const dbFilePath = path.join(__dirname, 'db', 'db.json');

// Read existing notes from db.json or initialize an empty array
let notesData = [];
try {
    const data = fs.readFileSync(dbFilePath, 'utf8');
    notesData = JSON.parse(data);
} catch (err) {
    console.error('Error reading db.json:', err);
}

// Function to write notes data to db.json file
function saveNotesData(notes) {
    fs.writeFileSync(dbFilePath, JSON.stringify(notes, null, 2));
}

// GET /notes endpoint to serve the notes.html file
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

// GET /api/notes endpoint to return all notes
app.get('/api/notes', (req, res) => {
    res.json(notesData);
});

// POST /api/notes endpoint to add a new note
app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    newNote.id = notesData.length + 1; // Assign a unique ID (simple increment here)
    notesData.push(newNote);
    saveNotesData(notesData);
    res.json(newNote);
});

// DELETE /api/notes/:id endpoint to delete a note by ID
app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
    notesData = notesData.filter((note) => note.id !== parseInt(noteId));
    saveNotesData(notesData);
    res.json(notesData);
});

// Default route to serve index.html for any other route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
});
