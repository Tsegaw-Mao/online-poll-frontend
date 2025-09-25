import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/api/auth/login/", { username, password });

      // Success: save tokens and redirect
      const { refresh, access } = response.data;
      localStorage.setItem("refresh_token", refresh);
      localStorage.setItem("access_token", access);
      

      alert("✅ Login successful!");
      navigate("/"); // go to homepage
    } catch (error: any) {
      // If login fails, show backend response
      if (error.response && error.response.data && error.response.data.detail) {
        alert(`❌ Login failed: ${error.response.data.detail}`);
      } else {
        alert("❌ Login failed: Unknown error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Login</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full border rounded p-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border rounded p-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
