import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IconSymbol, type IconSymbolName } from '@/components/ui/icon-symbol';
import { Font, Palette, Radius } from '@/constants/theme';
import { useApp } from '@/store/app-store';

export function Screen({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      {children}
    </SafeAreaView>
  );
}

function BrandRow({ line = 'Warehouse Admin' }: { line?: string }) {
  const { resetDemo } = useApp();
  return (
    <View style={styles.brandRow}>
      <Pressable
        accessibilityLabel="Menu"
        onPress={() =>
          Alert.alert('Menu', 'Demo controls', [
            { text: 'Reset demo data', onPress: () => resetDemo() },
            { text: 'Close', style: 'cancel' },
          ])
        }
        style={styles.menuButton}>
        <MaterialIcons name="menu" size={22} color={Palette.ink} />
      </Pressable>
      <View style={styles.brandRight}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>NF</Text>
        </View>
        <View>
          <Text style={styles.brandTitle}>Suppliers App</Text>
          <Text style={styles.brandSubtitle}>{line}</Text>
        </View>
      </View>
    </View>
  );
}

export function HeaderPanel({
  title,
  subtitle,
  brandLine,
  children,
}: {
  title: string;
  subtitle?: string;
  brandLine?: string;
  children?: React.ReactNode;
}) {
  return (
    <View style={styles.header}>
      <BrandRow line={brandLine} />
      <Text style={styles.headerTitle}>{title}</Text>
      {subtitle ? <Text style={styles.headerSubtitle}>{subtitle}</Text> : null}
      {children}
    </View>
  );
}

export function SearchBar({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <View style={styles.search}>
      <MaterialIcons name="search" size={20} color={Palette.muted} />
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={Palette.muted}
        style={styles.searchInput}
      />
    </View>
  );
}

export function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

export function PricePill({ value }: { value: string }) {
  return (
    <View style={styles.pricePill}>
      <Text style={styles.pricePillText}>{value}</Text>
    </View>
  );
}

export function PrimaryButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.primaryButton}>
      <Text style={styles.primaryButtonText}>{label}</Text>
      <MaterialIcons name="arrow-forward" size={20} color={Palette.ink} />
    </Pressable>
  );
}

export function QtyStepper({
  qty,
  onChange,
}: {
  qty: number;
  onChange: (qty: number) => void;
}) {
  return (
    <View style={styles.stepper}>
      <Pressable
        accessibilityLabel="Decrease quantity"
        onPress={() => onChange(qty - 1)}
        style={styles.stepperMinus}>
        <MaterialIcons name="remove" size={16} color={Palette.ink} />
      </Pressable>
      <Text style={styles.stepperQty}>{qty}</Text>
      <Pressable
        accessibilityLabel="Increase quantity"
        onPress={() => onChange(qty + 1)}
        style={styles.stepperPlus}>
        <MaterialIcons name="add" size={16} color={Palette.white} />
      </Pressable>
    </View>
  );
}

export function TabIcon({ name, focused }: { name: IconSymbolName; focused: boolean }) {
  return (
    <View style={[styles.tabCircle, focused && styles.tabCircleActive]}>
      <IconSymbol name={name} size={24} color={Palette.ink} />
    </View>
  );
}

export function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action ? (
        <Pressable onPress={onAction}>
          <Text style={styles.sectionAction}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function Card({ children, style }: { children: React.ReactNode; style?: object }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Palette.screen,
  },
  header: {
    backgroundColor: Palette.header,
    borderRadius: Radius.lg,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginHorizontal: 12,
    marginTop: 8,
    gap: 8,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Palette.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Palette.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: Palette.ink,
    fontFamily: Font.bold,
    fontSize: 14,
  },
  brandTitle: {
    color: Palette.ink,
    fontFamily: Font.bold,
    fontSize: 18,
    lineHeight: 22,
  },
  brandSubtitle: {
    color: Palette.ink,
    opacity: 0.7,
    fontFamily: Font.regular,
    fontSize: 12,
  },
  headerTitle: {
    color: Palette.ink,
    fontFamily: Font.bold,
    fontSize: 24,
  },
  headerSubtitle: {
    color: Palette.ink,
    opacity: 0.7,
    fontFamily: Font.regular,
    fontSize: 14,
    marginBottom: 2,
  },
  search: {
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
  searchInput: {
    flex: 1,
    color: Palette.ink,
    fontFamily: Font.regular,
    fontSize: 14,
  },
  chip: {
    backgroundColor: Palette.white,
    borderWidth: 1,
    borderColor: Palette.cardBorder,
    borderRadius: Radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipActive: {
    backgroundColor: Palette.teal,
    borderColor: Palette.teal,
  },
  chipText: {
    color: Palette.muted,
    fontFamily: Font.semiBold,
    fontSize: 12,
  },
  chipTextActive: {
    color: Palette.ink,
    fontFamily: Font.bold,
  },
  pricePill: {
    backgroundColor: Palette.coral,
    borderRadius: Radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  pricePillText: {
    color: Palette.ink,
    fontFamily: Font.bold,
    fontSize: 12,
  },
  primaryButton: {
    backgroundColor: Palette.coral,
    borderRadius: Radius.md,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: {
    color: Palette.ink,
    fontFamily: Font.bold,
    fontSize: 14,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepperMinus: {
    width: 24,
    height: 24,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Palette.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.white,
  },
  stepperQty: {
    minWidth: 14,
    textAlign: 'center',
    color: Palette.ink,
    fontFamily: Font.bold,
    fontSize: 14,
  },
  stepperPlus: {
    width: 24,
    height: 24,
    borderRadius: 14,
    backgroundColor: Palette.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabCircleActive: {
    backgroundColor: Palette.teal,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: Palette.ink,
    fontFamily: Font.bold,
    fontSize: 18,
  },
  sectionAction: {
    color: Palette.muted,
    fontFamily: Font.semiBold,
    fontSize: 12,
  },
  card: {
    backgroundColor: Palette.white,
    borderWidth: 1,
    borderColor: Palette.cardBorder,
    borderRadius: Radius.lg,
    padding: 12,
  },
});
