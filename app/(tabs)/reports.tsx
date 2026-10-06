import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { ScrollView, Share, StyleSheet, Text, View } from 'react-native';

import { Card, HeaderPanel, PricePill, PrimaryButton, Screen } from '@/components/ui';
import { Font, Palette, Radius } from '@/constants/theme';
import { money, useApp } from '@/store/app-store';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;
const BASE_REVENUE = 12480;
const BASE_ORDERS = 186;
const REVENUE_BARS = [40, 62, 70, 55, 78, 66, 84];
const ORDER_BARS = [18, 24, 22, 20, 28, 25, 30];
const MAX_BAR = 84;

const TOP_SUPPLIERS = [
  { name: 'Fresh Foods Supply', category: 'Produce', amount: 4820 },
  { name: 'Northside Bakery', category: 'Bakery', amount: 3150 },
  { name: 'DairyCo', category: 'Dairy', amount: 2940 },
];

export default function ReportsScreen() {
  const { sales } = useApp();
  const liveRevenue = sales.reduce((sum, s) => sum + s.total, 0);
  const revenue = BASE_REVENUE + liveRevenue;
  const orders = BASE_ORDERS + sales.length;

  const onExport = () => {
    const lines = [
      'Suppliers App — Weekly Report',
      `Revenue: ${money(revenue)}`,
      `Orders: ${orders}`,
      ...TOP_SUPPLIERS.map((s, i) => `${i + 1}. ${s.name} (${s.category}): ${money(s.amount)}`),
    ];
    Share.share({ message: lines.join('\n') }).catch(() => {});
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <HeaderPanel
          title="Reports"
          subtitle="Track revenue, orders, and supplier performance."
          brandLine="Reports">
          <View style={styles.period}>
            <MaterialIcons name="calendar-today" size={16} color={Palette.ink} />
            <Text style={styles.periodText}>This week</Text>
            <MaterialIcons name="keyboard-arrow-down" size={16} color={Palette.ink} />
          </View>
        </HeaderPanel>

        <View style={styles.kpiRow}>
          <Text style={styles.kpiLabel}>Revenue</Text>
          <PricePill value={money(revenue)} />
        </View>
        <View style={styles.kpiRow}>
          <Text style={styles.kpiLabel}>Orders</Text>
          <View style={styles.ordersPill}>
            <Text style={styles.ordersPillText}>{orders}</Text>
          </View>
        </View>

        <Card>
          <View style={styles.trendHead}>
            <Text style={styles.cardTitle}>Sales trend</Text>
            <Text style={styles.muted}>This week</Text>
          </View>
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, styles.revenueDot]} />
              <Text style={styles.muted}>Revenue</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, styles.ordersDot]} />
              <Text style={styles.muted}>Orders</Text>
            </View>
          </View>
          <View style={styles.chart}>
            {DAYS.map((d, i) => (
              <View key={d} style={styles.barCol}>
                <View
                  style={[
                    styles.bar,
                    styles.revenueBar,
                    { height: Math.max(8, (REVENUE_BARS[i] / MAX_BAR) * 72) },
                  ]}
                />
                <View
                  style={[
                    styles.bar,
                    styles.orderBar,
                    { height: Math.max(6, (ORDER_BARS[i] / MAX_BAR) * 72) },
                  ]}
                />
                <Text style={styles.dayLabel}>{d}</Text>
              </View>
            ))}
          </View>
        </Card>

        <Card>
          <View style={styles.trendHead}>
            <Text style={styles.cardTitle}>Top suppliers</Text>
            <Text style={styles.muted}>Ranking</Text>
          </View>
          {TOP_SUPPLIERS.map((s) => (
            <View key={s.name} style={styles.supplierRow}>
              <View style={styles.supplierIcon}>
                <MaterialIcons name="local-shipping" size={20} color={Palette.ink} />
              </View>
              <View style={styles.supplierText}>
                <Text style={styles.supplierName}>{s.name}</Text>
                <Text style={styles.muted}>{s.category}</Text>
              </View>
              <PricePill value={money(s.amount)} />
            </View>
          ))}
        </Card>

        <PrimaryButton label="Export report" onPress={onExport} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 10,
    paddingBottom: 24,
    gap: 6,
  },
  period: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Palette.white,
    borderWidth: 1,
    borderColor: Palette.cardBorder,
    borderRadius: Radius.md,
    paddingHorizontal: 12,
    height: 48,
    marginTop: 8,
  },
  periodText: {
    flex: 1,
    color: Palette.ink,
    fontFamily: Font.bold,
    fontSize: 14,
  },
  kpiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  kpiLabel: {
    color: Palette.muted,
    fontFamily: Font.regular,
    fontSize: 14,
  },
  ordersPill: {
    backgroundColor: Palette.tealSoft,
    borderRadius: Radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  ordersPillText: {
    color: Palette.ink,
    fontFamily: Font.bold,
    fontSize: 12,
  },
  trendHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  cardTitle: {
    color: Palette.ink,
    fontFamily: Font.bold,
    fontSize: 16,
  },
  muted: {
    color: Palette.muted,
    fontFamily: Font.semiBold,
    fontSize: 12,
  },
  legend: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 6,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  revenueDot: {
    backgroundColor: Palette.teal,
  },
  ordersDot: {
    backgroundColor: '#80A1D4',
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Palette.pill,
    borderRadius: Radius.md,
    padding: 8,
  },
  barCol: {
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  bar: {
    width: '72%',
    borderRadius: 8,
  },
  revenueBar: {
    backgroundColor: Palette.teal,
  },
  orderBar: {
    backgroundColor: '#80A1D4',
  },
  dayLabel: {
    color: Palette.muted,
    fontFamily: Font.regular,
    fontSize: 12,
    marginTop: 2,
  },
  supplierRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: Palette.pill,
    borderRadius: 14,
  },
  supplierIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Palette.tealSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  supplierText: {
    flex: 1,
  },
  supplierName: {
    color: Palette.ink,
    fontFamily: Font.bold,
    fontSize: 14,
  },
});
