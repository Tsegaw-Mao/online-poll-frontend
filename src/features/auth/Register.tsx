import { useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { ENDPOINTS } from "../../api/endpoints";

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
}

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const csrfToken = getCookie("csrftoken");

      const response = await api.post(
        ENDPOINTS.AUTH.REGISTER,
        { username, password },
        {
          headers: csrfToken
            ? { "X-CSRFTOKEN": csrfToken }
            : undefined,
        }
      );

      alert(`✅ User ${response.data.username} registered successfully!`);

      // Redirect to login with credentials
      navigate("/login", { state: { username, password } });

    } catch (err: any) {
      const msg =
        err.response?.data?.detail ||
        JSON.stringify(err.response?.data) ||
        "Registration failed";
      alert(`❌ Error: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4 p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
        className="w-full border rounded p-2"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
        className="w-full border rounded p-2"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
      >
        {loading ? "Registering..." : "Register"}
      </button>
    </form>
  );
};

export default Register;
