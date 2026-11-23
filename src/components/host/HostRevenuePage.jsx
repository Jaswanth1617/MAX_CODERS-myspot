import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import {
  Wallet,
  TrendingUp,
  Building2,
  Banknote,
  CreditCard,
  Download,
  CheckCircle2,
  Clock,
  Car,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Send,
  Calendar
} from 'lucide-react';

export const HostRevenuePage = () => {
  const { user, bookings, slots, showToast } = useApp();

  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('1200');
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  // Revenue analytics calculations
  const confirmedBookings = bookings.filter(
    (b) => b.bookingStatus === 'confirmed' || b.paymentStatus === 'paid'
  );

  const totalRevenue = confirmedBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const onlineRevenue = confirmedBookings
    .filter((b) => b.paymentMethod === 'online')
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const cashRevenue = confirmedBookings
    .filter((b) => b.paymentMethod === 'offline')
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  // Chart data: 7 days earnings
  const chartData = [
    { day: 'Mon', revenue: 420, bookings: 5 },
    { day: 'Tue', revenue: 680, bookings: 8 },
    { day: 'Wed', revenue: 540, bookings: 6 },
    { day: 'Thu', revenue: 890, bookings: 11 },
    { day: 'Fri', revenue: 1240, bookings: 16 },
    { day: 'Sat', revenue: 1680, bookings: 22 },
    { day: 'Sun', revenue: 1420, bookings: 19 },
  ];

  const handleWithdraw = (e) => {
    e.preventDefault();
    setIsWithdrawing(true);
    setTimeout(() => {
      setIsWithdrawing(false);
      setWithdrawModalOpen(false);
      showToast(`💸 Payout of ₹${withdrawAmount} successfully transferred to ${user?.payoutUpi || 'UPI Account'}!`, 'success');
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-28 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Host Revenue & Earnings
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
              ● Active Payouts
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track daily parking yields, instant UPI transfers, online payouts, and collected cash ledger.
          </p>
        </div>

        <button
          onClick={() => setWithdrawModalOpen(true)}
          className="self-start sm:self-auto px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-myspot-700 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs shadow-glow flex items-center gap-2 transition-all"
        >
          <ArrowUpRight className="w-4 h-4" />
          <span>Withdraw to Bank / UPI</span>
        </button>
      </div>

      {/* Main Revenue Highlights Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Total Lifetime Earnings Card */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-950 via-myspot-900 to-indigo-950 text-white shadow-card relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-200">
              Total Revenue Obtained
            </span>
            <div className="text-3xl sm:text-4xl font-black tracking-tight">
              ₹{totalRevenue.toFixed(2)}
            </div>
            <p className="text-xs text-purple-200/80 pt-1">
              Net earnings across all {slots.length} managed parking locations
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-xs">
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +24.8% growth
            </span>
            <span className="text-purple-200">Auto-settles daily</span>
          </div>
        </div>

        {/* Online UPI vs Offline Cash Card */}
        <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-card flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Payment Breakdown
            </span>
            <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-900 text-[10px] font-bold">
              {confirmedBookings.length} Bookings
            </span>
          </div>

          <div className="space-y-3">
            {/* Online */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-purple-50/60 border border-purple-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Online (UPI / Card)</span>
                  <span className="text-[10px] text-slate-500">Direct Bank Deposit</span>
                </div>
              </div>
              <span className="text-sm font-black text-purple-950">₹{onlineRevenue.toFixed(2)}</span>
            </div>

            {/* Offline Cash */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-50/60 border border-amber-200/80">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                  <Banknote className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Cash at Bay</span>
                  <span className="text-[10px] text-slate-500">Collected by Supervisor</span>
                </div>
              </div>
              <span className="text-sm font-black text-amber-950">₹{cashRevenue.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Settlement Account Card */}
        <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-card flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Settlement Target
            </span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              ✓ Verified
            </span>
          </div>

          <div className="space-y-2">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Linked UPI ID</span>
              <span className="text-xs font-mono font-extrabold text-slate-900">
                {user?.payoutUpi || '9876543210@okaxis'}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Bank Account</span>
              <span className="text-xs font-mono font-bold text-slate-700">
                {user?.bankAccount || 'HDFC0001842 •••• 7892'}
              </span>
            </div>
          </div>

          <button
            onClick={() => setWithdrawModalOpen(true)}
            className="w-full py-2.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 font-extrabold text-xs transition-colors text-center"
          >
            Manage Payout Accounts
          </button>
        </div>
      </div>

      {/* Weekly Revenue Trend Chart */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-purple-100 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900">Weekly Revenue & Volume Trend</h3>
            <p className="text-xs text-slate-500">Real-time daily yield generated across all bays</p>
          </div>
          <span className="text-xs font-extrabold text-purple-900 bg-purple-100 px-3 py-1 rounded-xl">
            This Week (₹6,870 Total)
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="hostRevGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3E8FF" />
              <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} />
              <YAxis stroke="#94A3B8" fontSize={11} tickFormatter={(v) => `₹${v}`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1E1B4B',
                  borderRadius: '16px',
                  color: '#fff',
                  border: 'none',
                  fontSize: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                }}
                formatter={(value) => [`₹${value}`, 'Revenue']}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#7C3AED"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#hostRevGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Customer Payments Ledger Table */}
      <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900">Recent Customer Transactions</h3>
            <p className="text-xs text-slate-500">Live booking payments received from slot seekers</p>
          </div>
          <span className="text-xs font-bold text-slate-400">
            {confirmedBookings.length} Transactions
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-purple-100 text-slate-400 uppercase text-[10px] font-bold">
                <th className="pb-3">Pass / Txn ID</th>
                <th className="pb-3">Seeker Driver</th>
                <th className="pb-3">Vehicle Plate</th>
                <th className="pb-3">Bay</th>
                <th className="pb-3">Duration</th>
                <th className="pb-3">Payment Method</th>
                <th className="pb-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-50">
              {confirmedBookings.map((b) => (
                <tr key={b.id} className="hover:bg-purple-50/50 transition-colors">
                  <td className="py-3 font-mono font-bold text-purple-950">{b.id}</td>
                  <td className="py-3 font-bold text-slate-900">{b.driverName || 'Aditya Verma'}</td>
                  <td className="py-3 font-mono font-bold text-slate-700">{b.vehiclePlate}</td>
                  <td className="py-3 font-mono text-purple-800 font-bold">{b.bayNumber}</td>
                  <td className="py-3 text-slate-600">{b.durationHours} Hours</td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-0.5 rounded-md font-bold uppercase text-[10px] ${
                        b.paymentMethod === 'online'
                          ? 'bg-purple-100 text-purple-900'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {b.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3 text-right font-black text-myspot-900 text-sm">
                    ₹{Number(b.totalAmount).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payout / Withdrawal Modal */}
      {withdrawModalOpen && (
        <div className="fixed inset-0 z-[1200] overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-purple-100 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setWithdrawModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              ×
            </button>

            <div className="mb-5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2 shadow-sm">
                <Wallet className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900">Withdraw Host Earnings</h3>
              <p className="text-xs text-slate-500">Transfer your parking earnings directly to your UPI ID or Bank.</p>
            </div>

            <form onSubmit={handleWithdraw} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Withdrawal Amount (₹)</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-sm font-black text-slate-500">₹</span>
                  <input
                    type="number"
                    required
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    max={totalRevenue}
                    className="w-full pl-8 pr-4 py-2.5 rounded-2xl bg-purple-50/40 border border-purple-200 text-base font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Available for withdrawal: ₹{totalRevenue.toFixed(2)}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Payout Destination</label>
                <div className="p-3 rounded-2xl bg-purple-50/80 border border-purple-200 space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                    <span>Instant UPI Settlement:</span>
                    <span className="font-mono text-purple-900">{user?.payoutUpi || '9876543210@okaxis'}</span>
                  </div>
                  <p className="text-[10px] text-slate-500">Zero transaction fees • Instant IMPS transfer</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={isWithdrawing}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-myspot-700 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm shadow-glow flex items-center justify-center gap-2 transition-all"
              >
                {isWithdrawing ? (
                  <span>Processing IMPS Transfer...</span>
                ) : (
                  <>
                    <ArrowUpRight className="w-4 h-4" />
                    <span>Confirm Transfer of ₹{withdrawAmount}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
