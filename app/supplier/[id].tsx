import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card, PricePill, Screen } from '@/components/ui';
import { Font, Palette, Radius } from '@/constants/theme';
import { money, useApp } from '@/store/app-store';

export default function SupplierDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { supplierById, products, invoices } = useApp();
  const supplier = supplierById(id ?? '');
  const supplied = products.filter((p) => p.supplierId === id);
  const outstanding = invoices.filter((i) => i.supplierId === id && !i.paid);

  if (!supplier) {
    return (
      <Screen>
        <View style={styles.center}>
          <Text style={styles.title}>Supplier not found</Text>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>Go back</Text>
          </Pressable>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={18} color={Palette.ink} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        <Card>
          <View style={styles.head}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{supplier.initials}</Text>
            </View>
            <View style={styles.headText}>
              <Text style={styles.title}>{supplier.name}</Text>
              <Text style={styles.muted}>{supplier.tagline}</Text>
            </View>
            <View style={styles.statusRow}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>{supplier.status}</Text>
            </View>
          </View>
          <View style={styles.miniRow}>
            <View style={styles.miniBox}>
              <Text style={styles.muted}>Next delivery</Text>
              <Text style={styles.miniValue}>{supplier.nextDelivery}</Text>
            </View>
            <View style={styles.miniBox}>
              <Text style={styles.muted}>Open orders</Text>
              <Text style={styles.miniValue}>{supplier.openOrders}</Text>
            </View>
          </View>
          <View style={styles.footRow}>
            <Text style={styles.muted}>Last invoice: {supplier.lastInvoice}</Text>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Products ({supplied.length})</Text>
        {supplied.map((p) => (
          <Card key={p.id}>
            <View style={styles.head}>
              <View style={styles.headText}>
                <Text style={styles.rowName}>{p.name}</Text>
                <Text style={styles.muted}>
                  {p.category} · {p.stock === 0 ? 'Out of stock' : `Qty ${p.stock}`}
                </Text>
              </View>
              <PricePill value={money(p.price)} />
            </View>
          </Card>
        ))}

        <Text style={styles.sectionTitle}>Outstanding invoices ({outstanding.length})</Text>
        {outstanding.length === 0 ? (
          <Card>
            <Text style={styles.muted}>Nothing outstanding for this supplier.</Text>
          </Card>
        ) : (
          outstanding.map((inv) => (
            <Card key={inv.id}>
              <View style={styles.head}>
                <View style={styles.headText}>
                  <Text style={styles.rowName}>Invoice {inv.invoiceNo}</Text>
                  <Text style={styles.muted}>Due {inv.dueDate}</Text>
                </View>
                <PricePill value={money(inv.amount)} />
              </View>
            </Card>
          ))
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 12,
    paddingBottom: 24,
    gap: 12,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Palette.pill,
    borderRadius: Radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  backText: {
    color: Palette.ink,
    fontFamily: Font.bold,
    fontSize: 13,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Palette.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: Palette.white,
    fontFamily: Font.extraBold,
    fontSize: 18,
  },
  headText: {
    flex: 1,
  },
  title: {
    color: Palette.ink,
    fontFamily: Font.extraBold,
    fontSize: 20,
  },
  rowName: {
    color: Palette.ink,
    fontFamily: Font.extraBold,
    fontSize: 15,
  },
  muted: {
    color: Palette.muted,
    fontFamily: Font.semiBold,
    fontSize: 13,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Palette.dotOrange,
  },
  statusText: {
    color: Palette.ink,
    fontFamily: Font.bold,
    fontSize: 12,
  },
  miniRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  miniBox: {
    flex: 1,
    backgroundColor: Palette.pill,
    borderRadius: Radius.md,
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 2,
  },
  miniValue: {
    color: Palette.ink,
    fontFamily: Font.extraBold,
    fontSize: 15,
  },
  footRow: {
    marginTop: 12,
  },
  sectionTitle: {
    color: Palette.ink,
    fontFamily: Font.extraBold,
    fontSize: 19,
  },
});
