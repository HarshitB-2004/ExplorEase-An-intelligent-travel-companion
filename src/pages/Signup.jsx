import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      return setErrorMessage("Passwords do not match!");
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/auth/signup", form);
      alert("Signup successful! You can now login.");
      navigate("/login");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Signup failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100">
      <div className="bg-white shadow-2xl rounded-2xl p-10 w-[400px]">
        <h2 className="text-3xl font-bold text-center text-pink-700 mb-6">
          Create an Account ✨
        </h2>

        {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Enter your name"
            className="w-full border px-4 py-2 rounded-lg"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border px-4 py-2 rounded-lg"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <input
            type="password"
            placeholder="Enter your password"
            className="w-full border px-4 py-2 rounded-lg"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full border px-4 py-2 rounded-lg"
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 text-white font-semibold rounded-lg ${
              loading ? "bg-pink-400 cursor-not-allowed" : "bg-pink-600 hover:bg-pink-700"
            }`}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-pink-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
