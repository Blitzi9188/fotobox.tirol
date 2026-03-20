"use client";

import { FormEvent, useState } from "react";

export default function AdminLoginForm({
  onSuccess
}: {
  onSuccess: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="username" required />
      </label>
      <label className="admin-field">
        <span>Passwort</span>
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" autoComplete="current-password" required />
      </label>
      {error && <p className="admin-error">{error}</p>}
      <button className="btn" type="submit" disabled={loading}>
        {loading ? "Prüfe..." : "Einloggen"}
      </button>
    </form>
  );
}
