import React, { useState } from "react";
import { aiService } from "../../services/aiService";
import { X } from "lucide-react";
import useAuth from "../../hooks/useAuth";

const ROLES = [
  { key: "ANALYSIS", label: "Analysis", color: "border-blue-400 bg-blue-50" },
  { key: "DECISION_SUPPORT", label: "Decision", color: "border-purple-400 bg-purple-50" },
  { key: "EMAIL_CREATION", label: "Email", color: "border-green-400 bg-green-50" },
  { key: "ACTION", label: "Action", color: "border-red-400 bg-red-50" },
];

const PROVIDERS = ["ollama", "openai", "google", "anthropic", "deepseek"];

export default function AiChat() {
  const { activeDbKey } = useAuth();
  const [activeRole, setActiveRole] = useState("ANALYSIS");
  const [showSettings, setShowSettings] = useState(false);

  const [provider, setProvider] = useState("ollama");
  const [model, setModel] = useState("gemma3:4b");
  const [temperature, setTemperature] = useState(0.3);
  const [topP, setTopP] = useState(0.95);
  const [maxTokens, setMaxTokens] = useState(800);

  const [conversationId] = useState(
    Math.random().toString(36).substring(2, 15)
  );

  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);

  const sendPrompt = async () => {
    if (!prompt.trim()) return;

    const userMessage = { sender: "USER", text: prompt };
    setMessages((m) => [...m, userMessage]);
    setPrompt("");

    let aiText = "";

    await aiService.chat(
      {
        provider,
        model: model || null,
        systemPromptProfile: activeRole,
        conversationId,
        crmDatabaseId : activeDbKey,
        prompt: userMessage.text,
        temperature,
        topP,
        maxTokens,
      },
      (delta) => {
        aiText += delta;
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== "stream"),
          {
            id: "stream",
            sender: activeRole,
            text: aiText,
          },
        ]);
      }
    );
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-6">

      {/* ROLE SELECTOR */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {ROLES.map((r) => (
          <button
            key={r.key}
            onClick={() => setActiveRole(r.key)}
            className={`border rounded-lg px-4 py-3 font-semibold transition
              ${activeRole === r.key ? r.color : "bg-gray-50 hover:bg-gray-100"}
            `}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* SETTINGS BUTTON */}
      <button
        className="mb-4 px-4 py-2 bg-[#165C6D] text-white rounded-md"
        onClick={() => setShowSettings(true)}
      >
        Inställningar
      </button>

      {/* CHAT WINDOW */}
      <div className="h-96 overflow-y-auto border rounded-lg p-4 space-y-3 mb-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg max-w-[80%]
              ${m.sender === "USER"
                ? "ml-auto bg-gray-200"
                : "mr-auto border " +
                  ROLES.find((r) => r.key === m.sender)?.color}
            `}
          >
            {m.sender !== "USER" && (
              <div className="text-xs font-semibold mb-1 text-gray-600">
                {m.sender}
              </div>
            )}
            {m.text}
          </div>
        ))}
      </div>

      {/* PROMPT INPUT */}
      <div className="flex gap-2">
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Skriv ditt meddelande…"
          className="flex-1 border px-4 py-2 rounded-lg"
        />
        <button
          onClick={sendPrompt}
          className="bg-[#165C6D] text-white px-6 rounded-lg font-semibold"
        >
          Skicka
        </button>
      </div>

      {/* SETTINGS MODAL */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-lg p-6 relative">

            <button
              onClick={() => setShowSettings(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold text-[#165C6D] mb-4">
              AI-inställningar
            </h2>

            <div className="space-y-4">

              {/* Provider */}
              <div>
                <label className="font-semibold block mb-1">Provider</label>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="border px-3 py-2 rounded w-full"
                >
                  {PROVIDERS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              {/* Model */}
              <div>
                <label className="font-semibold block mb-1">Model</label>
                <input
                  placeholder="Valfri modell"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="border px-3 py-2 rounded w-full"
                />
              </div>

              {/* Temperature */}
              <div>
                <label className="font-semibold">
                  Temperature: {temperature}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* TopP */}
              <div>
                <label className="font-semibold">Top-P: {topP}</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={topP}
                  onChange={(e) => setTopP(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Max tokens */}
              <div>
                <label className="font-semibold block mb-1">Max tokens (som modellen leverar per prompt)</label>
                <input
                  type="number"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(Number(e.target.value))}
                  className="border px-3 py-2 rounded w-full"
                />
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
