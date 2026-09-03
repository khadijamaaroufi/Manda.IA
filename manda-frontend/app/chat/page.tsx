"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export default function ChatAssistantPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (!token || !storedUser) {
      router.push("/login");
      return;
    }
    setUserId(JSON.parse(storedUser).id);
  }, [router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || !userId) return;
    setHasInteracted(true);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
    };

    // Historique complet à envoyer, incluant le nouveau message
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:8000/users/${userId}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok) {
        throw new Error("Erreur de communication avec Manda");
      }

      const data = await res.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.reply,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          role: "assistant",
          content: "Désolé, une erreur est survenue. Réessaie.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-lg mx-auto w-full border-x border-gray-100">
      {/* En-tête */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
        <h1 className="text-[18px] font-bold text-[#0B1229]">Manda</h1>
        <button onClick={() => router.push("/dashboard")}>
          <X className="w-5 h-5 text-[#8B93A7]" />
        </button>
      </div>

      {/* Zone de contenu principal */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {!hasInteracted && messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full space-y-6">
            <div className="w-32 h-32 rounded-full bg-gray-100 overflow-hidden shadow-lg">
              <Image
                src="/robot1.png"
                alt="Assistant robot"
                width={128}
                height={128}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="text-center">
              <p className="text-sm text-[#8B93A7]">Salam, je suis</p>
              <p className="text-xl font-semibold text-[#0B1229]">Manda, ton coach financier</p>
              <p className="text-sm text-[#8B93A7] mt-1">Comment puis-je t&apos;aider ?</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                    <Image src="/robot1.png" alt="Robot" width={32} height={32} className="object-cover" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                    msg.role === "user" ? "bg-[#2563EB] text-white" : "bg-gray-100 text-[#0B1229]"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                  <Image src="/robot1.png" alt="Robot" width={32} height={32} className="object-cover" />
                </div>
                <div className="bg-gray-100 rounded-2xl px-4 py-2 text-sm text-[#0B1229]">
                  <span className="animate-pulse">...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Champ de saisie */}
      <div className="border-t border-gray-200 p-4 flex items-center gap-2 bg-white">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
          placeholder="Écris à Manda..."
          className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#2563EB]"
          disabled={loading}
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={loading || !input.trim()}
          className="bg-[#2563EB] text-white p-2 rounded-full hover:bg-[#1D4ED8] disabled:opacity-50 transition"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}