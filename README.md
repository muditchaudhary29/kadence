# Kadence AI — AI Speech & Interview Coach

Kadence AI is a high-performance, client-side AI interview and speech coaching platform built with React, Vite, and Tailwind CSS. It provides real-time speech analytics, WPM pacing analysis, STAR method evaluation, vocal hesitation tracking, user feedback collection, and custom question generation from study notes.

## 🚀 Features

- **🎙️ Real-time Speech Analysis**: Live Web Audio API visualizer & Web Speech API continuous transcription.
- **⚡ WPM & Pacing Gauge**: Measures speaking pace with sweet-spot target indication (120–160 WPM).
- **⭐ STAR Method Breakdown**: Automated evaluation of Situation, Task, Action, and Result coverage.
- **💬 Filler Word Detection**: Context-aware detection of filler words (`um`, `uh`, `like`, `you know`, etc.) with highlights.
- **📊 Progress & Analytics**: Local storage history tracking score trends, category completion, and aggregate metrics.
- **📚 Study from Notes**: Upload `.txt`, `.md`, or `.pdf` files to automatically generate 8 custom interview questions.
- **💬 User Feedback System**: Interactive feedback submission form with 5-star ratings, topic tagging, and local review persistence.
- **🎨 3D Interactive UI**: Mouse-tracking 3D card tilt effects, glassmorphism aesthetics, dynamic mesh grid, and floating ambient light orbs.

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 + Vite
- **Styling**: Tailwind CSS + Custom 3D & Glassmorphism Design System
- **Icons**: Lucide React
- **Charts**: Recharts
- **Audio Processing**: Web Audio API & SpeechRecognition API

## 🚦 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd kadence-ai

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
```

## 📄 License

MIT
