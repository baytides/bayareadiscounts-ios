/**
 * Responsive Layout Hook
 * Provides device-aware layout utilities for iPad and visionOS support
 */

import { useWindowDimensions, Platform, ViewStyle } from 'react-native';

export interface ResponsiveLayout {
  isTablet: boolean;
  isLandscape: boolean;
  isVisionOS: boolean;
  numColumns: number;
  horizontalPadding: number;
  cardWidth: number;
  screenWidth: number;
  screenHeight: number;
  // 3D styling utilities for cards
  cardElevationStyle: ViewStyle;
  cardBorderStyle: ViewStyle;
}

const TABLET_BREAKPOINT = 768;
const CARD_MIN_WIDTH = 320;
const CARD_MAX_WIDTH = 500;

// visionOS typically runs at higher resolution windows
const VISION_OS_MIN_WIDTH = 1280;

export function useResponsiveLayout(): ResponsiveLayout {
  const { width, height } = useWindowDimensions();

  const isTablet = width >= TABLET_BREAKPOINT;
  const isLandscape = width > height;

  // Detect visionOS - it reports as 'ios' but typically has larger window dimensions
  // and we can also check for the visionos-specific platform value
  const isVisionOS = Platform.OS === 'ios' && width >= VISION_OS_MIN_WIDTH && height >= 800;

  // Calculate number of columns based on screen width
  // Phone: 1 column
  // iPad portrait (~768-834px): 2 columns
  // iPad landscape (~1024-1194px): 3 columns
  // iPad Pro 12.9" landscape / visionOS (1366px+): 4 columns
  // visionOS large window (1600px+): 5 columns
  let numColumns = 1;
  if (width >= 1600) {
    numColumns = 5;
  } else if (width >= 1200) {
    numColumns = 4;
  } else if (width >= 1024) {
    numColumns = 3;
  } else if (width >= TABLET_BREAKPOINT) {
    numColumns = 2;
  }

  // Adjust horizontal padding - more padding for larger screens and visionOS
  let horizontalPadding = 16;
  if (isVisionOS) {
    horizontalPadding = 48;
  } else if (isTablet) {
    horizontalPadding = isLandscape ? 32 : 24;
  }

  // Calculate card width based on available space
  const availableWidth = width - (horizontalPadding * 2);
  const gapWidth = (numColumns - 1) * 16; // 16px gap between cards
  const rawCardWidth = (availableWidth - gapWidth) / numColumns;
  const cardWidth = Math.min(Math.max(rawCardWidth, CARD_MIN_WIDTH), CARD_MAX_WIDTH);

  // 3D elevated card styling - primarily for visionOS, subtle on other devices
  const cardElevationStyle: ViewStyle = isVisionOS
    ? {
        // visionOS: Strong depth with multiple shadow layers for glass-like effect
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.35,
        shadowRadius: 24,
        elevation: 16,
      }
    : isTablet
    ? {
        // iPad: Slightly enhanced but still subtle
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 4,
      }
    : {
        // iPhone: Subtle elevation
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      };

  // 3D border styling - creates a beveled, raised appearance (primarily for visionOS)
  const cardBorderStyle: ViewStyle = isVisionOS
    ? {
        // visionOS: Glass-like beveled border for depth
        borderWidth: 1.5,
        borderColor: 'rgba(255, 255, 255, 0.25)',
        borderTopColor: 'rgba(255, 255, 255, 0.6)',
        borderLeftColor: 'rgba(255, 255, 255, 0.4)',
        borderRightColor: 'rgba(0, 0, 0, 0.15)',
        borderBottomColor: 'rgba(0, 0, 0, 0.2)',
      }
    : {
        // iPad and iPhone: No special border
        borderWidth: 0,
      };

  return {
    isTablet,
    isLandscape,
    isVisionOS,
    numColumns,
    horizontalPadding,
    cardWidth,
    screenWidth: width,
    screenHeight: height,
    cardElevationStyle,
    cardBorderStyle,
  };
}

export default useResponsiveLayout;
