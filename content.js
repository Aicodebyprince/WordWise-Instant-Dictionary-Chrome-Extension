// Content script to handle word selection and display definitions
let definitionPopup = null;

// Create popup element
function createPopup() {
  const popup = document.createElement('div');
  popup.id = 'wordwise-popup';
  popup.className = 'wordwise-popup';
  popup.innerHTML = `
    <div class="wordwise-header">
      <h3>WordWise</h3>
      <button class="wordwise-close">&times;</button>
    </div>
    <div class="wordwise-content">
      <div class="wordwise-loading">Loading definition...</div>
      <div class="wordwise-definition" style="display: none;"></div>
      <div class="wordwise-error" style="display: none;"></div>
    </div>
  `;
  document.body.appendChild(popup);
  
  // Add close button event listener
  popup.querySelector('.wordwise-close').addEventListener('click', hideDefinition);
  
  return popup;
}

// Show definition popup
function showDefinition(word, position) {
  if (!definitionPopup) {
    definitionPopup = createPopup();
  }

  const popup = definitionPopup;
  const loading = popup.querySelector('.wordwise-loading');
  const definition = popup.querySelector('.wordwise-definition');
  const error = popup.querySelector('.wordwise-error');

  // Reset states
  loading.style.display = 'block';
  definition.style.display = 'none';
  error.style.display = 'none';

  // Position popup near selection
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const popupWidth = 300;
  
  let left = position.x;
  let top = position.y + 20;
  
  // Ensure popup stays within viewport
  if (left + popupWidth > viewportWidth) {
    left = viewportWidth - popupWidth - 10;
  }
  if (top + 200 > viewportHeight) {
    top = position.y - 220;
  }
  
  popup.style.left = `${left}px`;
  popup.style.top = `${top}px`;
  popup.style.display = 'block';

  // Get definition from background script
  chrome.runtime.sendMessage(
    { action: "getDefinition", word: word },
    (response) => {
      loading.style.display = 'none';
      
      if (response && response.success) {
        definition.innerHTML = `
          <div class="word-title">${word}</div>
          <div class="word-meaning">${response.definition}</div>
        `;
        definition.style.display = 'block';
      } else {
        const errorMsg = response && response.error ? response.error : 'Failed to get definition';
        error.textContent = errorMsg;
        error.style.display = 'block';
      }
    }
  );
}

// Hide popup
function hideDefinition() {
  if (definitionPopup) {
    definitionPopup.style.display = 'none';
  }
}

// Click outside to close
document.addEventListener('click', (e) => {
  if (definitionPopup && 
      definitionPopup.style.display === 'block' && 
      !definitionPopup.contains(e.target) &&
      !e.target.classList.contains('wordwise-close')) {
    hideDefinition();
  }
});

// Handle messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "showDefinition") {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      showDefinition(request.word, {
        x: rect.left + window.scrollX,
        y: rect.bottom + window.scrollY
      });
    }
  }
});

// Double-click word selection
document.addEventListener('dblclick', (e) => {
  const selection = window.getSelection();
  const selectedText = selection.toString().trim();
  
  if (selectedText && selectedText.split(/\s+/).length === 1) {
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      showDefinition(selectedText, {
        x: rect.left + window.scrollX,
        y: rect.bottom + window.scrollY
      });
    }
    
    e.preventDefault();
    e.stopPropagation();
  }
});

// Escape key to close popup
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && definitionPopup && definitionPopup.style.display === 'block') {
    hideDefinition();
  }
});