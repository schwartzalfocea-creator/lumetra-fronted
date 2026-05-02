"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/");
      return;
    }

    fetch("https://lumetra-api-production.up.railway.app/me", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.ok) {
          router.push("/");
        } else {
          setUser(data.user);
        }
      });
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1>Dashboard</h1>

      {user && (
        <>
          <p>ID: {user.id}</p>
          <p>Email: {user.email}</p>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              router.push("/");
            }}
            style={{
              marginTop: 20,
              padding: "10px",
              background: "red",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </>
      )}
    </div>
  );
}