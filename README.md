# 🏥 Healthcare Translator Web App 

A real-time multilangual medical translator web app for patience and healthcare provider with speech-to-text, AI translation, and translation audio playback features. 

## ✨ Features 

- 🎙️ **Voice to Text**: Speak to your michrophone and get instan transcription on your screen.
- 🌐 **AI-Translation**: Translates your input using OpenAI's GPT-4o-mini with a focus on accurate medical terminology.
- 🔊 **Audio Playback**: Hear the translated result aloud via your browser's speech synthesis.
- 🕑 **Conversation History**: Review past queries with language tags and timestamps.
- 📱 **Responsive Design**: Mobile-first interface

## 🛠 Tech Stack 

- **Frontend**: Next.js, Tailwind CSS
- **Speech Recognition**: Web Speech API
- **Translation**: OpenAI API (GPT 4o-mini)
- **Deployment**: Vercel

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/healthcare-translator.git
cd healthcare-translator
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Add Environment Variable
Create a **.env.local** file in your root folder and add your OpenAI API key:
```bash
OPENAI_API_KEY=your_openai_key_here
```
💡 You can get your own key at https://platform.openai.com/account/api-keys

### 4. Run Locally
```bash
npm run dev
```
Then you can open http://localhost:3000

## 🌍 Deployment 

Deploy this project easily with Vercel:
1. Push your project to GitHub.
2. Sign in to Vercel and import your repo.
3. Add **OPENAI_API_KEY** as an environment variable.
4. Click Deploy 🎉

## 📄 File Structure
```bash
/app
└─ page.js               # Main frontend UI
/components
└─ SpeechToText.js       # Voice recognition component
/pages/api
└─ translate.js          # Translation route (GPT-4o-mini)
.env.local               # API key (not committed)
```

## 🧪 Example Test Phrases
```bash
"Hello doctor, I have a headache."
"My child has a fever."
"I’m allergic to penicillin."
```
## 📋 Usage Guide

1. Select languages (input/output)
2. Hold microphone button and speak
3. View real-time transcription
4. See automatic translation
5. Click **Speak Translation** button to hear translation

## 🈳 Supported Languages

**Input Languages** | **Output Languages**
--------------------|---------------------
🇬🇧 English (en-US)	| 🇬🇧 English (en)
🇮🇩 Indonesian (id-ID) | 🇮🇩 Indonesian (id)
🇪🇸 Spanish (es-ES) | 🇪🇸 Spanish (es)
🇫🇷 French (fr-FR) | 🇫🇷 French (fr)
🇩🇪 German (de-DE) | 🇩🇪 German (de)

## 🛡️ Disclaimer
This app is a **prototype for educational purposes**. It should not be used as a replacement for certified medical interpretation. For emergencies, always contact licensed professionals.

## 📧 Contact
- Wahyu Erlangga - wahyujungde@gmail.com
- Project Link: https://github.com/odewahyu/healthcare-translator


