
// popup.js
document.addEventListener('DOMContentLoaded', function() {
    const keywordInput = document.getElementById('keyword');
    const addButton = document.getElementById('addKeyword');
    const toggleButton = document.getElementById('toggleVisibility');
    const keywordList = document.getElementById('keywordList');
    
    // Load existing keywords
    chrome.storage.local.get(['keywords', 'showHidden'], function(result) {
      const keywords = result.keywords || [];
      keywords.forEach(keyword => addKeywordToList(keyword));
      
      if (result.showHidden) {
        toggleButton.textContent = 'Hide Filtered Papers';
      }
    });
    
    // Add keyword
    addButton.addEventListener('click', function() {
      const keyword = keywordInput.value.trim().toLowerCase();
      if (keyword) {
        chrome.storage.local.get(['keywords'], function(result) {
          const keywords = result.keywords || [];
          if (!keywords.includes(keyword)) {
            keywords.push(keyword);
            chrome.storage.local.set({ keywords });
            addKeywordToList(keyword);
            keywordInput.value = '';
            
            // Notify content script
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
              chrome.tabs.sendMessage(tabs[0].id, { action: 'updateFilters' });
            });
          }
        });
      }
    });
    
    // Toggle visibility
    toggleButton.addEventListener('click', function() {
      chrome.storage.local.get(['showHidden'], function(result) {
        const showHidden = !result.showHidden;
        chrome.storage.local.set({ showHidden });
        toggleButton.textContent = showHidden ? 'Hide Filtered Papers' : 'Show Hidden Papers';
        
        // Notify content script
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleVisibility' });
        });
      });
    });
    
    function addKeywordToList(keyword) {
      const div = document.createElement('div');
      div.className = 'keyword-item';
      div.innerHTML = `
        <span>${keyword}</span>
        <button class="remove-keyword">Remove</button>
      `;
      
      div.querySelector('.remove-keyword').addEventListener('click', function() {
        chrome.storage.local.get(['keywords'], function(result) {
          const keywords = result.keywords || [];
          const newKeywords = keywords.filter(k => k !== keyword);
          chrome.storage.local.set({ keywords: newKeywords });
          div.remove();
          
          // Notify content script
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'updateFilters' });
          });
        });
      });
      
      keywordList.appendChild(div);
    }
  });

