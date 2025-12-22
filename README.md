# Bay Area Discounts - iOS

iOS version of the Bay Area Discounts mobile application, connecting Bay Area residents to public benefits and community resources.

## Prerequisites

- Node.js 18+
- npm or yarn
- Xcode 15+ (for iOS development)
- macOS (required for iOS development)
- CocoaPods (installed via Xcode)

## Getting Started

### Installation

```bash
npm install
```

### Running on iOS Simulator

```bash
npm start
# Then press 'i' in the terminal to open iOS simulator
```

Or use:

```bash
npm run ios
```

### Running on iOS Device

```bash
npm run run:device
```

### Building for Production

```bash
npm run prebuild
```

This will generate the native iOS project in the `ios/` directory.

## Project Structure

```
├── src/
│   ├── components/     # Reusable UI components
│   ├── screens/        # Screen components
│   ├── navigation/     # Navigation setup
│   ├── services/       # API and data services
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Utility functions
├── assets/             # Images, fonts, and other assets
└── app.json           # Expo/React Native configuration
```

## Scripts

- `npm start` - Start the development server (iOS mode)
- `npm run ios` - Run on iOS simulator
- `npm run run:device` - Run on physical iOS device
- `npm run run:simulator` - Run on iOS simulator
- `npm run prebuild` - Generate native iOS project
- `npm run lint` - Lint code
- `npm run format` - Format code with Prettier
- `npm test` - Run tests

## Contributing

This is the iOS-specific repository. For cross-platform issues or features, please coordinate with the Android repository.

### iOS-Specific Considerations

- Follow Apple's Human Interface Guidelines
- Test on multiple iOS versions and device sizes
- Ensure proper handling of Safe Area insets
- Test with VoiceOver for accessibility

## Related Repositories

- [Android Repository](https://github.com/baytides/bayareadiscounts-android)
- [Main Organization](https://github.com/baytides)

## Support

- Report iOS-specific issues: [GitHub Issues](https://github.com/baytides/bayareadiscounts-ios/issues)
- Website: [baytides.org](https://baytides.org)

## License

[Your License Here]
