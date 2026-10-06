import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  Card,
  Chip,
  HeaderPanel,
  PricePill,
  PrimaryButton,
  Screen,
  SearchBar,
} from '@/components/ui';
import { Font, Palette, Radius } from '@/constants/theme';
import { money, useApp, type Category } from '@/store/app-store';

const FILTERS: ('All' | Category)[] = ['All', 'Produce', 'Dairy', 'Bakery'];

export default function InventoryScreen() {
  const { products, unitsOnHand, lowStockCount, outOfStockCount, reorderLowStock } = useApp();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All');

  const visible = useMemo(
    () =>
      products.filter(
        (p) =>
          (filter === 'All' || p.category === filter) &&
          (query === '' ||
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.supplierName.toLowerCase().includes(query.toLowerCase())),
      ),
    [products, filter, query],
  );

  const onReorder = () => {
    const count = reorderLowStock();
    Alert.alert('Reorder placed', `${count} low-stock products restocked to 24 units.`);
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <HeaderPanel title="Inventory" subtitle="Track stock levels, categories, and supplier coverage.">
          <SearchBar value={query} onChange={setQuery} placeholder="Search products or suppliers" />
        </HeaderPanel>

        <View style={styles.summaryHead}>
          <Text style={styles.summaryTitle}>Stock summary</Text>
          <Text style={styles.muted}>Updated today</Text>
        </View>
        <View style={styles.summaryRow}>
          {[
            { label: 'In stock', value: String(unitsOnHand) },
            { label: 'Low stock', value: String(lowStockCount) },
            { label: 'Out', value: String(outOfStockCount) },
          ].map((s) => (
            <View key={s.label} style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>{s.label}</Text>
              <Text style={styles.summaryValue}>{s.value}</Text>
            </View>
          ))}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {FILTERS.map((f) => (
            <Chip key={f} label={f} active={filter === f} onPress={() => setFilter(f)} />
          ))}
        </ScrollView>

        {visible.map((p) => (
          <Card key={p.id} style={p.stock === 0 ? styles.outCard : undefined}>
            <View style={styles.row}>
              <View style={styles.icon}>
                <MaterialIcons name="inventory" size={20} color={Palette.ink} />
              </View>
              <View style={styles.rowText}>
                <Text style={styles.rowName}>{p.name}</Text>
                <Text style={styles.muted}>{p.supplierName}</Text>
              </View>
              <PricePill value={money(p.price)} />
            </View>
            <View style={[styles.row, styles.statusRow]}>
              <View style={styles.statusSpacer} />
              {p.stock === 0 ? (
                <View style={styles.outRow}>
                  <View style={styles.dot} />
                  <Text style={styles.outText}>Out of stock</Text>
                </View>
              ) : (
                <View style={styles.qtyPill}>
                  <Text style={styles.qtyText}>Qty {p.stock}</Text>
                </View>
              )}
            </View>
          </Card>
        ))}

        <PrimaryButton label="Reorder low stock" onPress={onReorder} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 12,
    paddingBottom: 24,
    gap: 10,
  },
  summaryHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryTitle: {
    color: Palette.ink,
    fontFamily: Font.bold,
    fontSize: 18,
  },
  muted: {
    color: Palette.muted,
    fontFamily: Font.regular,
    fontSize: 12,
  },
  summaryLabel: {
    color: Palette.muted,
    fontFamily: Font.semiBold,
    fontSize: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
  },
  summaryBox: {
    flex: 1,
    backgroundColor: Palette.white,
    borderWidth: 1,
    borderColor: Palette.cardBorder,
    borderRadius: Radius.md,
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 4,
  },
  summaryValue: {
    color: Palette.ink,
    fontFamily: Font.bold,
    fontSize: 18,
  },
  chips: {
    flexDirection: 'row',
    gap: 8,
  },
  outCard: {
    borderStyle: 'dashed',
    borderColor: Palette.cardBorder,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Palette.tealSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: {
    flex: 1,
  },
  rowName: {
    color: Palette.ink,
    fontFamily: Font.bold,
    fontSize: 14,
  },
  statusRow: {
    marginTop: 8,
  },
  statusSpacer: {
    flex: 1,
  },
  outRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Palette.pill,
    borderRadius: Radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Palette.dotOrange,
  },
  outText: {
    color: Palette.ink,
    fontFamily: Font.semiBold,
    fontSize: 11,
  },
  qtyPill: {
    backgroundColor: Palette.pill,
    borderRadius: Radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  qtyText: {
    color: Palette.muted,
    fontFamily: Font.semiBold,
    fontSize: 12,
  },
});
