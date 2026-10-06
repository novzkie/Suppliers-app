import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export type Category = 'Produce' | 'Dairy' | 'Bakery';

export interface Supplier {
  id: string;
  name: string;
  initials: string;
  tagline: string;
  category: string;
  status: 'Active' | 'Pending';
  nextDelivery: string;
  openOrders: number;
  lastInvoice: string;
}

export interface Product {
  id: string;
  name: string;
  supplierId: string;
  supplierName: string;
  category: Category;
  price: number;
  stock: number;
}

export interface CartLine {
  productId: string;
  qty: number;
}

export interface SaleLine {
  productId: string;
  name: string;
  price: number;
  qty: number;
}

export interface Sale {
  id: string;
  lines: SaleLine[];
  subtotal: number;
  tax: number;
  total: number;
  date: string;
}

export type OrderStatus = 'Pending' | 'In transit' | 'Delivered';

export interface PurchaseOrder {
  id: string;
  supplierName: string;
  amount: number;
  status: OrderStatus;
}

export type PayMethod = 'Bank transfer' | 'Card' | 'Cash';

export interface Invoice {
  id: string;
  supplierId: string;
  supplierName: string;
  invoiceNo: string;
  dueDate: string;
  amount: number;
  paid: boolean;
  method?: PayMethod;
}

interface PersistedState {
  suppliers: Supplier[];
  products: Product[];
  cart: CartLine[];
  sales: Sale[];
  orders: PurchaseOrder[];
  invoices: Invoice[];
}

export const TAX_RATE = 0.0857;
const STORAGE_KEY = 'suppliers-app-state-v1';

function seed(): PersistedState {
  return {
    suppliers: [
      {
        id: 'fresh-foods',
        name: 'Fresh Foods Supply',
        initials: 'FF',
        tagline: 'Primary produce partner',
        category: 'Produce',
        status: 'Active',
        nextDelivery: 'Tue, 6 Oct',
        openOrders: 3,
        lastInvoice: '$1,240',
      },
      {
        id: 'northside',
        name: 'Northside Bakery',
        initials: 'NB',
        tagline: 'Daily bread & pastries',
        category: 'Bakery',
        status: 'Active',
        nextDelivery: 'Wed, 7 Oct',
        openOrders: 1,
        lastInvoice: '$860',
      },
      {
        id: 'dairyco',
        name: 'DairyCo',
        initials: 'DC',
        tagline: 'Milk & dairy essentials',
        category: 'Dairy',
        status: 'Pending',
        nextDelivery: 'Thu, 8 Oct',
        openOrders: 0,
        lastInvoice: '$1,120',
      },
    ],
    products: [
      { id: 'whole-milk', name: 'Whole milk', supplierId: 'dairyco', supplierName: 'DairyCo', category: 'Dairy', price: 12.0, stock: 24 },
      { id: 'whole-wheat', name: 'Whole wheat bread', supplierId: 'northside', supplierName: 'Northside Bakery', category: 'Bakery', price: 2.4, stock: 24 },
      { id: 'avocados', name: 'Avocados', supplierId: 'fresh-foods', supplierName: 'Fresh Foods Supply', category: 'Produce', price: 27.0, stock: 8 },
      { id: 'sourdough', name: 'Sourdough', supplierId: 'northside', supplierName: 'Northside Bakery', category: 'Bakery', price: 24.0, stock: 6 },
      { id: 'cheddar', name: 'Cheddar block', supplierId: 'dairyco', supplierName: 'DairyCo', category: 'Dairy', price: 8.5, stock: 9 },
      { id: 'croissant', name: 'Butter croissant', supplierId: 'northside', supplierName: 'Northside Bakery', category: 'Bakery', price: 3.2, stock: 7 },
      { id: 'bananas', name: 'Bananas', supplierId: 'fresh-foods', supplierName: 'Fresh Foods Supply', category: 'Produce', price: 2.1, stock: 5 },
      { id: 'yogurt', name: 'Greek yogurt', supplierId: 'dairyco', supplierName: 'DairyCo', category: 'Dairy', price: 5.75, stock: 4 },
      { id: 'eggs', name: 'Free-range eggs', supplierId: 'dairyco', supplierName: 'DairyCo', category: 'Dairy', price: 6.4, stock: 10 },
      { id: 'butter', name: 'Salted butter', supplierId: 'dairyco', supplierName: 'DairyCo', category: 'Dairy', price: 4.25, stock: 7 },
      { id: 'oj', name: 'Orange juice', supplierId: 'fresh-foods', supplierName: 'Fresh Foods Supply', category: 'Produce', price: 5.1, stock: 6 },
      { id: 'tomatoes', name: 'Vine tomatoes', supplierId: 'fresh-foods', supplierName: 'Fresh Foods Supply', category: 'Produce', price: 3.6, stock: 7 },
      { id: 'lettuce', name: 'Romaine lettuce', supplierId: 'fresh-foods', supplierName: 'Fresh Foods Supply', category: 'Produce', price: 2.8, stock: 2 },
      { id: 'honey', name: 'Wildflower honey', supplierId: 'fresh-foods', supplierName: 'Fresh Foods Supply', category: 'Produce', price: 7.9, stock: 9 },
      { id: 'organic-avocados', name: 'Organic avocados', supplierId: 'fresh-foods', supplierName: 'Fresh Foods Supply', category: 'Produce', price: 4.8, stock: 0 },
      { id: 'rye', name: 'Rye loaf', supplierId: 'northside', supplierName: 'Northside Bakery', category: 'Bakery', price: 3.9, stock: 0 },
      { id: 'almond-milk', name: 'Almond milk', supplierId: 'dairyco', supplierName: 'DairyCo', category: 'Dairy', price: 5.2, stock: 0 },
    ],
    cart: [
      { productId: 'whole-milk', qty: 1 },
      { productId: 'sourdough', qty: 1 },
      { productId: 'avocados', qty: 1 },
    ],
    sales: [],
    orders: [
      { id: 'o1', supplierName: 'Fresh Foods Supply', amount: 1240, status: 'Delivered' },
      { id: 'o2', supplierName: 'DairyCo', amount: 860, status: 'Delivered' },
      { id: 'o3', supplierName: 'Fresh Foods Supply', amount: 720, status: 'Delivered' },
      { id: 'o4', supplierName: 'Northside Bakery', amount: 640, status: 'Delivered' },
      { id: 'o5', supplierName: 'Fresh Foods Supply', amount: 480, status: 'Delivered' },
      { id: 'o6', supplierName: 'DairyCo', amount: 310, status: 'Delivered' },
      { id: 'o7', supplierName: 'Northside Bakery', amount: 250, status: 'Delivered' },
      { id: 'o8', supplierName: 'Fresh Foods Supply', amount: 160, status: 'In transit' },
      { id: 'o9', supplierName: 'DairyCo', amount: 120, status: 'Pending' },
      { id: 'o10', supplierName: 'Northside Bakery', amount: 80, status: 'Pending' },
    ],
    invoices: [
      { id: 'inv-1', supplierId: 'fresh-foods', supplierName: 'Fresh Foods Supply', invoiceNo: 'PO-1048', dueDate: '9 Oct 2026', amount: 1248.5, paid: false },
      { id: 'inv-2', supplierId: 'northside', supplierName: 'Northside Bakery', invoiceNo: 'PO-1043', dueDate: '2 Oct 2026', amount: 862.0, paid: false },
      { id: 'inv-3', supplierId: 'dairyco', supplierName: 'DairyCo', invoiceNo: 'PO-1051', dueDate: '12 Oct 2026', amount: 640.25, paid: false },
      { id: 'inv-4', supplierId: 'dairyco', supplierName: 'DairyCo', invoiceNo: 'PO-1039', dueDate: '28 Sep 2026', amount: 1120.75, paid: true, method: 'Bank transfer' },
    ],
  };
}

export const money = (n: number) =>
  `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

interface CartDetail extends SaleLine {
  supplierName: string;
}

interface AppStore extends PersistedState {
  ready: boolean;
  cartDetailed: CartDetail[];
  cartCount: number;
  subtotal: number;
  tax: number;
  total: number;
  lowStockCount: number;
  outOfStockCount: number;
  unitsOnHand: number;
  pendingOrders: number;
  unpaidInvoices: Invoice[];
  addToCart: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  checkout: () => Sale | null;
  payInvoice: (id: string, method: PayMethod) => void;
  reorderLowStock: () => number;
  resetDemo: () => void;
  productById: (id: string) => Product | undefined;
  supplierById: (id: string) => Supplier | undefined;
}

const AppContext = createContext<AppStore | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PersistedState>(seed);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setState({ ...seed(), ...JSON.parse(raw) });
      } catch {
        // Corrupt storage: fall back to seed data.
      } finally {
        setReady(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  }, [state, ready]);

  const productById = useCallback(
    (id: string) => state.products.find((p) => p.id === id),
    [state.products],
  );
  const supplierById = useCallback(
    (id: string) => state.suppliers.find((s) => s.id === id),
    [state.suppliers],
  );

  const addToCart = useCallback((productId: string) => {
    setState((s) => {
      const line = s.cart.find((c) => c.productId === productId);
      const product = s.products.find((p) => p.id === productId);
      if (!product || product.stock === 0) return s;
      if (line) {
        if (line.qty + 1 > product.stock) return s;
        return { ...s, cart: s.cart.map((c) => (c.productId === productId ? { ...c, qty: c.qty + 1 } : c)) };
      }
      return { ...s, cart: [...s.cart, { productId, qty: 1 }] };
    });
  }, []);

  const setQty = useCallback(
    (productId: string, qty: number) => {
      setState((s) => {
        const product = s.products.find((p) => p.id === productId);
        const capped = Math.max(0, Math.min(qty, product?.stock ?? qty));
        if (capped === 0) return { ...s, cart: s.cart.filter((c) => c.productId !== productId) };
        if (!s.cart.some((c) => c.productId === productId))
          return { ...s, cart: [...s.cart, { productId, qty: capped }] };
        return { ...s, cart: s.cart.map((c) => (c.productId === productId ? { ...c, qty: capped } : c)) };
      });
    },
    [],
  );

  const clearCart = useCallback(() => {
    setState((s) => ({ ...s, cart: [] }));
  }, []);

  const checkout = useCallback((): Sale | null => {
    const lines: SaleLine[] = [];
    for (const c of state.cart) {
      const p = state.products.find((pp) => pp.id === c.productId);
      if (!p || p.stock < c.qty) return null;
      lines.push({ productId: p.id, name: p.name, price: p.price, qty: c.qty });
    }
    if (lines.length === 0) return null;
    const subtotal = lines.reduce((sum, l) => sum + l.price * l.qty, 0);
    const tax = subtotal * TAX_RATE;
    const sale: Sale = {
      id: `sale-${Date.now()}`,
      lines,
      subtotal,
      tax,
      total: subtotal + tax,
      date: new Date().toISOString(),
    };
    const ids = new Set(lines.map((l) => l.productId));
    const byId = new Map(lines.map((l) => [l.productId, l.qty]));
    setState((s) => ({
      ...s,
      products: s.products.map((p) =>
        ids.has(p.id) ? { ...p, stock: p.stock - (byId.get(p.id) ?? 0) } : p,
      ),
      cart: [],
      sales: [sale, ...s.sales],
    }));
    return sale;
  }, [state.cart, state.products]);

  const payInvoice = useCallback((id: string, method: PayMethod) => {
    setState((s) => ({
      ...s,
      invoices: s.invoices.map((inv) => (inv.id === id ? { ...inv, paid: true, method } : inv)),
    }));
  }, []);

  const reorderLowStock = useCallback((): number => {
    const count = state.products.filter((p) => p.stock < 12).length;
    setState((s) => ({
      ...s,
      products: s.products.map((p) => (p.stock < 12 ? { ...p, stock: 24 } : p)),
    }));
    return count;
  }, [state.products]);

  const resetDemo = useCallback(() => {
    const fresh = seed();
    setState(fresh);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(fresh)).catch(() => {});
  }, []);

  const value = useMemo<AppStore>(() => {
    const cartDetailed: CartDetail[] = state.cart.flatMap((c) => {
      const p = state.products.find((pp) => pp.id === c.productId);
      return p ? [{ productId: p.id, name: p.name, price: p.price, qty: c.qty, supplierName: p.supplierName }] : [];
    });
    const subtotal = cartDetailed.reduce((sum, l) => sum + l.price * l.qty, 0);
    const tax = subtotal * TAX_RATE;
    return {
      ...state,
      ready,
      cartDetailed,
      cartCount: cartDetailed.reduce((sum, l) => sum + l.qty, 0),
      subtotal,
      tax,
      total: subtotal + tax,
      lowStockCount: state.products.filter((p) => p.stock > 0 && p.stock <= 10).length,
      outOfStockCount: state.products.filter((p) => p.stock === 0).length,
      unitsOnHand: state.products.reduce((sum, p) => sum + p.stock, 0),
      pendingOrders: state.invoices.filter((i) => !i.paid).length,
      unpaidInvoices: state.invoices.filter((i) => !i.paid),
      addToCart,
      setQty,
      clearCart,
      checkout,
      payInvoice,
      reorderLowStock,
      resetDemo,
      productById,
      supplierById,
    };
  }, [state, ready, addToCart, setQty, clearCart, checkout, payInvoice, reorderLowStock, resetDemo, productById, supplierById]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppStore {
  const store = useContext(AppContext);
  if (!store) throw new Error('useApp must be used inside AppProvider');
  return store;
}
