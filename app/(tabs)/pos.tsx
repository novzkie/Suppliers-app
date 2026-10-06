import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  Card,
  Chip,
  HeaderPanel,
  PricePill,
  PrimaryButton,
  QtyStepper,
  Screen,
  SearchBar,
} from '@/components/ui';
import { Font, Palette, Radius } from '@/constants/theme';
import { money, useApp, type Category } from '@/store/app-store';

const FILTERS: ('All' | Category)[] = ['All', 'Produce', 'Dairy', 'Bakery'];

export default function POSScreen() {
  const { products, cartDetailed, cartCount, subtotal, total, addToCart, setQty, checkout } = useApp();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All');

  const visible = useMemo(
    () =>
      products.filter(
        (p) =>
          (filter === 'All' || p.category === filter) &&
          (query === '' || p.name.toLowerCase().includes(query.toLowerCase())),
      ),
    [products, filter, query],
  );

  const onCharge = () => {
    const sale = checkout();
    if (!sale) {
      Alert.alert('Cart is empty', 'Add products to charge a customer.');
      return;
    }
    Alert.alert('Payment complete', `Charged ${money(sale.total)}. Stock updated.`);
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <HeaderPanel title="Point of Sale">
          <SearchBar value={query} onChange={setQuery} placeholder="Search products or scan barcode" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
            {FILTERS.map((f) => (
              <Chip key={f} label={f} active={filter === f} onPress={() => setFilter(f)} />
            ))}
          </ScrollView>
        </HeaderPanel>

        <FlatList
          data={visible}
          numColumns={3}
          keyExtractor={(p) => p.id}
          scrollEnabled={false}
          columnWrapperStyle={styles.gridRow}
          ItemSeparatorComponent={() => <View style={styles.gridGap} />}
          renderItem={({ item: p }) => (
            <Pressable
              onPress={() => addToCart(p.id)}
              style={[styles.product, p.stock === 0 && styles.productEmpty]}>
              <View style={styles.productIcon}>
                <MaterialIcons name="shopping-cart" size={20} color={Palette.ink} />
              </View>
              <Text style={styles.productName} numberOfLines={2}>
                {p.name}
              </Text>
              <Text style={styles.productCat}>
                {p.category}
                {p.stock === 0 ? ' · Out' : ''}
              </Text>
            </Pressable>
          )}
        />

        <Card>
          <View style={styles.cartHead}>
            <Text style={styles.cartTitle}>Cart</Text>
            <Text style={styles.cartCount}>
              {cartCount} item{cartCount === 1 ? '' : 's'}
            </Text>
          </View>
          {cartDetailed.length === 0 ? (
            <Text style={styles.muted}>Tap a product above to add it to the cart.</Text>
          ) : (
            cartDetailed.map((l) => (
              <View key={l.productId} style={styles.line}>
                <View style={styles.lineIcon}>
                  <MaterialIcons name="shopping-cart" size={18} color={Palette.ink} />
                </View>
                <View style={styles.lineText}>
                  <Text style={styles.lineName}>{l.name}</Text>
                  <Text style={styles.lineSub}>{l.supplierName}</Text>
                </View>
                <PricePill value={money(l.price)} />
                <QtyStepper qty={l.qty} onChange={(q) => setQty(l.productId, q)} />
              </View>
            ))
          )}
          <View style={styles.totals}>
            <View style={styles.totalRow}>
              <Text style={styles.muted}>Subtotal</Text>
              <PricePill value={money(subtotal)} />
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.muted}>Total</Text>
              <PricePill value={money(total)} />
            </View>
          </View>
          <PrimaryButton label={`Charge ${money(total)}`} onPress={onCharge} />
        </Card>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 12,
    paddingBottom: 24,
    gap: 8,
  },
  chips: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 0,
  },
  gridRow: {
    gap: 8,
  },
  gridGap: {
    height: 12,
  },
  product: {
    flex: 1,
    backgroundColor: Palette.white,
    borderWidth: 1,
    borderColor: Palette.cardBorder,
    borderRadius: Radius.md,
    padding: 12,
    gap: 8,
  },
  productEmpty: {
    opacity: 0.55,
  },
  productIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Palette.tealSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productName: {
    color: Palette.ink,
    fontFamily: Font.bold,
    fontSize: 12,
    minHeight: 32,
  },
  productCat: {
    color: Palette.muted,
    fontFamily: Font.regular,
    fontSize: 12,
  },
  cartHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cartTitle: {
    color: Palette.ink,
    fontFamily: Font.bold,
    fontSize: 16,
  },
  muted: {
    color: Palette.muted,
    fontFamily: Font.regular,
    fontSize: 14,
  },
  cartCount: {
    color: Palette.muted,
    fontFamily: Font.semiBold,
    fontSize: 12,
  },
  line: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 6,
    backgroundColor: Palette.pill,
    borderRadius: 14,
  },
  lineIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Palette.tealSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lineText: {
    flex: 1,
  },
  lineName: {
    color: Palette.ink,
    fontFamily: Font.bold,
    fontSize: 14,
  },
  lineSub: {
    color: Palette.muted,
    fontFamily: Font.regular,
    fontSize: 12,
  },
  totals: {
    gap: 6,
    marginVertical: 6,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
