// Check AI API availability
document.addEventListener('DOMContentLoaded', async () => {
  const statusElement = document.getElementById('status');
  
  try {
    // Check if Chrome Built-in AI APIs are available
    const hasAIApis = typeof ai !== 'undefined' && (ai.summarizer || ai.prompt || ai.translator);
    
    if (hasAIApis) {
      statusElement.textContent = '✅ Chrome Built-in AI APIs are available';
      statusElement.className = 'status available';
      
      // Test one of the APIs
      if (ai.summarizer) {
        const testText = "The quick brown fox jumps over the lazy dog.";
        try {
          const summary = await ai.summarizer(testText, { format: "plain-text" });
          console.log('AI Summarizer test successful:', summary);
        } catch (testError) {
          console.log('Summarizer test failed, but APIs are available:', testError);
        }
      }
    } else {
      statusElement.innerHTML = `
        ℹ️ Chrome Built-in AI not available<br>
        <small>Using fallback dictionary service instead</small>
      `;
      statusElement.className = 'status unavailable';
    }
  } catch (error) {
    statusElement.innerHTML = `
      ℹ️ Chrome Built-in AI not available<br>
      <small>Using fallback dictionary service instead</small>
    `;
    statusElement.className = 'status unavailable';
  }
});