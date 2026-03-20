"use client";

import { useCallback, useEffect, useState } from "react";

type CaptchaResponse = {
  question: string;
  token: string;
};

export default function CaptchaField({
  token,
  answer,
  onTokenChange,
  onAnswerChange,
  refreshKey = 0
}: {
  token: string;
  answer: string;
  onTokenChange: (value: string) => void;
  onAnswerChange: (value: string) => void;
  refreshKey?: number;
}) {
  const [question, setQuestion] = useState("Lade Sicherheitsfrage...");

  const loadChallenge = useCallback(async () => {
    try {
      const response = await fetch(`/api/captcha?t=${Date.now()}`, { cache: "no-store" });
      if (!response.ok) throw new Error("captcha-load-failed");
      const json = (await response.json()) as CaptchaResponse;
      setQuestion(json.question || "Bitte neue Aufgabe laden.");
      onTokenChange(json.token || "");
      onAnswerChange("");
    } catch {
      setQuestion("Sicherheitsfrage konnte nicht geladen werden.");
      onTokenChange("");
      onAnswerChange("");
    }
  }, [onAnswerChange, onTokenChange]);

  useEffect(() => {
    loadChallenge();
  }, [loadChallenge, refreshKey]);

  return (
    <div className="inquiry-captcha-widget">
      <div className="inquiry-captcha-row">
        <div className="inquiry-captcha-question">{question}</div>
        <button type="button" className="inquiry-captcha-refresh" onClick={loadChallenge}>
          Neu
        </button>
      </div>
      <input type="hidden" name="captchaToken" value={token} />
      <input
        type="text"
        name="captchaAnswer"
        value={answer}
        onChange={(event) => onAnswerChange(event.target.value)}
        placeholder="Antwort"
        required
      />
    </div>
  );
}
