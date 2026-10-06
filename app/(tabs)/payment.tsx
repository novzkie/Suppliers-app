import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card, HeaderPanel, PricePill, PrimaryButton, Screen } from '@/components/ui';
import { Font, Palette, Radius } from '@/constants/theme';
import { money, useApp, type PayMethod } from '@/store/app-store';

const METHODS: { key: PayMethod; icon: 'account-balance' | 'credit-card' | 'payments' }[] = [
  { key: 'Bank transfer', icon: 'account-balance' },
  { key: 'Card', icon: 'credit-card' },
  { key: 'Cash', icon: 'payments' },
];

export default function PaymentScreen() {
  const { unpaidInvoices, invoices, payInvoice } = useApp();
  const [method, setMethod] = useState<PayMethod>('Bank transfer');
  const current = unpaidInvoices[0];
  const paidCount = invoices.filter((i) => i.paid).length;

  const onPay = () => {
    if (!current) return;
    payInvoice(current.id, method);
    Alert.alert('Payment sent', `${money(current.amount)} to ${current.supplierName} via ${method}.`);
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <HeaderPanel title="Payment" brandLine="Payment">
          {current ? (
            <View style={styles.invoiceCard}>
              <View style={styles.invoiceHead}>
                <View style={styles.invoiceIcon}>
                  <MaterialIcons name="local-shipping" size={22} color={Palette.ink} />
                </View>
                <View style={styles.invoiceText}>
                  <Text style={styles.invoiceName}>{current.supplierName}</Text>
                  <Text style={styles.muted}>Invoice {current.invoiceNo}</Text>
                </View>
                <PricePill value={money(current.amount)} />
              </View>
              <View style={styles.miniRow}>
                <View style={styles.miniBox}>
                  <Text style={styles.muted}>Due date</Text>
                  <Text style={styles.miniValue}>{current.dueDate}</Text>
                </View>
                <View style={styles.miniBox}>
                  <Text style={styles.muted}>Invoice</Text>
                  <Text style={styles.miniValue}>{current.invoiceNo}</Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.invoiceCard}>
              <Text style={styles.invoiceName}>All caught up 🎉</Text>
              <Text style={styles.muted}>
                {paidCount} invoice{paidCount === 1 ? '' : 's'} paid. No outstanding payables.
              </Text>
            </View>
          )}
        </HeaderPanel>

        {current ? (
          <>
            <View style={styles.methodHead}>
              <Text style={styles.sectionTitle}>Payment method</Text>
              <Text style={styles.selectOne}>Select one</Text>
            </View>
            {METHODS.map((m) => {
              const selected = method === m.key;
              return (
                <Pressable key={m.key} onPress={() => setMethod(m.key)} style={styles.methodRow}>
                  <View style={styles.methodIcon}>
                    <MaterialIcons name={m.icon} size={20} color={Palette.ink} />
                  </View>
                  <Text style={styles.methodLabel}>{m.key}</Text>
                  <View style={[styles.radio, selected && styles.radioSelected]}>
                    {selected ? <View style={styles.radioDot} /> : null}
                  </View>
                </Pressable>
              );
            })}

            <Card>
              <View style={styles.totalRow}>
                <Text style={styles.muted}>Subtotal</Text>
                <PricePill value={money(current.amount)} />
              </View>
              <View style={[styles.totalRow, styles.totalGap]}>
                <Text style={styles.muted}>Total</Text>
                <PricePill value={money(current.amount)} />
              </View>
            </Card>

            <PrimaryButton label="Pay now" onPress={onPay} />
          </>
        ) : null}
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
  invoiceCard: {
    backgroundColor: Palette.white,
    borderWidth: 1,
    borderColor: Palette.cardBorder,
    borderRadius: Radius.lg,
    padding: 8,
    marginTop: 0,
    gap: 6,
  },
  invoiceHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  invoiceIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Palette.tealSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  invoiceText: {
    flex: 1,
  },
  invoiceName: {
    color: Palette.ink,
    fontFamily: Font.bold,
    fontSize: 16,
  },
  muted: {
    color: Palette.muted,
    fontFamily: Font.regular,
    fontSize: 12,
  },
  selectOne: {
    color: Palette.muted,
    fontFamily: Font.semiBold,
    fontSize: 12,
  },
  miniRow: {
    flexDirection: 'row',
    gap: 12,
  },
  miniBox: {
    flex: 1,
    backgroundColor: Palette.pill,
    borderRadius: 14,
    padding: 6,
    gap: 4,
  },
  miniValue: {
    color: Palette.ink,
    fontFamily: Font.bold,
    fontSize: 14,
  },
  methodHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: Palette.ink,
    fontFamily: Font.bold,
    fontSize: 18,
  },
  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Palette.white,
    borderWidth: 1,
    borderColor: Palette.cardBorder,
    borderRadius: Radius.md,
    padding: 8,
  },
  methodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Palette.tealSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodLabel: {
    flex: 1,
    color: Palette.ink,
    fontFamily: Font.bold,
    fontSize: 14,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Palette.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.white,
  },
  radioSelected: {
    borderColor: Palette.teal,
    backgroundColor: Palette.teal,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Palette.teal,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalGap: {
    marginTop: 6,
  },
});
