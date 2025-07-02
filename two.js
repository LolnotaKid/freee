document.addEventListener('DOMContentLoaded', function() {
    const codeInput = document.getElementById('code-input');
    const saveBtn = document.getElementById('save-btn');
    const clearBtn = document.getElementById('clear-btn');
    const shareLink = document.getElementById('share-link');
    const copyBtn = document.getElementById('copy-btn');
    
    // Check if there's a code parameter in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const encodedCode = urlParams.get('code');
    
    if (encodedCode) {
        // If there's code in the URL, display it
        const code = decodeURIComponent(encodedCode);
        codeInput.value = code;
        
        // Update the share link to show the current URL
        shareLink.textContent = window.location.href;
        copyBtn.disabled = false;
    }
    
    saveBtn.addEventListener('click', function() {
        const code = codeInput.value.trim();
        
        if (code) {
            // Encode the code for URL
            const encodedCode = encodeURIComponent(code);
            
            // Create the shareable URL
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set('code', encodedCode);
            
            // Display the shareable link
            shareLink.textContent = currentUrl.toString();
            copyBtn.disabled = false;
            
            // Update the browser's URL without reloading
            window.history.pushState({}, '', currentUrl.toString());
        } else {
            alert('Please enter some code first!');
        }
    });
    
    clearBtn.addEventListener('click', function() {
        codeInput.value = '';
    });
    
    copyBtn.addEventListener('click', function() {
        if (!copyBtn.disabled) {
            navigator.clipboard.writeText(shareLink.textContent)
                .then(() => {
                    copyBtn.textContent = 'Copied!';
                    setTimeout(() => {
                        copyBtn.textContent = 'Copy Link';
                    }, 2000);
                })
                .catch(err => {
                    console.error('Failed to copy: ', err);
                    alert('Failed to copy link to clipboard');
                });
        }
    });
});
