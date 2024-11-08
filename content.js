// content.js
let keywords = [];
let showHidden = false;

// Initialize
chrome.storage.local.get(['keywords', 'showHidden'], function(result) {
  keywords = result.keywords || [];
  showHidden = result.showHidden || false;
  filterPapers();
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'updateFilters') {
    chrome.storage.local.get(['keywords'], function(result) {
      keywords = result.keywords || [];
      filterPapers();
    });
  } else if (request.action === 'toggleVisibility') {
    chrome.storage.local.get(['showHidden'], function(result) {
      showHidden = result.showHidden;
      filterPapers();
    });
  }
});

function filterPapers() {
  const papers = document.querySelectorAll('.meta');
  
  papers.forEach(paper => {
    const text = paper.textContent.toLowerCase();
    const shouldHide = keywords.some(keyword => text.includes(keyword.toLowerCase()));
    
    if (shouldHide) {
      paper.classList.add('filtered-paper');
      paper.style.display = showHidden ? 'block' : 'none';
    } else {
      paper.classList.remove('filtered-paper');
      paper.style.display = 'block';
    }
  });
}

