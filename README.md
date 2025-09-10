# Quick Lesson 📚

A React Native language learning app built with Expo that provides AI-powered personalized lessons, speech-to-text practice, and interactive vocabulary exercises.

## App Demo Videos

| Video | Description |
|-------|-------------|
| [Demo 1](./assets/readme/1.mov) |  |
| [Demo 2](./assets/readme/2.mov) |  |
| [Demo 3](./assets/readme/3.mov) |  |
| [Demo 4](./assets/readme/4.mov) |  |
| [Demo 5](./assets/readme/5.mov) |  |

## Features

- 🤖 **AI-powered lesson generation** using Google Gemini
- 🎙️ **Speech-to-text practice** with microphone integration
- 🔊 **Text-to-speech** audio playback with ElevenLabs
- 📖 **Interactive practice modes**: vocabulary matching, word completion, phrase practice
- 🌍 **Multi-language support** with i18next
- 📱 **Cross-platform**: iOS, Android, and web
- 🌙 **Light/dark theme support**
- 📊 **Progress tracking** and adaptive learning

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **Yarn** - [Yarn installation](https://yarnpkg.com/getting-started/install)
- **Expo CLI** - Install globally with `npm install -g @expo/cli`

### Platform-specific requirements:

#### For iOS Development (macOS only):
- **Xcode** (latest version from Mac App Store)
- **iOS Simulator** (installed with Xcode)

#### For Android Development:
- **Android Studio** - [Download here](https://developer.android.com/studio)
- **Android Emulator** (configured through Android Studio)

#### For Physical Device Testing:
- **Expo Go** app from [App Store](https://apps.apple.com/app/expo-go/id982107779) or [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd quick-lesson
   ```

2. **Install dependencies**
   ```bash
   # Using Yarn (recommended)
   yarn install
   
   # Or using npm
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory with the following variables:
   ```env
   # Supabase Configuration
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # AI Services
   EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
   EXPO_PUBLIC_GOOGLE_API_KEY=your_google_api_key
   EXPO_PUBLIC_ELEVEN_LABS=your_eleven_labs_api_key
   
   # Database Configuration
   EXPO_PUBLIC_TTS_BUCKET_NAME=tts-audios
   EXPO_PUBLIC_TTS_TABLE_NAME=tts_audio
   EXPO_PUBLIC_USER_TABLE_NAME=users
   EXPO_PUBLIC_LESSONS_TABLE_NAME=lessons
   EXPO_PUBLIC_SYSTEM_ID=your_system_id
   ```

   **Getting API Keys:**
   - **Supabase**: Create a project at [supabase.com](https://supabase.com)
   - **Google Gemini**: Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - **ElevenLabs**: Sign up at [elevenlabs.io](https://elevenlabs.io) for text-to-speech

4. **Check for package compatibility**
   ```bash
   npx expo install --check
   ```

## Running the App

### Start Development Server
```bash
npx expo start
```

This will open the Expo development server with options to:

### Run on iOS Simulator (macOS only)
```bash
npx expo run:ios
```

### Run on Android Emulator
```bash
npx expo run:android
```

### Run in Web Browser
```bash
expo start --web
```

### Run on Physical Device
1. Install **Expo Go** app on your device
2. Scan the QR code from the development server
3. The app will load on your device

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start the development server |
| `npm run android` | Build and run on Android emulator |
| `npm run ios` | Build and run on iOS simulator |
| `npm run web` | Start web development server |
| `npm run lint` | Run ESLint to check code quality |
| `npm run install:check` | Check for incompatible package versions |
| `npm run reset-project` | Reset to blank project (moves code to app-example) |
| `xcrun xctrace list devices` | List available iOS devices/simulators |

## Project Structure

```
quick-lesson/
├── app/                    # Screen components (Expo Router)
├── components/             # Reusable UI components
├── hooks/                  # Custom React hooks
├── lib/                    # Services (Supabase, speech, TTS)
├── store/                  # Zustand state management
├── constants/              # Configuration, colors, languages
├── providers/              # Context providers
├── navigation/             # Navigation configuration
├── i18n/                   # Internationalization
├── assets/                 # Images, fonts, icons
├── .env                    # Environment variables (create this)
└── CLAUDE.md              # Claude Code assistant guidance
```

## Architecture

- **State Management**: Zustand with AsyncStorage persistence
- **Authentication**: Supabase Auth with session management
- **Navigation**: Expo Router with file-based routing
- **UI**: Custom theme system with light/dark mode
- **Internationalization**: i18next for multi-language support
- **Speech**: Expo Audio for recording and playback

## Troubleshooting

### Common Issues

**Metro bundler issues:**
```bash
npx expo start --clear
```

**iOS Simulator not showing:**
```bash
xcrun simctl list devices
npx expo run:ios --device "iPhone 15"
```

**Android build issues:**
```bash
cd android && ./gradlew clean && cd ..
npx expo run:android
```

**Package compatibility:**
```bash
npx expo install --check
```

**Environment variables not loading:**
- Ensure `.env` file is in root directory
- Restart the development server
- Variables must start with `EXPO_PUBLIC_`

### Performance

For better development performance:
- Use development build instead of Expo Go for complex features
- Enable Hermes engine (already configured)
- Use React Native Flipper for debugging

## Contributing

1. Create a feature branch
2. Make your changes
3. Run linting: `npm run lint`
4. Test on iOS/Android
5. Submit a pull request

## Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
