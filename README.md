# SymboTalk AI - Universal Communication Bridge 🤖

A visionary web application that bridges spoken language and visual actions, creating an inclusive communication tool for people with different abilities.

## 🌟 Vision

SymboTalk AI is designed to be a two-way bridge that translates between spoken language and visual actions, creating a more intuitive way for people to connect, regardless of their ability to hear or speak.

## ✨ Features

### 🗣️ Speech to Action Mode
- **Voice Input**: Natural speech recognition
- **AI Understanding**: Semantic analysis of speech content
- **Avatar Animation**: Visual representation of actions
- **Real-time Processing**: Instant translation and feedback

### 🙆 Action to Speech Mode
- **Gesture Recognition**: Camera-based action detection
- **Contextual Translation**: Smart interpretation of gestures
- **Voice Synthesis**: Natural speech output
- **Accessibility Focus**: Designed for non-verbal communication

### 🚀 Advanced Features
- **Offline Support**: Works without internet connection
- **PWA Ready**: Installable as a mobile/desktop app
- **Multi-language**: Support for multiple languages
- **Customizable**: Extensible action and gesture libraries
- **Accessibility**: WCAG compliant design
- **Responsive**: Works on all devices
- **Contract Analysis**: AI-powered legal document analysis (NEW!)
  - Extract key clauses with 90%+ accuracy
  - Detect deviations from standard templates
  - Generate summaries for non-legal staff
  - Support for MSAs and SOWs up to 80 pages

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Speech Recognition**: Web Speech API
- **Speech Synthesis**: Web Speech API
- **Camera Access**: MediaDevices API
- **Offline Support**: Service Workers
- **PWA**: Web App Manifest
- **Responsive Design**: CSS Grid & Flexbox

## 📱 Installation

### Option 1: Deploy to GitHub Pages

1. **Fork this repository**
   ```bash
   git clone https://github.com/yourusername/SymboTalk-AI.git
   cd SymboTalk-AI
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings
   - Navigate to Pages section
   - Select source branch (main/master)
   - Save settings

3. **Access your app**
   - Your app will be available at: `https://yourusername.github.io/SymboTalk-AI`

### Option 2: Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/SymboTalk-AI.git
   cd SymboTalk-AI
   ```

2. **Serve locally** (choose one):
   
   **Using Python:**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```
   
   **Using Node.js:**
   ```bash
   npx serve .
   ```
   
   **Using PHP:**
   ```bash
   php -S localhost:8000
   ```

3. **Open in browser**
   - Navigate to: `http://localhost:8000`

### Option 3: Deploy to Netlify/Vercel

1. **Connect your repository**
   - Sign up for Netlify or Vercel
   - Connect your GitHub repository
   - Deploy automatically

2. **Custom domain** (optional)
   - Add your custom domain in the platform settings

## 🎯 Usage Guide

### Speech to Action Mode

1. **Click the microphone button** to start speech recognition
2. **Speak naturally** - try phrases like:
   - "Hello" → Avatar waves
   - "I'm happy" → Avatar smiles
   - "Dance" → Avatar dances
   - "I'm thirsty" → Avatar shows drinking gesture
3. **Watch the avatar** perform the corresponding action
4. **View the description** of what was recognized

### Action to Speech Mode

1. **Click "Start Camera"** to enable gesture recognition
2. **Perform gestures** in front of the camera:
   - Wave your hand
   - Give thumbs up/down
   - Point at something
   - Clap your hands
3. **Click "Speak"** to hear the translated words
4. **Customize settings** for voice and language preferences

### Settings & Customization

- **Voice Selection**: Choose from available system voices
- **Speech Speed**: Adjust speaking rate (slow/normal/fast)
- **Language**: Select preferred language
- **Offline Mode**: Works without internet connection

### Contract Analysis Mode (NEW!)

1. **Open the Contract Analyzer** at `contract_analysis.html`
2. **Upload your contract** (PDF, DOCX, or TXT up to 80 pages)
   - Master Services Agreements (MSAs)
   - Statements of Work (SOWs)
   - Other legal documents
3. **Review extracted clauses**:
   - Termination terms
   - Indemnity caps
   - Service Level Agreements
4. **Check deviations** from standard templates
5. **Read the plain-English summary** designed for non-legal staff
6. **Download results** in JSON format

**API Usage:**
```bash
# Start the API server
cd contract_analysis
pip install -r requirements.txt
python api.py

# Analyze a contract
curl -X POST http://localhost:5000/api/analyze \
  -F "file=@contract.pdf"
```

See [Contract Analysis Documentation](contract_analysis/README.md) for details.
- **Offline Mode**: Works without internet connection

## 🔧 Customization

### Adding Custom Actions

```javascript
// Add custom speech action
window.speechManager.addCustomAction(
    'custom_phrase',
    'custom_action',
    'Custom action description'
);

// Add custom avatar animation
window.avatarManager.addCustomAnimation(
    'custom_action',
    '😊',
    1500,
    'custom-animation-class',
    'Custom animation description'
);
```

### Adding Custom Gestures

```javascript
// Add custom gesture
window.gestureManager.addCustomGesture(
    'custom_gesture',
    ['custom', 'keywords'],
    'Custom gesture description',
    0.8
);
```

## 🌐 Browser Support

- ✅ Chrome 66+
- ✅ Firefox 60+
- ✅ Safari 11.1+
- ✅ Edge 79+
- ⚠️ Internet Explorer (Limited support)

## 📋 Requirements

- **Microphone access** for speech recognition
- **Camera access** for gesture recognition
- **HTTPS connection** (required for media APIs)
- **Modern browser** with Web Speech API support

## 🔒 Privacy & Security

- **No data collection**: All processing happens locally
- **No server storage**: Your speech and gestures stay private
- **Secure by design**: Uses browser-native APIs only
- **Offline first**: Works without internet connection

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Test thoroughly**
5. **Submit a pull request**

### Development Guidelines

- Follow existing code style
- Add comments for complex logic
- Test on multiple browsers
- Ensure accessibility compliance
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Web Speech API** for speech recognition and synthesis
- **MediaDevices API** for camera access
- **Service Workers** for offline functionality
- **PWA standards** for app-like experience
- **Accessibility community** for inclusive design guidance

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/SymboTalk-AI/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/SymboTalk-AI/discussions)
- **Email**: contact@symbotalk.ai

## 🚀 Roadmap

- [x] **Contract Analysis NLP Pipeline** - AI-powered legal document analysis
- [ ] Advanced gesture recognition with TensorFlow.js
- [ ] Multi-language support expansion
- [ ] Custom avatar creation
- [ ] Real-time collaboration features
- [ ] Mobile app versions (iOS/Android)
- [ ] Integration with assistive technologies
- [ ] Machine learning improvements
- [ ] Community gesture library

## 📊 Project Status

- **Version**: 1.0.0
- **Status**: Beta
- **Last Updated**: August 2025
- **Contributors**: Open for contributions

---

**Made with ❤️ for inclusive communication**

*SymboTalk AI - Bridging worlds through technology* 