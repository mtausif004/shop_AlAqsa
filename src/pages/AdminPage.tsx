import React, { useState, useEffect } from 'react';
import { useRouter } from '../context/RouterContext';
import {
  adminLogin,
  getActiveAdminSession,
  adminLogout,
  adminChangeCredentials,
  adminGetOrders,
  adminUpdateOrderStatus,
  adminSetCustomTracking,
  adminSaveProduct,
  adminGetCouriers,
  adminSaveCourier,
  fetchProducts,
  fetchCategories,
  getApiBaseUrl,
  setApiBaseUrl
} from '../services/api';
import { Order, Product, Courier, Category, AdminSession } from '../types';
import {
  Lock,
  LogOut,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Truck,
  Link,
  Settings,
  Activity,
  UserCheck,
  Search,
  Plus,
  Edit,
  Eye,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Save,
  Trash2,
  DollarSign,
  TrendingUp,
  Boxes,
  Bell,
  Check,
  X
} from 'lucide-react';

type AdminTab = 'dashboard' | 'orders' | 'products' | 'custom-tracking' | 'couriers' | 'diagnostics' | 'security';
type SessionState = 'BOOTING' | 'LOGIN' | 'AUTHENTICATING' | 'AUTHENTICATED' | 'SESSION_EXPIRED' | 'LOGOUT';

export const AdminPage: React.FC = () => {
  const { navigate } = useRouter();

  // State Machine
  const [sessionState, setSessionState] = useState<SessionState>('BOOTING');
  const [session, setSession] = useState<AdminSession | null>(null);

  // Login form state (Initial: mtausif004 / fkfk004)
  const [loginUsername, setLoginUsername] = useState('mtausif004');
  const [loginPassword, setLoginPassword] = useState('fkfk004');
  const [loginError, setLoginError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  // Data states
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [couriers, setCouriers] = useState<Courier[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Search and Filters
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Custom Tracking Link Tool State
  const [trackSearchPhone, setTrackSearchPhone] = useState('');
  const [trackPhoneResults, setTrackPhoneResults] = useState<Order[]>([]);
  const [selectedTrackOrder, setSelectedTrackOrder] = useState<Order | null>(null);
  const [customTrackingUrl, setCustomTrackingUrl] = useState('');
  const [customTrackingNumber, setCustomTrackingNumber] = useState('');
  const [customTrackingCourier, setCustomTrackingCourier] = useState('');
  const [trackingSaveMsg, setTrackingSaveMsg] = useState('');
  const [trackingSaveError, setTrackingSaveError] = useState('');

  // Product Editing Modal State
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [productSaveMsg, setProductSaveMsg] = useState('');

  // Courier Editing Modal State
  const [editingCourier, setEditingCourier] = useState<Partial<Courier> | null>(null);

  // Order Status update
  const [newOrderStatus, setNewOrderStatus] = useState('');
  const [orderStatusNote, setOrderStatusNote] = useState('');

  // Diagnostics state
  const [apiUrlInput, setApiUrlInput] = useState(getApiBaseUrl());
  const [apiPingStatus, setApiPingStatus] = useState<string | null>(null);
  const [telegramTestMsg, setTelegramTestMsg] = useState<string | null>(null);

  // Security Credentials form
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [newAdminUsername, setNewAdminUsername] = useState('');
  const [credChangeMsg, setCredChangeMsg] = useState('');
  const [credChangeError, setCredChangeError] = useState('');

  // Verify Session on mount
  useEffect(() => {
    const active = getActiveAdminSession();
    if (active) {
      setSession(active);
      setSessionState('AUTHENTICATED');
    } else {
      setSessionState('LOGIN');
    }
  }, []);

  // Load data when authenticated
  useEffect(() => {
    if (sessionState === 'AUTHENTICATED') {
      refreshAdminData();
    }
  }, [sessionState]);

  const refreshAdminData = async () => {
    setLoadingData(true);
    try {
      const [ordList, prodList, courList, catList] = await Promise.all([
        adminGetOrders(),
        fetchProducts(),
        adminGetCouriers(),
        fetchCategories()
      ]);
      setOrders(ordList);
      setProducts(prodList);
      setCouriers(courList);
      setCategories(catList);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingData(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setSessionState('AUTHENTICATING');

    try {
      const res = await adminLogin(loginUsername, loginPassword);
      if (res.success && res.session) {
        setSession(res.session);
        setSessionState('AUTHENTICATED');
      } else {
        setLoginError(res.error || 'ভুল ব্যবহারকারীর নাম অথবা পাসওয়ার্ড');
        setSessionState('LOGIN');
      }
    } catch (err: any) {
      setLoginError('লগইন ব্যর্থ হয়েছে');
      setSessionState('LOGIN');
    }
  };

  const handleLogout = () => {
    adminLogout();
    setSession(null);
    setSessionState('LOGOUT');
    setTimeout(() => setSessionState('LOGIN'), 400);
  };

  // Custom Tracking Tool: Search by customer phone
  const handleSearchOrderByPhone = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = trackSearchPhone.replace(/[\s\-\(\)]/g, '').slice(-11);
    if (!clean) return;
    const matches = orders.filter((o) => o.phone.replace(/[\s\-\(\)]/g, '').includes(clean));
    setTrackPhoneResults(matches);
    if (matches.length === 1) {
      handleSelectTrackOrder(matches[0]);
    }
  };

  const handleSelectTrackOrder = (ord: Order) => {
    setSelectedTrackOrder(ord);
    setCustomTrackingUrl(ord.trackingUrl || '');
    setCustomTrackingNumber(ord.trackingNumber || '');
    setCustomTrackingCourier(ord.courierId || '');
    setTrackingSaveMsg('');
    setTrackingSaveError('');
  };

  const handleSaveCustomTracking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrackOrder) return;
    setTrackingSaveMsg('');
    setTrackingSaveError('');

    if (customTrackingUrl && !customTrackingUrl.startsWith('https://')) {
      setTrackingSaveError('ট্র্যাকিং লিঙ্ক অবশ্যই সুরক্ষিত https:// দিয়ে শুরু হতে হবে');
      return;
    }

    const res = await adminSetCustomTracking({
      orderId: selectedTrackOrder.orderId,
      trackingUrl: customTrackingUrl,
      trackingNumber: customTrackingNumber,
      courierId: customTrackingCourier
    });

    if (res.success) {
      setTrackingSaveMsg('কাস্টম ট্র্যাকিং লিঙ্ক অগ্রাধিকার ১ হিসেবে সংরক্ষণ করা হয়েছে!');
      refreshAdminData();
    } else {
      setTrackingSaveError(res.error || 'সংরক্ষণ ব্যর্থ হয়েছে');
    }
  };

  // Status Update for selected order
  const handleUpdateStatus = async () => {
    if (!selectedOrder || !newOrderStatus) return;
    const ok = await adminUpdateOrderStatus(selectedOrder.orderId, newOrderStatus, orderStatusNote);
    if (ok) {
      refreshAdminData();
      setSelectedOrder(null);
      setNewOrderStatus('');
      setOrderStatusNote('');
    }
  };

  // Save product
  const handleSaveProductForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    const res = await adminSaveProduct(editingProduct);
    if (res.success) {
      setProductSaveMsg('পণ্য সফলভাবে সংরক্ষিত হয়েছে!');
      setTimeout(() => {
        setProductSaveMsg('');
        setEditingProduct(null);
        refreshAdminData();
      }, 1000);
    }
  };

  // Save courier
  const handleSaveCourierForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourier) return;
    const res = await adminSaveCourier(editingCourier);
    if (res.success) {
      setEditingCourier(null);
      refreshAdminData();
    }
  };

  // Password / Credentials change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setCredChangeMsg('');
    setCredChangeError('');
    if (!newAdminPassword || newAdminPassword.length < 6) {
      setCredChangeError('পাসওয়ার্ড ন্যূনতম ৬ অক্ষরের হতে হবে');
      return;
    }
    const res = await adminChangeCredentials(newAdminPassword, newAdminUsername || undefined);
    if (res.success) {
      setCredChangeMsg(res.message || 'পাসওয়ার্ড পরিবর্তিত হয়েছে। অনুগ্রহ করে আবার লগইন করুন।');
      setTimeout(() => {
        handleLogout();
      }, 2000);
    } else {
      setCredChangeError(res.error || 'পরিবর্তন ব্যর্থ হয়েছে');
    }
  };

  // Ping API
  const handleTestApiUrl = async () => {
    setApiPingStatus('যাচাই করা হচ্ছে...');
    setApiBaseUrl(apiUrlInput);
    try {
      const res = await fetch(apiUrlInput, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'ping' })
      });
      const json = await res.json();
      if (json.success) {
        setApiPingStatus('✅ Apps Script Web App সফলভাবে সংযুক্ত!');
      } else {
        setApiPingStatus('❌ ত্রুটি: ' + (json.error || 'অজানা ত্রুটি'));
      }
    } catch (err: any) {
      setApiPingStatus('⚠️ সংযোগ পাওয়া যায়নি: ' + err.message);
    }
  };

  // -------------------------------------------------------------
  // BOOTING STATE
  // -------------------------------------------------------------
  if (sessionState === 'BOOTING') {
    return (
      <div className="min-h-screen bg-[#2F4858] flex items-center justify-center text-white">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#FFF1A6] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono tracking-wider">INITIALIZING SECURE SESSION...</p>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // LOGIN / AUTHENTICATING STATE (Strict Protection)
  // -------------------------------------------------------------
  if (sessionState === 'LOGIN' || sessionState === 'AUTHENTICATING' || sessionState === 'LOGOUT') {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4 bg-gradient-to-br from-[#2F4858] to-[#1C1917] text-white">
        <div className="w-full max-w-md bg-stone-900/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-700/60 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-[#6B352A] text-[#FFF1A6] flex items-center justify-center mx-auto shadow-lg border border-amber-300/30">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="font-serif text-2xl font-extrabold text-[#FFF1A6]">
              SecurePanel-Aqsa
            </h1>
            <p className="text-xs text-stone-400">
              আল আকসা বার্মিজ শপ • অনুমোদিত অ্যাডমিন অ্যাক্সেস
            </p>
          </div>

          {loginError && (
            <div className="bg-red-950/70 border border-red-500/40 text-red-200 p-3 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">
                অ্যাডমিন ইউজারনেম
              </label>
              <input
                type="text"
                required
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="mtausif004"
                className="w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-3 text-xs text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#FFF1A6]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">
                পাসওয়ার্ড
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-3 text-xs text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#FFF1A6]"
              />
            </div>

            <div className="text-[11px] text-stone-400 bg-stone-800/60 p-2.5 rounded-xl border border-stone-700/50 space-y-0.5">
              <span className="font-bold text-amber-200">প্রাথমিক টেস্ট ক্রেডেনশিয়াল:</span>
              <div className="font-mono">User: <strong>mtausif004</strong> | Pass: <strong>fkfk004</strong></div>
            </div>

            <button
              type="submit"
              disabled={sessionState === 'AUTHENTICATING'}
              className="w-full bg-[#6B352A] hover:bg-[#8B4536] text-[#FFF1A6] font-bold py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition active:scale-98"
            >
              {sessionState === 'AUTHENTICATING' ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#FFF1A6] border-t-transparent rounded-full animate-spin" />
                  <span>যাচাই হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>লগইন করুন</span>
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-xs text-stone-400 hover:text-white transition"
            >
              ← মূল ওয়েবসাইটে ফিরে যান
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // AUTHENTICATED ADMIN APP (#adminApp)
  // -------------------------------------------------------------

  // Calculations for overview dashboard
  const todayDateStr = new Date().toISOString().slice(0, 10);
  const todayOrders = orders.filter((o) => o.createdAt.includes(todayDateStr));
  const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);
  const totalRevenue = orders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);
  const pendingCount = orders.filter((o) => o.orderStatus === 'New' || o.orderStatus === 'Confirmed').length;
  const shippedCount = orders.filter((o) => o.orderStatus === 'Shipped' || o.orderStatus === 'In Transit').length;
  const deliveredCount = orders.filter((o) => o.orderStatus === 'Delivered').length;
  const lowStockProducts = products.filter((p) => p.stock <= 10);

  return (
    <div id="adminApp" className="min-h-screen bg-[#FAF7F2] text-[#2F4858] flex flex-col no-print">
      {/* Top Admin Navigation Header */}
      <header className="bg-[#2F4858] text-white px-4 sm:px-6 py-3 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#FFF1A6] text-[#6B352A] font-extrabold flex items-center justify-center text-sm shadow-inner">
            AQ
          </div>
          <div>
            <h1 className="font-serif font-bold text-base sm:text-lg text-[#FFF1A6] leading-tight">
              Al Aqsa Burmese Shop
            </h1>
            <span className="text-[11px] text-stone-300 font-mono">
              SecurePanel-Aqsa • {session?.username} ({session?.role})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={refreshAdminData}
            className="p-2 rounded-lg hover:bg-white/10 text-stone-300 hover:text-white transition"
            title="রিফ্রেশ"
          >
            <RefreshCw className={`w-4 h-4 ${loadingData ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => navigate('/')}
            className="hidden sm:inline-flex items-center gap-1 text-xs text-amber-200 hover:underline"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>স্টোরফ্রন্ট</span>
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-800/80 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition"
            title="লগআউট"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">লগআউট</span>
          </button>
        </div>
      </header>

      {/* Main Admin Body with Responsive Tab Bar */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 bg-[#233744] text-white p-3 space-y-1 shrink-0">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'dashboard' ? 'bg-[#6B352A] text-[#FFF1A6]' : 'text-stone-300 hover:bg-white/10'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>ড্যাশবোর্ড ওভারভিউ</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'orders' ? 'bg-[#6B352A] text-[#FFF1A6]' : 'text-stone-300 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShoppingCart className="w-4 h-4" />
              <span>অর্ডার ম্যানেজমেন্ট</span>
            </div>
            {pendingCount > 0 && (
              <span className="bg-[#FFF1A6] text-[#6B352A] text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">
                {pendingCount}
              </span>
            )}
          </button>

          {/* CRITICAL TOOL: Custom Tracking Link */}
          <button
            onClick={() => setActiveTab('custom-tracking')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'custom-tracking' ? 'bg-[#6B352A] text-[#FFF1A6]' : 'text-stone-300 hover:bg-white/10'
            }`}
          >
            <Link className="w-4 h-4 text-emerald-400" />
            <span>কাস্টম ট্র্যাকিং লিঙ্ক টুল</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'products' ? 'bg-[#6B352A] text-[#FFF1A6]' : 'text-stone-300 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Package className="w-4 h-4" />
              <span>পণ্য ক্যাটালগ ও স্টক</span>
            </div>
            <span className="text-[10px] text-stone-400 font-mono">({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('couriers')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'couriers' ? 'bg-[#6B352A] text-[#FFF1A6]' : 'text-stone-300 hover:bg-white/10'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>কুরিয়ার ও ট্র্যাকিং রুলস</span>
          </button>

          <button
            onClick={() => setActiveTab('diagnostics')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'diagnostics' ? 'bg-[#6B352A] text-[#FFF1A6]' : 'text-stone-300 hover:bg-white/10'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>সিস্টেম ডায়াগনস্টিকস</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'security' ? 'bg-[#6B352A] text-[#FFF1A6]' : 'text-stone-300 hover:bg-white/10'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>অ্যাডমিন প্রোফাইল ও নিরাপত্তা</span>
          </button>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2F4858]">
                ড্যাশবোর্ড পর্যালোচনা
              </h2>

              {/* Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs space-y-1">
                  <span className="text-xs font-bold text-stone-500 block">আজকের অর্ডার</span>
                  <div className="text-2xl font-extrabold text-[#6B352A]">{todayOrders.length} টি</div>
                  <span className="text-[11px] text-stone-400">মোট বিক্রয়: ৳{todayRevenue}</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs space-y-1">
                  <span className="text-xs font-bold text-stone-500 block">নতুন ও কনফার্মড</span>
                  <div className="text-2xl font-extrabold text-amber-600">{pendingCount} টি</div>
                  <span className="text-[11px] text-stone-400">প্যাকেজিং অপেক্ষমান</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs space-y-1">
                  <span className="text-xs font-bold text-stone-500 block">অন দ্য ওয়ে (কুরিয়ার)</span>
                  <div className="text-2xl font-extrabold text-blue-600">{shippedCount} টি</div>
                  <span className="text-[11px] text-stone-400">ডেলিভারিতে চলমান</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs space-y-1">
                  <span className="text-xs font-bold text-stone-500 block">সর্বমোট ডেলিভার্ড</span>
                  <div className="text-2xl font-extrabold text-emerald-700">{deliveredCount} টি</div>
                  <span className="text-[11px] text-stone-400">সর্বমোট রাজস্ব: ৳{totalRevenue}</span>
                </div>
              </div>

              {/* Low stock alerts */}
              {lowStockProducts.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-amber-800 font-bold text-xs">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>সতর্কতা: {lowStockProducts.length} টি পণ্যের স্টক সীমিত (১০ টির নিচে)</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {lowStockProducts.map((p) => (
                      <span key={p.productId} className="bg-white border border-amber-300 text-stone-800 text-[11px] px-2.5 py-1 rounded-lg font-medium">
                        {p.bengaliName} (স্টক: {p.stock})
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Orders table */}
              <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <h3 className="font-bold text-sm sm:text-base text-stone-800">
                    সাম্প্রতিক অর্ডার সমূহ
                  </h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-[#6B352A] font-bold hover:underline"
                  >
                    সকল অর্ডার দেখুন →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-stone-200 text-stone-500 uppercase text-[10px]">
                        <th className="py-2">অর্ডার আইডি</th>
                        <th className="py-2">গ্রাহক</th>
                        <th className="py-2">ফোন</th>
                        <th className="py-2">মূল্য</th>
                        <th className="py-2">স্ট্যাটাস</th>
                        <th className="py-2 text-right">অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {orders.slice(0, 6).map((ord) => (
                        <tr key={ord.orderId} className="hover:bg-stone-50">
                          <td className="py-3 font-mono font-bold text-[#6B352A]">{ord.orderId}</td>
                          <td className="py-3 font-bold text-stone-800">{ord.customerName}</td>
                          <td className="py-3 font-mono">{ord.phone}</td>
                          <td className="py-3 font-bold">৳{ord.grandTotal}</td>
                          <td className="py-3">
                            <span className="bg-[#FAF7F2] text-[#6B352A] font-bold text-[10px] px-2 py-0.5 rounded-full border border-amber-200">
                              {ord.orderStatus}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => { setSelectedOrder(ord); setActiveTab('orders'); }}
                              className="text-xs text-[#6B352A] font-bold hover:underline"
                            >
                              বিস্তারিত
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2F4858]">
                  অর্ডার ম্যানেজমেন্ট ({orders.length})
                </h2>

                <div className="relative w-full sm:w-72">
                  <input
                    type="text"
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    placeholder="আইডি, গ্রাহক বা ফোন দিয়ে খুঁজুন..."
                    className="w-full bg-white border border-stone-200 rounded-xl pl-9 pr-4 py-2 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#6B352A]"
                  />
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-stone-200 text-stone-500 uppercase text-[10px]">
                      <th className="py-2.5">অর্ডার আইডি</th>
                      <th className="py-2.5">তারিখ</th>
                      <th className="py-2.5">গ্রাহক</th>
                      <th className="py-2.5">মোবাইল</th>
                      <th className="py-2.5">জেলা</th>
                      <th className="py-2.5">সর্বমোট</th>
                      <th className="py-2.5">পেমেন্ট</th>
                      <th className="py-2.5">স্ট্যাটাস</th>
                      <th className="py-2.5 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {orders
                      .filter((o) => {
                        if (!orderSearchQuery.trim()) return true;
                        const q = orderSearchQuery.toLowerCase();
                        return (
                          o.orderId.toLowerCase().includes(q) ||
                          o.customerName.toLowerCase().includes(q) ||
                          o.phone.includes(q) ||
                          (o.trackingNumber && o.trackingNumber.toLowerCase().includes(q))
                        );
                      })
                      .map((ord) => (
                        <tr key={ord.orderId} className="hover:bg-stone-50">
                          <td className="py-3 font-mono font-bold text-[#6B352A]">{ord.orderId}</td>
                          <td className="py-3 text-stone-400 font-mono text-[11px]">{ord.createdAt?.slice(0, 10)}</td>
                          <td className="py-3 font-bold text-stone-800">{ord.customerName}</td>
                          <td className="py-3 font-mono">{ord.phone}</td>
                          <td className="py-3">{ord.district}</td>
                          <td className="py-3 font-bold text-stone-900">৳{ord.grandTotal}</td>
                          <td className="py-3">
                            <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded text-[10px]">
                              {ord.paymentMethod} • {ord.paymentStatus}
                            </span>
                          </td>
                          <td className="py-3">
                            <span className="bg-[#FAF7F2] text-[#6B352A] font-bold text-[10px] px-2 py-0.5 rounded-full border border-amber-200">
                              {ord.orderStatus}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => {
                                setSelectedOrder(ord);
                                setNewOrderStatus(ord.orderStatus);
                              }}
                              className="bg-[#6B352A] hover:bg-[#52271E] text-[#FFF1A6] font-bold px-3 py-1 rounded-lg text-[11px] transition"
                            >
                              ম্যানেজ
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* Order Detail & Edit Modal */}
              {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
                  <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-stone-200 space-y-6">
                    <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                      <div>
                        <h3 className="font-serif text-lg font-bold text-[#6B352A]">
                          অর্ডার বিস্তারিত: {selectedOrder.orderId}
                        </h3>
                        <span className="text-xs text-stone-400 font-mono">ইনভয়েস: {selectedOrder.invoiceId}</span>
                      </div>
                      <button
                        onClick={() => setSelectedOrder(null)}
                        className="p-1 rounded-lg hover:bg-stone-100 text-stone-500"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Customer info */}
                    <div className="bg-[#FAF7F2] p-4 rounded-2xl text-xs space-y-1.5 border border-stone-200">
                      <div>গ্রাহক: <strong>{selectedOrder.customerName}</strong></div>
                      <div>মোবাইল: <strong className="font-mono">{selectedOrder.phone}</strong> {selectedOrder.alternativePhone && `(বিকল্প: ${selectedOrder.alternativePhone})`}</div>
                      <div>ঠিকানা: {selectedOrder.address}, {selectedOrder.district}</div>
                      {selectedOrder.customerNote && <div>গ্রাহকের নোট: <em>{selectedOrder.customerNote}</em></div>}
                    </div>

                    {/* Items snapshot */}
                    <div className="space-y-2">
                      <h4 className="font-bold text-xs text-stone-700">অর্ডার আইটেম সমূহ:</h4>
                      <div className="border border-stone-200 rounded-xl divide-y divide-stone-100 text-xs">
                        {selectedOrder.items?.map((item: any, i: number) => (
                          <div key={i} className="p-2.5 flex justify-between">
                            <span>{item.productNameSnapshot} ({item.quantity}x @ ৳{item.unitPriceSnapshot})</span>
                            <span className="font-bold">৳{item.subtotal}</span>
                          </div>
                        ))}
                        <div className="p-2.5 flex justify-between font-bold bg-stone-50">
                          <span>সর্বমোট প্রদেয়:</span>
                          <span className="text-[#6B352A]">৳{selectedOrder.grandTotal}</span>
                        </div>
                      </div>
                    </div>

                    {/* Update Status form */}
                    <div className="space-y-3 pt-2 border-t border-stone-200">
                      <h4 className="font-bold text-xs text-stone-800">অর্ডার স্ট্যাটাস হালনাগাদ করুন:</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <select
                          value={newOrderStatus}
                          onChange={(e) => setNewOrderStatus(e.target.value)}
                          className="bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-stone-800 font-bold focus:outline-none"
                        >
                          <option value="New">New</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Processing">Processing</option>
                          <option value="Ready to Ship">Ready to Ship</option>
                          <option value="Shipped">Shipped</option>
                          <option value="In Transit">In Transit</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Delivery Failed">Delivery Failed</option>
                          <option value="Returned">Returned</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                        <input
                          type="text"
                          value={orderStatusNote}
                          onChange={(e) => setOrderStatusNote(e.target.value)}
                          placeholder="স্ট্যাটাস পরিবর্তনের কারণ/নোট (ঐচ্ছিক)"
                          className="bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs"
                        />
                      </div>

                      <div className="flex gap-2 justify-end pt-2">
                        <button
                          onClick={handleUpdateStatus}
                          className="bg-[#6B352A] hover:bg-[#52271E] text-[#FFF1A6] font-bold text-xs px-5 py-2.5 rounded-xl transition"
                        >
                          স্ট্যাটাস সেভ করুন
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CUSTOM TRACKING LINK TOOL (Priority 1) */}
          {activeTab === 'custom-tracking' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2F4858] flex items-center gap-2">
                  <Link className="w-6 h-6 text-emerald-600" />
                  কাস্টম ট্র্যাকিং লিঙ্ক ম্যানেজার (অগ্রাধিকার ১)
                </h2>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  গ্রাহকের ফোন নম্বর দিয়ে অর্ডার খুঁজে বের করুন এবং সেই অর্ডারের জন্য নির্দিষ্ট যেকোনো ট্র্যাকিং লিঙ্ক সংযুক্ত করুন। গ্রাহকের ট্র্যাকিং পেজে এই লিঙ্কটি সবার প্রথমে প্রদর্শিত হবে।
                </p>
              </div>

              {/* Step 1: Search Orders by Phone */}
              <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
                <h3 className="font-bold text-sm text-stone-800">
                  ধাপ ১: গ্রাহকের ফোন নম্বর দিয়ে অর্ডার খুঁজুন
                </h3>

                <form onSubmit={handleSearchOrderByPhone} className="flex gap-2">
                  <input
                    type="tel"
                    required
                    value={trackSearchPhone}
                    onChange={(e) => setTrackSearchPhone(e.target.value)}
                    placeholder="01861007427"
                    className="flex-1 bg-[#FAF7F2] border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-800 font-mono focus:outline-none focus:ring-1 focus:ring-[#6B352A]"
                  />
                  <button
                    type="submit"
                    className="bg-[#6B352A] hover:bg-[#52271E] text-[#FFF1A6] font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition"
                  >
                    <Search className="w-4 h-4" />
                    <span>অর্ডার খুঁজুন</span>
                  </button>
                </form>

                {/* Results list */}
                {trackPhoneResults.length > 0 && (
                  <div className="pt-2 space-y-2">
                    <span className="text-xs text-stone-500 font-semibold">
                      এই নম্বরে পাওয়া অর্ডারসমূহ ({trackPhoneResults.length}):
                    </span>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {trackPhoneResults.map((ord) => (
                        <div
                          key={ord.orderId}
                          onClick={() => handleSelectTrackOrder(ord)}
                          className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition ${
                            selectedTrackOrder?.orderId === ord.orderId
                              ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600'
                              : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
                          }`}
                        >
                          <div>
                            <span className="font-mono font-bold text-[#6B352A] mr-2">{ord.orderId}</span>
                            <span className="font-bold text-stone-800">{ord.customerName}</span>
                            <span className="text-stone-400 text-[11px] block">{ord.address}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold">৳{ord.grandTotal}</span>
                            <span className="text-[10px] text-stone-500 block">{ord.orderStatus}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Step 2: Assign Custom Tracking Link */}
              {selectedTrackOrder && (
                <div className="bg-white rounded-3xl p-6 border border-emerald-200 shadow-sm space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <div>
                      <h3 className="font-bold text-sm text-emerald-800">
                        ধাপ ২: অর্ডারে ট্র্যাকিং লিঙ্ক সংযুক্ত করুন ({selectedTrackOrder.orderId})
                      </h3>
                      <span className="text-xs text-stone-500">গ্রাহক: {selectedTrackOrder.customerName} ({selectedTrackOrder.phone})</span>
                    </div>
                  </div>

                  {trackingSaveMsg && (
                    <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      <span>{trackingSaveMsg}</span>
                    </div>
                  )}

                  {trackingSaveError && (
                    <div className="bg-red-50 text-red-700 border border-red-200 p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      <span>{trackingSaveError}</span>
                    </div>
                  )}

                  <form onSubmit={handleSaveCustomTracking} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        কাস্টম ট্র্যাকিং URL (Priority 1) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="url"
                        required
                        value={customTrackingUrl}
                        onChange={(e) => setCustomTrackingUrl(e.target.value)}
                        placeholder="https://steadfast.com.bd/t/STF-889210"
                        className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-800 font-mono focus:outline-none focus:ring-1 focus:ring-[#6B352A]"
                      />
                      <span className="text-[10px] text-stone-400">অবশ্যই সুরক্ষিত https:// দিয়ে শুরু হতে হবে।</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">
                          কুরিয়ার নির্বাচন
                        </label>
                        <select
                          value={customTrackingCourier}
                          onChange={(e) => setCustomTrackingCourier(e.target.value)}
                          className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-800 font-medium focus:outline-none"
                        >
                          <option value="">নির্বাচন করুন</option>
                          {couriers.map((c) => (
                            <option key={c.courierId} value={c.courierId}>{c.courierName}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">
                          ট্র্যাকিং নম্বর
                        </label>
                        <input
                          type="text"
                          value={customTrackingNumber}
                          onChange={(e) => setCustomTrackingNumber(e.target.value)}
                          placeholder="যেমন: STF-889210"
                          className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-mono"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-6 py-3 rounded-xl flex items-center gap-2 shadow transition"
                      >
                        <Save className="w-4 h-4" />
                        <span>কাস্টম ট্র্যাকিং লিঙ্ক সেভ করুন</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PRODUCTS CRUD */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2F4858]">
                  পণ্য ক্যাটালগ ও ইনভেন্টরি ({products.length})
                </h2>

                <button
                  onClick={() => setEditingProduct({
                    bengaliName: '',
                    englishName: '',
                    brand: 'Al Aqsa',
                    categoryId: 'pickle-chutney',
                    subcategoryId: '',
                    price: 250,
                    mrp: 300,
                    discount: 50,
                    stock: 50,
                    weight: '250',
                    unit: 'gm',
                    active: true,
                    images: ['https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80']
                  })}
                  className="bg-[#6B352A] hover:bg-[#52271E] text-[#FFF1A6] font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>নতুন পণ্য যোগ করুন</span>
                </button>
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-stone-200 text-stone-500 uppercase text-[10px]">
                      <th className="py-2">আইডি</th>
                      <th className="py-2">পণ্য নাম</th>
                      <th className="py-2">ক্যাটাগরি</th>
                      <th className="py-2">মূল্য</th>
                      <th className="py-2">ছাড়</th>
                      <th className="py-2">স্টক</th>
                      <th className="py-2">অবস্থা</th>
                      <th className="py-2 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {products.map((p) => (
                      <tr key={p.productId} className="hover:bg-stone-50">
                        <td className="py-3 font-mono font-bold text-[#6B352A]">{p.productId}</td>
                        <td className="py-3 font-bold text-stone-800">{p.bengaliName}</td>
                        <td className="py-3">{p.categoryId}</td>
                        <td className="py-3 font-bold">৳{p.price}</td>
                        <td className="py-3 text-emerald-700 font-bold">৳{p.discount}</td>
                        <td className="py-3">
                          <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${p.stock <= 10 ? 'bg-red-100 text-red-800' : 'bg-stone-100 text-stone-700'}`}>
                            {p.stock}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.active ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'}`}>
                            {p.active ? 'সক্রিয়' : 'লুকানো'}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => setEditingProduct(p)}
                            className="text-[#6B352A] font-bold hover:underline"
                          >
                            এডিট
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Product Edit / Add Modal */}
              {editingProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
                  <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-stone-200 space-y-4">
                    <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                      <h3 className="font-serif text-lg font-bold text-[#6B352A]">
                        {editingProduct.productId ? `পণ্য এডিট: ${editingProduct.productId}` : 'নতুন পণ্য যুক্ত করুন'}
                      </h3>
                      <button onClick={() => setEditingProduct(null)} className="p-1 hover:bg-stone-100 rounded-lg">
                        <X className="w-5 h-5 text-stone-500" />
                      </button>
                    </div>

                    {productSaveMsg && (
                      <div className="bg-emerald-50 text-emerald-800 p-2.5 rounded-xl text-xs font-bold">
                        {productSaveMsg}
                      </div>
                    )}

                    <form onSubmit={handleSaveProductForm} className="space-y-4 text-xs">
                      <div>
                        <label className="block font-bold text-stone-700 mb-1">পণ্যের বাংলা নাম *</label>
                        <input
                          type="text"
                          required
                          value={editingProduct.bengaliName || ''}
                          onChange={(e) => setEditingProduct({ ...editingProduct, bengaliName: e.target.value })}
                          className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl p-2.5 font-bold"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-stone-700 mb-1">ইংরেজি নাম</label>
                          <input
                            type="text"
                            value={editingProduct.englishName || ''}
                            onChange={(e) => setEditingProduct({ ...editingProduct, englishName: e.target.value })}
                            className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl p-2.5"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-stone-700 mb-1">ক্যাটাগরি</label>
                          <select
                            value={editingProduct.categoryId || 'pickle-chutney'}
                            onChange={(e) => setEditingProduct({ ...editingProduct, categoryId: e.target.value })}
                            className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl p-2.5 font-bold"
                          >
                            {categories.map((c) => (
                              <option key={c.categoryId} value={c.slug}>{c.bengaliName}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block font-bold text-stone-700 mb-1">মূল্য (৳) *</label>
                          <input
                            type="number"
                            required
                            value={editingProduct.price || 0}
                            onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                            className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl p-2.5 font-bold"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-stone-700 mb-1">ছাড় (৳)</label>
                          <input
                            type="number"
                            value={editingProduct.discount || 0}
                            onChange={(e) => setEditingProduct({ ...editingProduct, discount: Number(e.target.value) })}
                            className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl p-2.5 font-bold"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-stone-700 mb-1">স্টক পরিমাণ *</label>
                          <input
                            type="number"
                            required
                            value={editingProduct.stock || 0}
                            onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                            className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl p-2.5 font-bold"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-stone-700 mb-1">ওজন</label>
                          <input
                            type="text"
                            value={editingProduct.weight || '250'}
                            onChange={(e) => setEditingProduct({ ...editingProduct, weight: e.target.value })}
                            className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl p-2.5"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-stone-700 mb-1">একক</label>
                          <input
                            type="text"
                            value={editingProduct.unit || 'gm'}
                            onChange={(e) => setEditingProduct({ ...editingProduct, unit: e.target.value })}
                            className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl p-2.5"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-stone-700 mb-1">সংক্ষিপ্ত বিবরণ</label>
                        <textarea
                          rows={2}
                          value={editingProduct.shortDescription || ''}
                          onChange={(e) => setEditingProduct({ ...editingProduct, shortDescription: e.target.value })}
                          className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl p-2.5"
                        />
                      </div>

                      <div className="flex items-center gap-6 pt-2">
                        <label className="flex items-center gap-2 font-bold cursor-pointer">
                          <input
                            type="checkbox"
                            checked={Boolean(editingProduct.active)}
                            onChange={(e) => setEditingProduct({ ...editingProduct, active: e.target.checked })}
                          />
                          <span>পণ্যটি সক্রিয় থাকবে</span>
                        </label>

                        <label className="flex items-center gap-2 font-bold cursor-pointer">
                          <input
                            type="checkbox"
                            checked={Boolean(editingProduct.featured)}
                            onChange={(e) => setEditingProduct({ ...editingProduct, featured: e.target.checked })}
                          />
                          <span>ফিচার্ড (হোমপেজ)</span>
                        </label>
                      </div>

                      <div className="pt-3 flex justify-end gap-2 border-t border-stone-200">
                        <button
                          type="button"
                          onClick={() => setEditingProduct(null)}
                          className="px-4 py-2 bg-stone-100 rounded-xl"
                        >
                          বাতিল
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2 bg-[#6B352A] text-[#FFF1A6] font-bold rounded-xl shadow"
                        >
                          সংরক্ষণ করুন
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: COURIERS */}
          {activeTab === 'couriers' && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2F4858]">
                  কুরিয়ার সার্ভিস ও ট্র্যাকিং টেমপ্লেট
                </h2>
                <button
                  onClick={() => setEditingCourier({ courierName: '', website: '', trackingUrlTemplate: '', phone: '', active: true })}
                  className="bg-[#6B352A] text-[#FFF1A6] font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>নতুন কুরিয়ার</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {couriers.map((cur) => (
                  <div key={cur.courierId} className="bg-white p-5 rounded-2xl border border-stone-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-stone-800">{cur.courierName}</h4>
                      <span className="font-mono text-[10px] text-stone-400">{cur.courierId}</span>
                    </div>
                    <div className="text-xs text-stone-600 space-y-1 font-mono">
                      <div className="truncate">টেমপ্লেট: {cur.trackingUrlTemplate || 'None'}</div>
                      <div>হেল্পলাইন: {cur.phone || 'N/A'}</div>
                    </div>
                    <button
                      onClick={() => setEditingCourier(cur)}
                      className="text-xs text-[#6B352A] font-bold hover:underline"
                    >
                      সম্পাদনা করুন
                    </button>
                  </div>
                ))}
              </div>

              {editingCourier && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60">
                  <div className="bg-white rounded-3xl w-full max-w-md p-6 space-y-4">
                    <h3 className="font-bold text-sm text-stone-800">কুরিয়ার তথ্য সম্পাদনা</h3>
                    <form onSubmit={handleSaveCourierForm} className="space-y-3 text-xs">
                      <div>
                        <label className="font-bold block mb-1">কুরিয়ারের নাম</label>
                        <input
                          type="text"
                          required
                          value={editingCourier.courierName || ''}
                          onChange={(e) => setEditingCourier({ ...editingCourier, courierName: e.target.value })}
                          className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl p-2.5 font-bold"
                        />
                      </div>
                      <div>
                        <label className="font-bold block mb-1">ট্র্যাকিং URL টেমপ্লেট ([TRACKING_NUMBER] সহ)</label>
                        <input
                          type="url"
                          value={editingCourier.trackingUrlTemplate || ''}
                          onChange={(e) => setEditingCourier({ ...editingCourier, trackingUrlTemplate: e.target.value })}
                          placeholder="https://steadfast.com.bd/t/[TRACKING_NUMBER]"
                          className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl p-2.5 font-mono"
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={() => setEditingCourier(null)} className="px-4 py-2 bg-stone-100 rounded-xl">বাতিল</button>
                        <button type="submit" className="px-5 py-2 bg-[#6B352A] text-[#FFF1A6] font-bold rounded-xl">সেভ করুন</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: DIAGNOSTICS & SYSTEM SETUP */}
          {activeTab === 'diagnostics' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2F4858] flex items-center gap-2">
                  <Activity className="w-6 h-6 text-[#6B352A]" />
                  সিস্টেম ডায়াগনস্টিকস ও ব্যাকএন্ড সংযোগ
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Google Apps Script Web App এবং Google Sheets ডাটাবেজের সরাসরি স্থিতি যাচাই
                </p>
              </div>

              {/* Web App URL Test */}
              <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
                <h3 className="font-bold text-sm text-stone-800">
                  Google Apps Script Web App URL
                </h3>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={apiUrlInput}
                    onChange={(e) => setApiUrlInput(e.target.value)}
                    placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                    className="flex-1 bg-[#FAF7F2] border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-mono"
                  />
                  <button
                    onClick={handleTestApiUrl}
                    className="bg-[#2F4858] hover:bg-[#233744] text-white font-bold text-xs px-5 py-2.5 rounded-xl transition"
                  >
                    টেস্ট ও সেভ
                  </button>
                </div>
                {apiPingStatus && (
                  <div className="text-xs font-bold text-stone-700 bg-stone-50 p-3 rounded-xl border border-stone-200">
                    {apiPingStatus}
                  </div>
                )}
              </div>

              {/* 16 Sheets Schema Status */}
              <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
                <h3 className="font-bold text-sm text-stone-800">
                  Google Sheets ডাটাবেজের ১৬টি শীটের তালিকা:
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {[
                    'Orders', 'OrderItems', 'Products', 'Settings',
                    'Admins', 'Coupons', 'Banners', 'Categories',
                    'Offers', 'Combos', 'Reviews', 'Couriers',
                    'OrderStatusHistory', 'OrderAuditLog', 'SecurityEvents', 'LoginAttempts'
                  ].map((s) => (
                    <div key={s} className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-2 rounded-lg font-mono font-medium flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Apps Script Script Properties Guide */}
              <div className="bg-[#FAF7F2] rounded-3xl p-6 border border-stone-200 space-y-3 text-xs text-stone-700">
                <h4 className="font-bold text-stone-900">গোপনীয় স্ক্রিপ্ট প্রোপার্টিজ (Script Properties Setup):</h4>
                <div className="space-y-1 font-mono bg-white p-4 rounded-xl border border-stone-200">
                  <div>SPREADSHEET_ID: [আপনার গুগল স্প্রেডশীটের আইডি]</div>
                  <div>TELEGRAM_BOT_TOKEN: [আপনার টেলিগ্রাম বট টোকেন]</div>
                  <div>TELEGRAM_CHAT_ID: [আপনার টেলিগ্রাম চ্যাট আইডি]</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: SECURITY & CREDENTIALS */}
          {activeTab === 'security' && (
            <div className="space-y-6 max-w-xl">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2F4858] flex items-center gap-2">
                  <UserCheck className="w-6 h-6 text-[#6B352A]" />
                  অ্যাডমিন প্রোফাইল ও ক্রেডেনশিয়াল পরিবর্তন
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  প্রাথমিক ক্রেডেনশিয়াল (mtausif004 / fkfk004) নিরাপদ রাখতে নতুন তথ্য সেট করুন
                </p>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
                {credChangeMsg && (
                  <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl text-xs font-bold border border-emerald-200">
                    {credChangeMsg}
                  </div>
                )}
                {credChangeError && (
                  <div className="bg-red-50 text-red-700 p-3 rounded-xl text-xs font-bold border border-red-200">
                    {credChangeError}
                  </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      বর্তমান ইউজারনেম
                    </label>
                    <input
                      type="text"
                      disabled
                      value={session?.username || 'mtausif004'}
                      className="w-full bg-stone-100 border border-stone-200 rounded-xl p-2.5 font-mono text-stone-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      নতুন ইউজারনেম (ঐচ্ছিক)
                    </label>
                    <input
                      type="text"
                      value={newAdminUsername}
                      onChange={(e) => setNewAdminUsername(e.target.value)}
                      placeholder="নতুন নাম দিতে চাইলে লিখুন"
                      className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-[#6B352A]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      নতুন পাসওয়ার্ড <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      value={newAdminPassword}
                      onChange={(e) => setNewAdminPassword(e.target.value)}
                      placeholder="কমপক্ষে ৬ অক্ষরের শক্তিশালী পাসওয়ার্ড"
                      className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-[#6B352A]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#6B352A] hover:bg-[#52271E] text-[#FFF1A6] font-bold py-3 rounded-xl shadow transition"
                  >
                    ক্রেডেনশিয়াল আপডেট করুন
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
