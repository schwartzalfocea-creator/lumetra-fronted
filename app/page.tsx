"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState<any>(null);

  const handleLogin = async () => {
    try {
      const res = await fetch(
        "https://lumetra-api-production.up.railway.app/login",
        {
          method: "POST",
          mode: "cors", // 🔥 CLAVE
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Error de red o backend");
      }

      const data = await res.json();

      if (data.ok) {
        localStorage.setItem("token", data.token);
        router.push("/dashboard");
      } else {
        alert(data.error || "Login fallido");
      }

      setResult(data);
    } catch (err) {
      console.error("ERROR LOGIN:", err);
      alert("Error conectando al servidor");
    }
  };

  const handleMe = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "https://lumetra-api-production.up.railway.app/me",
        {
          method: "GET",
          mode: "cors", // 🔥 CLAVE
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error("ERROR /me:", err);
      alert("Error obteniendo usuario");
    }
  };

  return (
    <div
      style={{
        padding: 40,
        background: "black",
        color: "white",
        minHeight: "100vh",
      }}
    >
      <h1>Login</h1>

      <input
        style={{ padding: 10, marginBottom: 10 }}
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />

      <input
        style={{ padding: 10, marginBottom: 10 }}
        placeholder="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />

      <button
        onClick={handleLogin}
        style={{
          padding: "10px 20px",
          background: "blue",
          color: "white",
          border: "none",
          marginRight: 10,
        }}
      >
        Login
      </button>

      <button
        onClick={handleMe}
        style={{
          padding: "10px 20px",
          background: "green",
          color: "white",
          border: "none",
        }}
      >
        Obtener usuario (/me)
      </button>

      <pre style={{ marginTop: 20 }}>
        {JSON.stringify(result, null, 2)}
      </pre>
    </div>
  );
}