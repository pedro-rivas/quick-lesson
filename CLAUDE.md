# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm install` or `yarn` - Install dependencies
- `npx expo start` - Start development server with Metro bundler
- `npx expo run:android` - Build and run on Android emulator/device  
- `npx expo run:ios` - Build and run on iOS simulator/device
- `expo start --web` - Run on web browser
- `npx expo install --check` - Check for incompatible package versions
- `expo lint` - Run ESLint to check code quality
- `xcrun xctrace list devices` - List available iOS devices/simulators
- `npm run reset-project` - Reset project to blank state (moves current code to app-example)

## Architecture Overview

This is a React Native language learning app built with Expo and file-based routing. Key architectural patterns:

### State Management
- **Zustand stores** for global state:
  - `appStore` - App settings and language preferences
  - `userStore` - User data and preferences  
  - `lessonStore` - Lesson content and progress
- **AsyncStorage persistence** via Zustand middleware for offline data

### Authentication & Data
- **Supabase** for backend authentication and database
- Session management via `useAppSession` hook
- `SessionProvider` and `AuthContext` for auth state distribution

### UI Architecture  
- **Expo Router** with file-based routing in `app/` directory
- **Theme system** with light/dark mode support via `ThemeProvider`
- **Internationalization** with i18next for multi-language support
- Custom component library in `components/` with consistent styling

### Key Features
- **Speech-to-text** and **text-to-speech** functionality
- **Audio recording** with microphone permissions
- **Lesson generation** via Google GenAI integration
- **Practice modes**: vocabulary matching, word completion, phrase practice
- **Progress tracking** and adaptive learning

### File Structure
- `app/` - Screen components using Expo Router
- `components/` - Reusable UI components
- `hooks/` - Custom React hooks
- `lib/` - Services (Supabase, speech, TTS)
- `store/` - Zustand state stores
- `constants/` - Configuration, colors, languages
- `providers/` - Context providers
- `navigation/` - Navigation configuration
- `i18n/` - Internationalization setup

### Import Aliases
Uses `@/*` path mapping for clean imports (configured in `tsconfig.json`).