import { useEffect, useState } from "react";
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
  console.log("🚀 ~ isAdmin:", isAdmin);

  useEffect(() => {
    if (isAdmin) {
      navigate("/"); // если уже админ, редирект на главную
    }
  }, [isAdmin, navigate]);

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

  return (
    <div className="flex h-180 w-full items-center justify-center bg-gray-100">
      <div className="flex w-full max-w-sm flex-col gap-3 rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-semibold">Admin Login</h2>

        {error && <p className="mb-4 text-center text-red-500">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded border p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-6 w-full rounded border p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />

        <button
          onClick={handleLogin}
          className="w-full rounded bg-blue-500 p-3 text-white transition hover:bg-blue-600"
        >
          Login
        </button>
      </div>
    </div>
  );
}
