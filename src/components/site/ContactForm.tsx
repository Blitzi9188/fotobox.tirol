"use client";

import { FormEvent, useState } from "react";
import { PricePlan } from "@/lib/types";

type PackageOption = Pick<PricePlan, "name" | "price">;

export default function ContactForm({
  plans = [],
  initialPackage
}: {
  plans?: PackageOption[];
  initialPackage?: string;
}) {
  const safePlans: PackageOption[] = plans.length > 0 ? plans : [{ name: "Allgemeine Anfrage", price: 0 }];
  const [status, setStatus] = useState("");
  const [selectedPackage, setSelectedPackage] = useState(initialPackage || safePlans[0]?.name || "");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const payload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      eventDate: String(formData.get("eventDate") || ""),
      packageName: String(formData.get("packageName") || ""),
      message: String(formData.get("message") || "")
    };

    const subject = `Kontaktanfrage: ${payload.packageName || "Fotobox"}`;
    const body = [
      `Name: ${payload.name}`,
      `E-Mail: ${payload.email}`,
      `Telefon: ${payload.phone || "-"}`,
      `Event Datum: ${payload.eventDate || "-"}`,
      `Paket: ${payload.packageName || "-"}`,
      "",
      `Nachricht: ${payload.message || "-"}`
    ].join("\n");
    window.location.href = `mailto:info@fotobox.tirol?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    setStatus("E-Mail wird vorbereitet.");
    event.currentTarget.reset();
    setSelectedPackage(initialPackage || safePlans[0]?.name || "");
  }

  return (
    <form className="admin-card" onSubmit={handleSubmit}>
      <h2>Unverbindliche Preisanfrage</h2>
      <label className="admin-field">
        <span>Name</span>
        <input name="name" required />
      </label>
      <label className="admin-field">
        <span>E-Mail</span>
        <input name="email" type="email" required />
      </label>
      <label className="admin-field">
        <span>Telefon</span>
        <input name="phone" />
      </label>
      <label className="admin-field">
        <span>Event Datum</span>
        <input name="eventDate" type="date" />
      </label>
      <label className="admin-field">
        <span>Paket Auswahl</span>
        <select
          name="packageName"
          value={selectedPackage}
          onChange={(event) => setSelectedPackage(event.target.value)}
          required
        >
          {safePlans.map((plan) => (
            <option key={plan.name} value={plan.name}>
              {plan.price > 0 ? `${plan.name} - ${plan.price}€` : plan.name}
            </option>
          ))}
        </select>
      </label>
      <label className="admin-field">
        <span>Nachricht</span>
        <textarea name="message" rows={5} required />
      </label>
      <button className="btn" type="submit">Absenden</button>
      {status && <p className="admin-status">{status}</p>}
    </form>
  );
}
