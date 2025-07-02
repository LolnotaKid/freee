document.addEventListener('DOMContentLoaded', function() {
    const codeEditor = document.getElementById('codeEditor');
    const saveBtn = document.getElementById('saveBtn');
    const copyBtn = document.getElementById('copyBtn');
    const urlDisplay = document.getElementById('urlDisplay');
    
    // Check if there's a saved code in the URL hash
    if (window.location.hash) {
        try {
            const decoded = atob(window.location.hash.substring(1));
            codeEditor.value = decoded;
            updateUrlDisplay();
        } catch (e) {
            console.error("Error decoding hash:", e);
        }
    }
    
    // Save code to URL hash
    saveBtn.addEventListener('click', function() {
        const code = codeEditor.value;
        const encoded = btoa(code);
        window.location.hash = encoded;
        updateUrlDisplay();
        alert('Code saved to URL!');
    });
    
    // Copy loadstring to clipboard
    copyBtn.addEventListener('click', function() {
        const currentUrl = window.location.origin + window.location.pathname;
        const loadstring = `loadstring(game:HttpGet("${currentUrl}#${btoa(codeEditor.value)}"))()`;
        
        navigator.clipboard.writeText(loadstring)
            .then(() => alert('Loadstring copied to clipboard!'))
            .catch(err => console.error('Failed to copy:', err));
    });
    
    // Update the URL display
    function updateUrlDisplay() {
        const currentUrl = window.location.origin + window.location.pathname + window.location.hash;
        urlDisplay.textContent = currentUrl;
    }
    
    // Initial display update
    updateUrlDisplay();
});
