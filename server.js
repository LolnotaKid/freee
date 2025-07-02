const express = require('express');
const path = require('path');
const shortid = require('shortid');
const app = express();
const PORT = process.env.PORT || 3000;

// In-memory database (for demo - in production use a real database)
const database = new Map();

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.post('/api/save', (req, res) => {
    const { code } = req.body;
    if (!code) {
        return res.status(400).json({ error: 'Code is required' });
    }

    const id = shortid.generate();
    database.set(id, code);
    
    res.json({ 
        id,
        url: `${req.protocol}://${req.get('host')}/?id=${id}`,
        rawUrl: `${req.protocol}://${req.get('host')}/raw/${id}`,
        loadstring: `loadstring(game:HttpGet("${req.protocol}://${req.get('host')}/raw/${id}"))()`
    });
});

// Raw content route
app.get('/raw/:id', (req, res) => {
    const { id } = req.params;
    const code = database.get(id);
    
    if (!code) {
        return res.status(404).send('Paste not found');
    }
    
    res.type('text/plain');
    res.send(code);
});

// Frontend route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
