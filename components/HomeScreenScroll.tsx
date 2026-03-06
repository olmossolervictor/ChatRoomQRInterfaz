import React from 'react';
import { View, ScrollView, StyleSheet, Dimensions, RefreshControl } from 'react-native';

const { width } = Dimensions.get('window');

interface HomeScreenScrollProps {
  width?: number;
  backgroundColor?: string;
  contentBottomPad?: number;
  refreshing?: boolean;
  onRefresh?: () => void;
  pageHpad?: number;
  children: React.ReactNode;
}

export default function HomeScreenScroll({
  width: screenWidth = width,
  backgroundColor = '#f5f5f5',
  contentBottomPad = 0,
  refreshing = false,
  onRefresh,
  pageHpad = 20,
  children,
}: HomeScreenScrollProps) {
  return (
    <View style={[styles.container, { width: screenWidth, backgroundColor }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          {
            paddingHorizontal: pageHpad,
            paddingBottom: contentBottomPad,
          },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          onRefresh ? (
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          ) : undefined
        }
      >
        {children}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
});
