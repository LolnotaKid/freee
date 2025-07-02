const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const app = express();

// In-memory storage (replace with database in production)
const scripts = new Map();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Upload endpoint
app.post('/upload', (req, res) => {
    try {
        const { script } = req.body;
        if (!script) {
            return res.status(400).json({ success: false, error: 'No script provided' });
        }

        const id = uuidv4();
        scripts.set(id, script);

        res.json({ success: true, id });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Raw script endpoint
app.get('/raw/:id', (req, res) => {
    const script = scripts.get(req.params.id);
    if (!script) {
        return res.status(404).send('Script not found');
    }

    res.type('text/plain').send(script);
});

// All other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
