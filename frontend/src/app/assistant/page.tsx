"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useAnimals } from "@/hooks/useAnimals";
import { generateAIResponse, generateFreeChatResponse } from "@/lib/ai-mock";
import type { ChatMessage } from "@/types";
import PageContainer from "@/components/layout/PageContainer";
import ChatBubble from "@/components/assistant/ChatBubble";
import SymptomSelector from "@/components/assistant/SymptomSelector";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Send, Bot, AlertTriangle, MessageSquare, Stethoscope, Sparkles } from "lucide-react";

type Mode = "symptoms" | "chat";

export default function AssistantPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { animals, isLoading: animalsLoading } = useAnimals();
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("symptoms");
  const [selectedAnimalId, setSelectedAnimalId] = useState<string>("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isAsking, setIsAsking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/login");
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (animals.length > 0 && !selectedAnimalId) {
      setSelectedAnimalId(animals[0].id);
    }
  }, [animals, selectedAnimalId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSymptomAnalysis = async () => {
    if (!selectedAnimalId || selectedSymptoms.length === 0) return;

    const selectedAnimal = animals.find((a) => a.id === selectedAnimalId);
    const symptomLabels = selectedSymptoms.join(", ");

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: `🐾 Animal: ${selectedAnimal?.name || "Inconnu"}\n📋 Symptomes: ${symptomLabels}${additionalInfo ? `\n📝 Details: ${additionalInfo}` : ""}`,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsAsking(true);

    await new Promise((r) => setTimeout(r, 1500 + Math.random() * 1500));

    const response = generateAIResponse(selectedSymptoms, selectedAnimal, additionalInfo);

    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: response,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsAsking(false);
    setSelectedSymptoms([]);
    setAdditionalInfo("");
  };

  const handleFreeChat = async () => {
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: chatInput,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setIsAsking(true);

    await new Promise((r) => setTimeout(r, 800 + Math.random() * 1200));

    const response = generateFreeChatResponse(chatInput);

    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: response,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsAsking(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleFreeChat();
    }
  };

  const suggestedQuestions = [
    "Quelle alimentation pour mon chien ?",
    "Calendrier de vaccination",
    "Mon animal est en surpoids",
    "Signes d'urgence veterinaire",
    "Prevention des parasites",
    "Hygiene dentaire",
  ];

  if (authLoading || animalsLoading) return <LoadingSpinner fullScreen />;
  if (!isAuthenticated) return null;

  return (
    <PageContainer title="Assistant IA" subtitle="Posez vos questions ou analysez des symptomes">
      <div className="max-w-2xl mx-auto">
        {/* Mode Switch */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode("symptoms")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              mode === "symptoms"
                ? "bg-primary text-white shadow-md"
                : "bg-surface dark:bg-surface-dark text-textColor-light dark:text-textColor-dark-light border border-gray-200 dark:border-gray-600 hover:border-primary"
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            Analyse symptomes
          </button>
          <button
            onClick={() => setMode("chat")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              mode === "chat"
                ? "bg-primary text-white shadow-md"
                : "bg-surface dark:bg-surface-dark text-textColor-light dark:text-textColor-dark-light border border-gray-200 dark:border-gray-600 hover:border-primary"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Chat libre
          </button>
        </div>

        {/* Disclaimer */}
        <Card className="!bg-warning/5 !border-warning/20 dark:!bg-warning/10 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-textColor dark:text-textColor-dark">
                Avertissement important
              </h3>
              <p className="text-xs text-textColor-light dark:text-textColor-dark-light mt-1">
                Cet assistant IA fournit des informations generales et ne remplace en aucun cas un diagnostic
                veterinaire professionnel. En cas d&apos;urgence, contactez immediatement votre veterinaire.
              </p>
            </div>
          </div>
        </Card>

        {/* Chat Messages */}
        {messages.length > 0 && (
          <div className="space-y-4 mb-6">
            {messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} />
            ))}
            {isAsking && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-md px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                    <span className="text-xs text-textColor-light dark:text-textColor-dark-light">
                      {mode === "symptoms" ? "Analyse en cours..." : "Reflexion..."}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        )}

        {/* Welcome */}
        {messages.length === 0 && (
          <div className="text-center py-8 mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Bot className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-textColor dark:text-textColor-dark">
              Assistant veterinaire IA
            </h2>
            <p className="text-sm text-textColor-light dark:text-textColor-dark-light mt-2 mb-6">
              {mode === "symptoms"
                ? "Selectionnez un animal et les symptomes observes pour obtenir une analyse detaillee."
                : "Posez vos questions sur la sante, l'alimentation ou le comportement de votre animal."}
            </p>

            {mode === "chat" && (
              <div className="flex flex-wrap justify-center gap-2">
                {suggestedQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => {
                      setChatInput(q);
                      setTimeout(() => {
                        const fakeMsg: ChatMessage = {
                          id: Date.now().toString(),
                          role: "user",
                          content: q,
                          timestamp: new Date().toISOString(),
                        };
                        setMessages((prev) => [...prev, fakeMsg]);
                        setIsAsking(true);
                        setTimeout(() => {
                          const response = generateFreeChatResponse(q);
                          setMessages((prev) => [
                            ...prev,
                            { id: (Date.now() + 1).toString(), role: "assistant", content: response, timestamp: new Date().toISOString() },
                          ]);
                          setIsAsking(false);
                          setChatInput("");
                        }, 1000);
                      }, 100);
                    }}
                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Input Area */}
        {mode === "symptoms" ? (
          <Card>
            <div className="space-y-4">
              <Select
                label="Animal concerne"
                value={selectedAnimalId}
                onChange={(e) => setSelectedAnimalId(e.target.value)}
                options={animals.map((a) => ({ value: a.id, label: a.name }))}
                placeholder="Choisir un animal"
              />

              <SymptomSelector selected={selectedSymptoms} onChange={setSelectedSymptoms} />

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-textColor dark:text-textColor-dark">
                  Informations supplementaires (optionnel)
                </label>
                <textarea
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-surface dark:bg-surface-dark px-4 py-2.5 text-sm text-textColor dark:text-textColor-dark placeholder:text-textColor-light focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 min-h-[60px] resize-y"
                  placeholder="Decrivez le comportement de votre animal, depuis quand les symptomes sont apparus..."
                />
              </div>

              <Button
                fullWidth
                onClick={handleSymptomAnalysis}
                isLoading={isAsking}
                disabled={!selectedAnimalId || selectedSymptoms.length === 0}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Analyser avec l&apos;IA
              </Button>
            </div>
          </Card>
        ) : (
          <Card>
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Posez votre question..."
                className="flex-1 rounded-xl border border-gray-200 dark:border-gray-600 bg-surface dark:bg-surface-dark px-4 py-2.5 text-sm text-textColor dark:text-textColor-dark placeholder:text-textColor-light focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                disabled={isAsking}
              />
              <Button onClick={handleFreeChat} disabled={!chatInput.trim() || isAsking} isLoading={isAsking}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        )}

        <p className="text-center text-xs text-textColor-light dark:text-textColor-dark-light mt-6 pb-4">
          Propulse par l&apos;IA PetCare • Ne remplace pas un diagnostic veterinaire
        </p>
      </div>
    </PageContainer>
  );
}
