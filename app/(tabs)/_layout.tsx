import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { TabIcon } from '@/components/ui';
import type { IconSymbolName } from '@/components/ui/icon-symbol';
import { Palette, Font } from '@/constants/theme';

function tab(name: IconSymbolName, title: string) {
  return {
    title,
    tabBarIcon: ({ focused }: { focused: boolean }) => <TabIcon name={name} focused={focused} />,
  };
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: Palette.ink,
        tabBarInactiveTintColor: Palette.muted,
        tabBarLabelStyle: styles.label,
        tabBarStyle: styles.bar,
      }}>
      <Tabs.Screen name="index" options={tab('house.fill', 'Home')} />
      <Tabs.Screen name="inventory" options={tab('cube.fill', 'Inventory')} />
      <Tabs.Screen name="pos" options={tab('cart.fill', 'POS')} />
      <Tabs.Screen name="payment" options={tab('creditcard.fill', 'Payment')} />
      <Tabs.Screen name="reports" options={tab('chart.bar.fill', 'Reports')} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bar: {
    borderTopWidth: 1,
    borderTopColor: Palette.cardBorder,
    height: 76,
    paddingTop: 6,
  },
  label: {
    fontFamily: Font.bold,
    fontSize: 11,
  },
});
