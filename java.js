// Simple database using localStorage
const codeDatabase = {
    save: function(code) {
        const id = this.generateId();
        localStorage.setItem(id, code);
        return id;
    },
    load: function(id) {
        return localStorage.getItem(id);
    },
    generateId: function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
};

// Check if this is a raw content request
function isRawRequest() {
    return window.location.pathname.startsWith('/raw/');
}

// Handle raw content display
function handleRawRequest() {
    const rawId = window.location.pathname.split('/raw/')[1];
    const rawCode = codeDatabase.load(rawId);
    if (rawCode) {
        document.body.innerHTML = `<pre>${rawCode}</pre>`;
        document.body.style.margin = '0';
        document.body.style.padding = '10px';
        document.body.style.backgroundColor = '#1e1e1e';
        document.body.style.color = '#ffffff';
        return true;
    }
    return false;
}

// Main application
function initApp() {
    const codeEditor = document.getElementById('codeEditor');
    const saveBtn = document.getElementById('saveBtn');
    const copyBtn = document.getElementById('copyBtn');
    const newBtn = document.getElementById('newBtn');
    const urlDisplay = document.getElementById('urlDisplay');
    const loadstringDisplay = document.getElementById('loadstringDisplay');

    // Check URL for ID parameter
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    
    if (id) {
        const savedCode = codeDatabase.load(id);
        if (savedCode) {
            codeEditor.value = savedCode;
            updateDisplays(id);
        }
    }

    // Save code
    saveBtn.addEventListener('click', function() {
        const id = codeDatabase.save(codeEditor.value);
        window.history.pushState({}, '', `?id=${id}`);
        updateDisplays(id);
        alert('Code saved with ID: ' + id);
    });

    // Copy loadstring
    copyBtn.addEventListener('click', function() {
        const currentId = new URLSearchParams(window.location.search).get('id');
        if (!currentId) {
            alert('Please generate a link first!');
            return;
        }
        const loadstring = `loadstring(game:HttpGet("${window.location.origin}/raw/${currentId}"))()`;
        navigator.clipboard.writeText(loadstring)
            .then(() => alert('Loadstring copied to clipboard!'))
            .catch(err => console.error('Failed to copy:', err));
    });

    // New paste
    newBtn.addEventListener('click', function() {
        codeEditor.value = 'print("Hello it works!")';
        window.history.pushState({}, '', window.location.pathname);
        urlDisplay.textContent = '';
        loadstringDisplay.textContent = '';
    });

    // Update displays
    function updateDisplays(id) {
        const url = `${window.location.origin}?id=${id}`;
        const rawUrl = `${window.location.origin}/raw/${id}`;
        const loadstring = `loadstring(game:HttpGet("${rawUrl}"))()`;
        
        urlDisplay.innerHTML = `<strong>Share URL:</strong><br>${url}`;
        loadstringDisplay.innerHTML = `<strong>Loadstring:</strong><br>${loadstring}`;
    }
}

// Start the application
if (isRawRequest()) {
    if (!handleRawRequest()) {
        // If raw ID not found, redirect to main page
        window.location.href = '/';
    }
} else {
    document.addEventListener('DOMContentLoaded', initApp);
}
