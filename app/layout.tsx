"use client";

import "./globals.css";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setUser(null);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch("https://lumetra-api-production.up.railway.app", {
          headers: {
            Authorization: "Bearer " + token,
          },
        });

        const data = await res.json();

        if (data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    };

    fetchUser();
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/");
  };

  return (
    <html lang="en">
      <body className="bg-black text-white">

        {/* 🔥 NAVBAR SOLO SI HAY USER */}
        {user && (
          <div className="flex justify-between items-center px-8 py-4 border-b border-zinc-700 bg-zinc-900">
            <h1 className="text-xl font-bold">Lumetra</h1>

            <div className="flex items-center gap-4">
              <span className="text-zinc-400 text-sm">{user.email}</span>

              <button
                onClick={handleLogout}
                className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          </div>
        )}

        {/* CONTENIDO */}
        <main>{children}</main>

      </body>
    </html>
  );
}