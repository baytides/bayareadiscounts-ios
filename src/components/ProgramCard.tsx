/**
 * Program Card Component
 * Displays program summary in a card format
 */

import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, AccessibilityInfo } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Program } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useResponsiveLayout } from '../hooks/useResponsiveLayout';

// Helper to safely trigger haptics (respects reduce motion)
const triggerHaptic = async () => {
  const isReduceMotionEnabled = await AccessibilityInfo.isReduceMotionEnabled();
  if (!isReduceMotionEnabled) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
};

interface ProgramCardProps {
  program: Program;
  onPress: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

const CATEGORY_ICONS: { [key: string]: string } = {
  'arts-culture': '🎨',
  'education': '📚',
  'food': '🍎',
  'health-wellness': '💊',
  'housing-utilities': '🏠',
  'recreation': '⚽',
  'transportation': '🚌',
  'other': '📋',
};

// Format eligibility tag to Title Case
const formatEligibilityTag = (tag: string): string => {
  return tag
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

function ProgramCard({
  program,
  onPress,
  isFavorite = false,
  onToggleFavorite,
}: ProgramCardProps) {
  const { colors, isDark } = useTheme();
  const { isTablet, isVisionOS, cardElevationStyle, cardBorderStyle } = useResponsiveLayout();
  const categoryIcon = CATEGORY_ICONS[program.category] || '📋';
  // Display city if available, otherwise fall back to areas (county)
  const areaText = program.city || program.areas.join(', ');

  // Larger border radius for tablets and visionOS for a more modern look
  const borderRadius = isVisionOS ? 24 : isTablet ? 16 : 12;

  // For visionOS, wrap the card in an outer container for layered shadow effect
  const cardContent = (
    <>
      {/* visionOS: Inner highlight layer for glass depth */}
      {isVisionOS && (
        <View style={styles.visionOSInnerGlow} pointerEvents="none" />
      )}

      <View style={styles.header}>
        <View style={styles.titleRow}>
          {/* visionOS: Icon floats above with its own shadow */}
          <View style={isVisionOS ? styles.iconContainerVisionOS : undefined}>
            <Text style={[styles.icon, isVisionOS && styles.iconVisionOS]} accessible={false}>{categoryIcon}</Text>
          </View>
          <Text style={[styles.title, { color: colors.text }, isVisionOS && styles.titleVisionOS]} numberOfLines={2} allowFontScaling={true} maxFontSizeMultiplier={1.5}>
            {program.name}
          </Text>
        </View>
        {onToggleFavorite && (
          <TouchableOpacity
            onPress={() => {
              triggerHaptic();
              onToggleFavorite();
            }}
            style={[styles.favoriteButton, isVisionOS && styles.favoriteButtonVisionOS]}
            accessibilityRole="button"
            accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            accessibilityState={{ checked: isFavorite }}
            accessibilityHint={isFavorite ? 'Double-tap to remove this program from your saved list' : 'Double-tap to save this program'}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={[styles.favoriteIcon, isVisionOS && styles.favoriteIconVisionOS]} accessible={false}>{isFavorite ? '⭐' : '☆'}</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={[styles.description, { color: colors.textSecondary }, isVisionOS && styles.descriptionVisionOS]} numberOfLines={3} allowFontScaling={true} maxFontSizeMultiplier={1.5}>
        {program.description}
      </Text>

      {program.eligibility.length > 0 && (
        <View style={[styles.eligibilityContainer, isVisionOS && styles.eligibilityContainerVisionOS]}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Eligibility:</Text>
          <View style={styles.tags}>
            {program.eligibility.slice(0, 2).map((tag) => (
              <View
                key={tag}
                style={[
                  styles.tag,
                  { backgroundColor: isDark ? '#1e3a5f' : '#dbeafe' },
                  // 3D effect for tags on visionOS - they float above the card
                  isVisionOS && styles.tag3D,
                ]}
              >
                <Text style={[styles.tagText, { color: isDark ? '#93c5fd' : '#1e40af' }]}>{formatEligibilityTag(tag)}</Text>
              </View>
            ))}
            {program.eligibility.length > 2 && (
              <Text style={[styles.moreText, { color: colors.textSecondary }]}>+{program.eligibility.length - 2} more</Text>
            )}
          </View>
        </View>
      )}

      {areaText && (
        <View style={[styles.areaContainer, isVisionOS && styles.areaContainerVisionOS]}>
          <Text style={styles.areaIcon}>📍</Text>
          <Text style={[styles.areaText, { color: colors.textSecondary }]} numberOfLines={1}>
            {areaText}
          </Text>
        </View>
      )}
    </>
  );

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: colors.cardBackground, borderRadius },
        cardElevationStyle,
        cardBorderStyle,
        // Extra styling for visionOS
        isVisionOS && styles.cardVisionOS,
      ]}
      onPress={onPress}
      activeOpacity={isVisionOS ? 0.85 : 0.7}
      accessibilityRole="button"
      accessibilityLabel={`${program.name}. ${program.description}`}
      accessibilityHint="Double-tap to view full program details"
    >
      {cardContent}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    // Base shadow - will be overridden by cardElevationStyle
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardVisionOS: {
    padding: 28,
    marginVertical: 16,
    marginHorizontal: 20,
    // Frosted glass effect - slightly translucent
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    // Extra room for the floating effect
    overflow: 'visible',
  },
  // Inner glow layer that sits at the top of the card for depth
  visionOSInnerGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 80,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    // Gradient-like glow from top (simulated with backgroundColor)
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    // This creates a soft fade effect
    opacity: 0.6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    fontSize: 24,
    marginRight: 8,
  },
  iconVisionOS: {
    fontSize: 32,
    // Text shadow for depth
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  iconContainerVisionOS: {
    // Icon container floats slightly
    marginRight: 12,
    // Subtle lift effect
    transform: [{ translateY: -2 }],
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  titleVisionOS: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.3,
    // Subtle text shadow for depth
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  favoriteButton: {
    padding: 8,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButtonVisionOS: {
    // Floating button effect
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 22,
    minWidth: 48,
    minHeight: 48,
    // Shadow to make it pop
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    // Beveled border
    borderWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.8)',
    borderLeftColor: 'rgba(255, 255, 255, 0.6)',
    borderRightColor: 'rgba(0, 0, 0, 0.1)',
    borderBottomColor: 'rgba(0, 0, 0, 0.15)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  favoriteIcon: {
    fontSize: 24,
  },
  favoriteIconVisionOS: {
    fontSize: 28,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  description: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  descriptionVisionOS: {
    fontSize: 17,
    lineHeight: 26,
    marginBottom: 16,
  },
  eligibilityContainer: {
    marginBottom: 8,
  },
  eligibilityContainerVisionOS: {
    marginBottom: 12,
    // Slight inset effect - like a recessed panel
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    marginHorizontal: -12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 4,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tag3D: {
    // visionOS: Floating pill that looks like a physical button
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    // Strong shadow for floating effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
    // Beveled glass border
    borderWidth: 1.5,
    borderTopColor: 'rgba(255, 255, 255, 0.9)',
    borderLeftColor: 'rgba(255, 255, 255, 0.7)',
    borderRightColor: 'rgba(0, 0, 0, 0.1)',
    borderBottomColor: 'rgba(0, 0, 0, 0.15)',
    borderColor: 'rgba(255, 255, 255, 0.5)',
    // Slight background tint for depth
    backgroundColor: 'rgba(219, 234, 254, 0.95)',
  },
  tagText: {
    fontSize: 12,
    color: '#1e40af',
  },
  tagTextVisionOS: {
    fontSize: 15,
    fontWeight: '600',
  },
  moreText: {
    fontSize: 12,
    color: '#6b7280',
    alignSelf: 'center',
  },
  areaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  areaContainerVisionOS: {
    marginTop: 16,
    // Floating location badge
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    alignSelf: 'flex-start',
    // Shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    // Beveled border
    borderWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.8)',
    borderBottomColor: 'rgba(0, 0, 0, 0.08)',
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  areaIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  areaText: {
    fontSize: 13,
    color: '#6b7280',
    flex: 1,
  },
});

export default memo(ProgramCard);
