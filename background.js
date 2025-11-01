// Background service worker
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "wordwise-lookup",
    title: "Look up with WordWise",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "wordwise-lookup") {
    const selectedText = info.selectionText.trim();
    if (selectedText && selectedText.split(/\s+/).length === 1) {
      chrome.tabs.sendMessage(tab.id, {
        action: "showDefinition",
        word: selectedText
      });
    }
  }
});

// Handle definition requests
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getDefinition") {
    getDefinition(request.word)
      .then(definition => sendResponse({ success: true, definition }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Will respond asynchronously
  }
});

async function getDefinition(word) {
  try {
    // First try to use Chrome's Built-in AI Summarizer API as a fallback
    // If AI APIs are not available, use a dictionary API
    return await getDefinitionWithAI(word);
  } catch (error) {
    console.log('AI API failed, trying fallback:', error);
    return await getDefinitionFallback(word);
  }
}

async function getDefinitionWithAI(word) {
  // Using available Chrome Built-in AI APIs
  // Try Summarizer API first as it can provide concise explanations
  if (window.ai && ai.summarizer) {
    const textToSummarize = `Explain the word "${word}" in simple terms with a brief definition and example.`;
    const summary = await ai.summarizer(textToSummarize, { format: "plain-text" });
    return summary;
  }
  
  // Try Prompt API if available
  if (window.ai && ai.prompt) {
    const prompt = `Define "${word}" in simple, clear language. Provide:
    1. Basic definition
    2. Part of speech
    3. Simple example sentence
    Keep it very concise.`;
    
    const result = await ai.prompt(prompt);
    return result;
  }
  
  throw new Error('Chrome Built-in AI APIs not available');
}

async function getDefinitionFallback(word) {
  // Fallback to a free dictionary API
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.toLowerCase())}`);
    
    if (!response.ok) {
      throw new Error('Word not found in dictionary');
    }
    
    const data = await response.json();
    
    if (data && data[0] && data[0].meanings && data[0].meanings[0]) {
      const meaning = data[0].meanings[0];
      const definition = meaning.definitions[0].definition;
      const partOfSpeech = meaning.partOfSpeech;
      
      return `${word} (${partOfSpeech}): ${definition}`;
    }
    
    throw new Error('No definition found');
  } catch (error) {
    // Final fallback to a local dictionary
    return await getLocalDefinition(word);
  }
}

async function getLocalDefinition(word) {
  // Simple local fallback for common words
  const localDict = {
    "algorithm": "A set of steps or rules to solve a problem or perform a computation",
    "api": "Application Programming Interface - a way for programs to communicate with each other",
    "browser": "A software application for accessing information on the web",
    "cache": "Temporary storage for faster access to frequently used data",
    "cloud": "Remote servers that store and process data over the internet",
    "cookie": "Small piece of data stored by websites to remember information about you",
    "encryption": "Process of converting information into secret code to protect it",
    "javascript": "Programming language commonly used for web development",
    "server": "Computer or system that provides services to other computers",
    "url": "Web address that specifies the location of a resource on the internet"
  };
  
  const lowerWord = word.toLowerCase();
  return localDict[lowerWord] || `Sorry, couldn't find a definition for "${word}". Try a different word or check your spelling.`;
}