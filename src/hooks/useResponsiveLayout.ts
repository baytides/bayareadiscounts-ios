/**
 * Responsive Layout Hook
 * Provides device-aware layout utilities for iPad support
 */

import { useWindowDimensions, Platform, ViewStyle } from 'react-native';

export interface ResponsiveLayout {
  isTablet: boolean;
  isLandscape: boolean;
  numColumns: number;
  horizontalPadding: number;
  cardWidth: number;
  screenWidth: number;
  screenHeight: number;
  cardElevationStyle: ViewStyle;
}

const TABLET_BREAKPOINT = 768;
const CARD_MIN_WIDTH = 320;
const CARD_MAX_WIDTH = 500;

export function useResponsiveLayout(): ResponsiveLayout {
  const { width, height } = useWindowDimensions();

  const isTablet = width >= TABLET_BREAKPOINT;
  const isLandscape = width > height;

  // Calculate number of columns based on screen width
  // Phone: 1 column
  // iPad portrait (~768-834px): 2 columns
  // iPad landscape (~1024-1194px): 3 columns
  // iPad Pro 12.9" landscape (1366px+): 4 columns
  let numColumns = 1;
  if (width >= 1200) {
    numColumns = 4;
  } else if (width >= 1024) {
    numColumns = 3;
  } else if (width >= TABLET_BREAKPOINT) {
    numColumns = 2;
  }

  // Adjust horizontal padding - more padding for larger screens
  let horizontalPadding = 16;
  if (isTablet) {
    horizontalPadding = isLandscape ? 32 : 24;
  }

  // Calculate card width based on available space
  const availableWidth = width - (horizontalPadding * 2);
  const gapWidth = (numColumns - 1) * 16; // 16px gap between cards
  const rawCardWidth = (availableWidth - gapWidth) / numColumns;
  const cardWidth = Math.min(Math.max(rawCardWidth, CARD_MIN_WIDTH), CARD_MAX_WIDTH);

  // Card elevation styling
  const cardElevationStyle: ViewStyle = isTablet
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

  return {
    isTablet,
    isLandscape,
    numColumns,
    horizontalPadding,
    cardWidth,
    screenWidth: width,
    screenHeight: height,
    cardElevationStyle,
  };
}

export default useResponsiveLayout;
