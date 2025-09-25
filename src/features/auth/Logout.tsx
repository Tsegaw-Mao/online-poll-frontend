import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { ENDPOINTS } from "../../api/endpoints";

const Logout = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("refresh_token");
    // const accessToken = localStorage.getItem("access_token");
    if (!refreshToken) {
      alert("No refresh token found.");
      return;
    }

    setLoading(true);
    try {
      // Send POST request to logout endpoint with refresh token
      const response = await api.post(ENDPOINTS.AUTH.LOGOUT, { refresh: refreshToken });
      
      if (response.status === 200) {
        alert(response.data.message || "Logout successful.");
        // Clear stored tokens
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/login"); // redirect to login
      } else {
        alert("Logout failed. Check console.");
        console.error(response.data);
      }
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.detail || "Network error during logout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
    >
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
};

export default Logout;
