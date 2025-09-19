# BetterClock

A beautiful and modern timer application built with React and Electron, featuring smooth animations and an intuitive interface.

## ✨ Features

- **Modern React Interface**: Built with React for smooth state management and component reusability
- **Dual Timer Modes**: 
  - **Focus Sessions**: Pomodoro-style productivity timers (15/25/45/60 minutes)
  - **Break Timers**: Quick break sessions (5/10/15/20 minutes)
- **Animated Tab Navigation**: Pill-style segmented controls with sliding indicators
- **Circular Progress Indicators**: Visual countdown with smooth animations
- **System Tray Integration**: Control timers from the system tray
- **Cross-Platform**: Works on Windows, macOS, and Linux

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/OshenVithanage/Betterclock.git
   cd Betterclock
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the React application:
   ```bash
   npm run build:react
   ```

4. Start the application:
   ```bash
   npm start
   ```

## 🛠️ Development

### Development Mode
For development with automatic React rebuilding:
```bash
npm run dev
```

### Build Commands
- `npm run build:react` - Build React app for production
- `npm run build:react:dev` - Build React app for development
- `npm run watch:react` - Watch mode for React development
- `npm start` - Start Electron with built React app
- `npm run build` - Build complete Electron application
- `npm run dist` - Create distributable packages

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18 with Hooks
- **Desktop Framework**: Electron
- **Build Tool**: Webpack with Babel
- **Styling**: CSS3 with CSS Variables

### Project Structure
```
src/
├── components/          # React components
│   ├── App.js          # Main application component
│   ├── TabNavigation.js # Tab switching component
│   ├── TabIndicator.js  # Animated tab indicator
│   ├── TimerCard.js     # Timer container component
│   ├── BreaksTab.js     # Break timer functionality
│   └── TasksTab.js      # Focus timer functionality
├── hooks/               # Custom React hooks
│   └── useElectronAPI.js # Electron API integration
├── styles/              # Global styles
│   └── index.css       # Base application styles
├── index.js            # React entry point
└── index.html          # HTML template

dist/                   # Built React application
main.js                 # Electron main process
preload.js             # Electron preload script
webpack.config.js      # Webpack configuration
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Oshen Gimantha Vithanage - [OshenVithanage](https://github.com/OshenVithanage)