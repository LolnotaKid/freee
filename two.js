document.addEventListener('DOMContentLoaded', function() {
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
        fetch(`/raw/${id}`)
            .then(response => response.text())
            .then(code => {
                codeEditor.value = code;
                updateDisplays(id);
            })
            .catch(err => {
                console.error('Error loading paste:', err);
                alert('Paste not found');
            });
    }

    // Save code
    saveBtn.addEventListener('click', function() {
        const code = codeEditor.value;
        
        fetch('/api/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code })
        })
        .then(response => response.json())
        .then(data => {
            window.history.pushState({}, '', `/?id=${data.id}`);
            updateDisplays(data.id, data);
        })
        .catch(err => {
            console.error('Error saving paste:', err);
            alert('Failed to save paste');
        });
    });

    // Copy loadstring
    copyBtn.addEventListener('click', function() {
        const loadstring = loadstringDisplay.textContent.replace('Loadstring:', '').trim();
        if (!loadstring) {
            alert('Please generate a link first!');
            return;
        }
        
        navigator.clipboard.writeText(loadstring)
            .then(() => alert('Loadstring copied to clipboard!'))
            .catch(err => console.error('Failed to copy:', err));
    });

    // New paste
    newBtn.addEventListener('click', function() {
        codeEditor.value = 'print("Hello it works!")';
        window.history.pushState({}, '', '/');
        urlDisplay.textContent = '';
        loadstringDisplay.textContent = '';
    });

    // Update displays
    function updateDisplays(id, apiData) {
        const baseUrl = window.location.origin;
        const data = apiData || {
            url: `${baseUrl}/?id=${id}`,
            rawUrl: `${baseUrl}/raw/${id}`,
            loadstring: `loadstring(game:HttpGet("${baseUrl}/raw/${id}"))()`
        };
        
        urlDisplay.innerHTML = `<strong>Share URL:</strong><br><a href="${data.url}" target="_blank">${data.url}</a>`;
        loadstringDisplay.innerHTML = `<strong>Loadstring:</strong><br>${data.loadstring}`;
    }
});
