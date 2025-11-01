# 📖 WordWise — Instant Dictionary Chrome Extension

### Instantly learn new words with a simple double-click.  
WordWise enhances your browsing experience by providing **instant definitions, examples, and meanings** without leaving your page.

> 💡 Perfect for readers, students, researchers, and curious minds.

---

## ✨ Features

| Feature | Description |
|--------|-------------|
⚡ **Instant Lookups** | Double-click any word to see its meaning instantly  
🖱️ **Right-Click Support** | Right-click → *Look up with WordWise*  
🎯 **Smart Popup Positioning** | Popup appears near your selected word  
🔒 **Privacy-First** | Absolutely **zero tracking**  
🌐 **Works Everywhere** | Active on all websites  
⌨️ **Quick Close** | Press `ESC` or click outside the popup  

---

## 🛠️ Tech Stack

### Core Technologies
- Chrome Manifest V3
- JavaScript (ES6+)
- HTML5 & CSS3

### Chrome APIs Used
- `contextMenus`
- `tabs`
- `runtime`

### External API
📚 **dictionaryapi.dev** — Free dictionary API for meanings & examples

---

## 🚀 Installation

### Developer Setup

1. **Clone / Download** this repository
2. Open Chrome and visit: `chrome://extensions/`
3. Enable **Developer Mode** (top right)
4. Click **Load unpacked**
5. Select the extension folder

✅ WordWise is now active!

---

## 💡 Usage

### Quick Start
- **Double-click** any word to get its meaning
- **Right-click** selected text → *Look up with WordWise*
- Close with:
  - Press `ESC`
  - Click outside the popup

---

## 📁 Project Structure

wordwise-extension/
├── manifest.json # Extension configuration
├── background.js # Background service worker (API logic)
├── content.js # Content detection + popup trigger
├── content.css # Popup styling
├── popup.html # Optional browser popup UI
└── icons/
├── icon16.png
├── icon48.png
└── icon128.png


---

## 🧠 How It Works

1. **Content Script** detects word selection / double-click
2. Sends the word to the **Background Service Worker**
3. API fetches definition from **dictionaryapi.dev**
4. Popup displays:
   - Meaning
   - Part of Speech
   - Example Usage *(if available)*

---

## 🔧 API Behavior

| Behavior | Details |
|--------|--------|
Primary Source | DictionaryAPI (dictionaryapi.dev)  
Fallback | Local word lookup (future scope)  
Error Handling | Offline & unknown word friendly  

---

## 🛣️ Roadmap

- ✅ Smart word detection
- ✅ Instant popup
- ⏳ Synonyms & Antonyms
- ⏳ Pronunciation audio
- ⏳ Dark mode
- ⏳ Offline mini-dictionary

---

## 🤝 Contributing

Pull requests are welcome!  
For major changes, please open an issue first to discuss your idea.

---

## 📜 License
MIT License — Free to use & modify

---

## ⭐ Support the Project

If WordWise improved your reading experience, please ⭐ star the repo and share with others!

Happy learning 👨‍💻✨
