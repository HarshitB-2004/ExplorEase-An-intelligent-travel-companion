import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plane, Hotel, Utensils, Car, Mountain, Wallet, Plus, Trash2 } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const categories = [
  { label: "Flights", icon: Plane, color: "#3b82f6" },
  { label: "Hotels", icon: Hotel, color: "#8b5cf6" },
  { label: "Food", icon: Utensils, color: "#f97316" },
  { label: "Transport", icon: Car, color: "#10b981" },
  { label: "Activities", icon: Mountain, color: "#ec4899" },
  { label: "Miscellaneous", icon: Wallet, color: "#6b7280" },
];

const BudgetTracker = () => {
  const [budget, setBudget] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ category: "", amount: "", note: "" });

  const totalSpent = expenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0);
  const remaining = budget ? budget - totalSpent : 0;
  const budgetUsedPercent = budget ? Math.min((totalSpent / budget) * 100, 100) : 0;

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!form.category || !form.amount) return;
    setExpenses([...expenses, form]);
    setForm({ category: "", amount: "", note: "" });
  };

  const handleDeleteExpense = (index) => {
    setExpenses(expenses.filter((_, i) => i !== index));
  };

  const chartData = categories.map((cat) => ({
    name: cat.label,
    value: expenses
      .filter((e) => e.category === cat.label)
      .reduce((sum, e) => sum + Number(e.amount), 0),
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 py-10 px-6">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-blue-700">Trip Budget Planner</h1>
          <p className="text-gray-600 mt-2">
            Plan your travel expenses, track your spending, and stay within budget 
          </p>
        </div>

        {/* Budget Summary Section */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-lg p-8 border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-6 text-center"
        >
          <div>
            <h3 className="text-gray-500 font-semibold">Total Budget</h3>
            <p className="text-3xl font-bold text-blue-700">
              {budget ? `₹${Number(budget).toLocaleString("en-IN")}` : "—"}
            </p>
          </div>
          <div>
            <h3 className="text-gray-500 font-semibold">Total Spent</h3>
            <p className="text-3xl font-bold text-rose-600">
              ₹{Number(totalSpent).toLocaleString("en-IN")}
            </p>
          </div>
          <div>
            <h3 className="text-gray-500 font-semibold">Remaining</h3>
            <p
              className={`text-3xl font-bold ${
                remaining >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              ₹{Number(remaining).toLocaleString("en-IN")}
            </p>
          </div>

          {/* Progress Bar */}
          {budget && (
            <div className="col-span-full mt-6">
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <motion.div
                  className="h-3 bg-gradient-to-r from-blue-600 to-indigo-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${budgetUsedPercent}%` }}
                  transition={{ duration: 0.8 }}
                ></motion.div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {budgetUsedPercent.toFixed(1)}% of your budget used
              </p>
            </div>
          )}
        </motion.div>

        {/* Budget Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-xl rounded-3xl p-8 border border-gray-100 max-w-4xl mx-auto"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Set Your Trip Budget</h2>
          <input
            type="number"
            placeholder="Enter your total trip budget (₹)"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
          />
        </motion.div>

        {/* Add Expense Section */}
        <motion.form
          onSubmit={handleAddExpense}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-xl rounded-3xl p-8 border border-gray-100 max-w-4xl mx-auto"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Add an Expense
          </h2>

          <div className="grid sm:grid-cols-3 gap-4 mb-5">
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.label} value={c.label}>
                  {c.label}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Amount (₹)"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-400"
            />

            <input
              type="text"
              placeholder="Optional note (e.g. Dinner at local cafe)"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:opacity-90 transition-all flex items-center gap-2"
          >
            <Plus size={18} /> Add Expense
          </button>
        </motion.form>

        {/* Expense Breakdown & Chart */}
        <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
          {/* List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white shadow-xl rounded-3xl p-8 border border-gray-100"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Expense Breakdown
            </h3>
            {expenses.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No expenses added yet.
              </p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {expenses.map((exp, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center py-3 hover:bg-blue-50 rounded-lg px-2 transition-all"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">{exp.category}</p>
                      <p className="text-sm text-gray-500">{exp.note}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-blue-700">
                        ₹{exp.amount}
                      </span>
                      <Trash2
                        onClick={() => handleDeleteExpense(index)}
                        size={18}
                        className="text-red-500 cursor-pointer hover:text-red-700 transition-all"
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>

          {/* Pie Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white shadow-xl rounded-3xl p-8 border border-gray-100 flex flex-col justify-center items-center"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              Spending Overview
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  innerRadius={50}
                  paddingAngle={3}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        categories.find((c) => c.label === entry.name)?.color ||
                        "#ccc"
                      }
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BudgetTracker;
