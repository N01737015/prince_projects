import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Text } from 'react-native';

export default function ProgressBar({ progress, min = 0, max = 100, barColor = '#8d6e63', backColor = '#efebe9', label = '' }) {
  const animatedValue = useRef(new Animated.Value(min)).current;

  useEffect(() => {
    let safeProgress = progress;
    if (safeProgress < min) safeProgress = min;
    if (safeProgress > max) safeProgress = max;

    Animated.timing(animatedValue, {
      toValue: safeProgress,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [progress, min, max, animatedValue]);

  const widthInterpolate = animatedValue.interpolate({
    inputRange: [min, max],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.container, { backgroundColor: backColor }]}>
        <Animated.View style={[styles.bar, { width: widthInterpolate, backgroundColor: barColor }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginVertical: 10,
  },
  label: {
    marginBottom: 6,
    fontWeight: '600',
    color: '#4e342e',
  },
  container: {
    width: '100%',
    height: 24,
    borderRadius: 12,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 12,
  },
});