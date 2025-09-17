# BetterClock

A beautiful and modern clock application built with Electron.

## Features

- **Real-time Clock**: Always up-to-date time display with smooth animations
- **Modern Design**: Beautiful glassmorphism UI with responsive layout
- **Cross-platform**: Runs on Windows, macOS, and Linux
- **12/24 Hour Format**: Toggle between different time formats
- **Responsive**: Adapts to different screen sizes

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/OshenVithanage/Betterclock.git
   cd Betterclock
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

## Project Structure

```
Betterclock/
├── main.js          # Main Electron process
├── preload.js       # Preload script for secure communication
├── index.html       # Main application UI
├── package.json     # Project configuration
└── README.md        # This file
```

## Technologies Used

- **Electron**: Cross-platform desktop app framework
- **HTML5/CSS3**: Modern web technologies
- **JavaScript**: Application logic
- **Node.js**: Backend runtime

## Security Features

- Context isolation enabled
- Node integration disabled
- Remote module disabled
- Secure preload script for renderer-main communication

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Author

Your Name - [Your GitHub Profile](https://github.com/OshenVithanage)