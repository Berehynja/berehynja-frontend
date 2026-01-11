import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useAuth } from "../../components/AuthProvider/useAuth.tsx";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/"); // после логина редирект на главную
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message); // используем err
      }

      setError("Неверный email или пароль");
    }
  };

  // Если уже админ, редирект
  if (isAdmin) {
    navigate("/");
    return null;
  }

  return (
    <div className="w-full h-180 flex items-center justify-center bg-gray-100">
      <div className="flex flex-col bg-white p-8 rounded-lg shadow-md w-full max-w-sm gap-3">
        <h2 className="text-2xl font-semibold mb-6 text-center">Admin Login</h2>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-6 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition"
        >
          Login
        </button>
      </div>
    </div>
  );
}
