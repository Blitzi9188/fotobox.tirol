"use client";

import { FormEvent, useState } from "react";

export default function AdminLoginForm({
  onSuccess
}: {
  onSuccess: () => void;
}) {
  const [email, setEmail] = useState("admin@fotoboxtirol.at");
  const [password, setPassword] = useState("admin1234");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    setLoading(false);

    if (!response.ok) {
      setError("Ungültige Anmeldedaten.");
      return;
    }

    onSuccess();
  }

  return (
    <form className="admin-card" onSubmit={handleSubmit}>
      <h1>Admin Login</h1>
      <label className="admin-field">
        <span>E-Mail</span>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
      </label>
      <label className="admin-field">
        <span>Passwort</span>
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
      </label>
      {error && <p className="admin-error">{error}</p>}
      <button className="btn" type="submit" disabled={loading}>
        {loading ? "Prüfe..." : "Einloggen"}
      </button>
      <p className="admin-note">Standard: admin@fotoboxtirol.at / admin1234 (über .env änderbar)</p>
    </form>
  );
}
