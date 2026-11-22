import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { 
  Pill, 
  ShoppingCart, 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  X, 
  CheckCircle2, 
  Truck, 
  ShieldCheck, 
  AlertCircle,
  Lock
} from 'lucide-react';

const Pharmacy = ({ setActivePage }) => {
  const { user } = useAuth();
  const { 
    medicines, 
    cart, 
    addToCart, 
    removeFromCart, 
    updateCartQty, 
    clearCart, 
    placePharmacyOrder 
  } = useData();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  const [checkoutForm, setCheckoutForm] = useState({
    name: '',
    phone: '',
    address: '',
    paymentMethod: 'Cash on Delivery'
  });

  const categories = ['All', 'Pain & Fever', 'Gastric & Acid Relief', 'Vitamins & Supplements', 'Medical Devices', 'Emergency & Safety'];

  const filteredMedicines = useMemo(() => {
    return medicines.filter(med => {
      const matchCat = selectedCategory === 'All' || med.category === selectedCategory;
      const matchSearch = searchTerm.trim() === '' ||
        med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [medicines, selectedCategory, searchTerm]);

  const totalCartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const deliveryFee = cart.length > 0 ? 50 : 0;
  const grandTotal = subtotal + deliveryFee;

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    if (!checkoutForm.name || !checkoutForm.phone || !checkoutForm.address) return;
    const res = placePharmacyOrder(checkoutForm);
    if (res.success) {
      setOrderSuccess(res.order);
      setIsCheckoutOpen(false);
    }
  };

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Pharmacy Banner */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-white/20 tracking-wider inline-flex items-center gap-1.5">
              <Pill className="w-3.5 h-3.5" /> 100% Genuine Certified Medicines
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              MediCare Online Pharmacy
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm">
              Order prescription drugs, daily wellness vitamins, and home healthcare devices with fast home delivery in Dhaka.
            </p>
          </div>

          {/* Cart Trigger Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-3 bg-white text-emerald-800 hover:bg-emerald-50 px-6 py-3.5 rounded-2xl font-black text-sm shadow-xl transition-transform active:scale-95 shrink-0"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5 text-emerald-700" />
              {totalCartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold animate-bounce">
                  {totalCartCount}
                </span>
              )}
            </div>
            <span>My Medicine Bag ({totalCartCount})</span>
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-sm border border-slate-200/80 space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search medicines, devices, or pharmaceutical company (e.g. Napa, Omep, Omron)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Medicines Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredMedicines.map(med => (
            <div key={med.id} className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group">
              
              <div className="relative h-48 bg-slate-100 overflow-hidden">
                <img
                  src={med.image_url}
                  alt={med.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-bold text-slate-700">
                  {med.category}
                </span>
                {med.originalPrice > med.price && (
                  <span className="absolute top-3 right-3 bg-rose-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                    SAVE ৳{med.originalPrice - med.price}
                  </span>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[11px] text-slate-400 font-semibold block">{med.manufacturer}</span>
                  <h3 className="font-bold text-slate-900 text-base leading-tight mt-0.5">{med.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{med.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block line-through">৳ {med.originalPrice}</span>
                    <span className="text-lg font-black text-emerald-700">৳ {med.price}</span>
                  </div>

                  <button
                    onClick={() => {
                      addToCart(med);
                      setIsCartOpen(true);
                    }}
                    className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Cart Sliding Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm flex justify-end">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
            
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-emerald-700 text-white">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                <h3 className="font-bold text-lg">Your Medicine Bag ({totalCartCount})</h3>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="p-1 hover:bg-white/20 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-slate-100">
              {cart.length > 0 ? (
                cart.map(item => (
                  <div key={item.id} className="pt-4 first:pt-0 flex items-center justify-between gap-3">
                    <img src={item.image_url} alt={item.name} className="w-14 h-14 rounded-xl object-cover shrink-0 bg-slate-100" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-800 text-xs truncate">{item.name}</h4>
                      <span className="text-emerald-700 font-black text-xs block">৳ {item.price}</span>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2 bg-slate-100 px-2 py-1 rounded-xl">
                      <button onClick={() => updateCartQty(item.id, item.qty - 1)} className="p-1 text-slate-600 hover:text-slate-900">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-slate-800 w-4 text-center">{item.qty}</span>
                      <button onClick={() => updateCartQty(item.id, item.qty + 1)} className="p-1 text-slate-600 hover:text-slate-900">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button onClick={() => removeFromCart(item.id)} className="text-slate-400 hover:text-rose-600 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 text-slate-400 space-y-2">
                  <Pill className="w-12 h-12 mx-auto text-slate-300" />
                  <p className="font-bold text-sm text-slate-700">Your bag is empty</p>
                  <p className="text-xs">Add medicines or devices to proceed to checkout</p>
                </div>
              )}
            </div>

            {/* Drawer Footer & Checkout */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-slate-100 bg-slate-50 space-y-3">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal:</span>
                    <span className="font-bold text-slate-800">৳ {subtotal}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Express Home Delivery:</span>
                    <span className="font-bold text-slate-800">৳ {deliveryFee}</span>
                  </div>
                  <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                    <span>Total Amount:</span>
                    <span className="text-emerald-700">৳ {grandTotal}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    if (!user) {
                      if (setActivePage) setActivePage('login');
                    } else {
                      setIsCheckoutOpen(true);
                    }
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-600/25 transition-all text-xs flex items-center justify-center gap-2"
                >
                  {!user ? <Lock className="w-4 h-4 text-emerald-200" /> : <Truck className="w-4 h-4" />}
                  <span>{!user ? 'Sign In to Proceed to Delivery' : 'Proceed to Home Delivery'}</span>
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in">
            <div className="bg-emerald-700 p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">Delivery Information</h3>
                <p className="text-xs text-emerald-200">Delivering in 2-4 hours inside Dhaka</p>
              </div>
              <button onClick={() => setIsCheckoutOpen(false)} className="text-white hover:bg-white/20 rounded-full p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Receiver's Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={checkoutForm.name}
                  onChange={(e) => setCheckoutForm({ ...checkoutForm, name: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Contact Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="017xxxxxxxx"
                  value={checkoutForm.phone}
                  onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Delivery Address *</label>
                <textarea
                  required
                  rows="2"
                  placeholder="House no, Road no, Area, Landmark..."
                  value={checkoutForm.address}
                  onChange={(e) => setCheckoutForm({ ...checkoutForm, address: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50 focus:bg-white resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Payment Method</label>
                <select
                  value={checkoutForm.paymentMethod}
                  onChange={(e) => setCheckoutForm({ ...checkoutForm, paymentMethod: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50 focus:bg-white font-medium"
                >
                  <option value="Cash on Delivery">Cash on Delivery (COD)</option>
                  <option value="bKash / Nagad on Delivery">bKash / Nagad Online</option>
                </select>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-slate-700 font-bold flex justify-between">
                <span>Total Payable:</span>
                <span className="text-emerald-700">৳ {grandTotal}</span>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-md transition-all text-xs"
              >
                Confirm Order & Dispatch
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Order Success Popup */}
      {orderSuccess && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-slate-900">Medicine Order Placed!</h3>
            <p className="text-xs text-slate-600">
              Your order <span className="font-bold text-slate-800">#{orderSuccess.id}</span> has been confirmed. Our pharmacy rider is packing your medicines.
            </p>
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Receiver:</span>
                <span className="font-bold text-slate-800">{orderSuccess.customer_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Amount:</span>
                <span className="font-bold text-emerald-700">৳ {orderSuccess.totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment:</span>
                <span className="font-bold text-slate-800">{orderSuccess.paymentMethod}</span>
              </div>
            </div>
            <button
              onClick={() => setOrderSuccess(null)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Pharmacy;
