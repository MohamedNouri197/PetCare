"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useAnimals } from "@/hooks/useAnimals";
import { api } from "@/lib/api";
import type { ChatMessage } from "@/types";
import PageContainer from "@/components/layout/PageContainer";
import ChatBubble from "@/components/assistant/ChatBubble";
import SymptomSelector from "@/components/assistant/SymptomSelector";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import Card from "@/components/ui/Card";
import { Send, Bot, AlertTriangle } from "lucide-react";

export default function AssistantPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { animals, isLoading: animalsLoading } = useAnimals();
  const router = useRouter();
  const [selectedAnimalId, setSelectedAnimalId] = useState<string>("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isAsking, setIsAsking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

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

  const handleAsk = async () => {
    if (!selectedAnimalId || selectedSymptoms.length === 0) return;

    const selectedAnimal = animals.find((a) => a.id === selectedAnimalId);
    const symptomLabels = selectedSymptoms.join(", ");

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: `Animal: ${selectedAnimal?.name || "Inconnu"}\nSymptomes: ${symptomLabels}${additionalInfo ? `\nInformations supplementaires: ${additionalInfo}` : ""}`,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsAsking(true);

    try {
      const response = await api.askAssistant({
        animalId: selectedAnimalId,
        symptoms: selectedSymptoms,
        additionalInfo: additionalInfo || undefined,
      });

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.message,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Desole, une erreur est survenue. Veuillez reessayer plus tard.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsAsking(false);
      setSelectedSymptoms([]);
      setAdditionalInfo("");
    }
  };

  if (authLoading || animalsLoading) return <LoadingSpinner fullScreen />;
  if (!isAuthenticated) return null;

  return (
    <PageContainer title="Assistant sante" subtitle="Obtenez un premier avis sur les symptomes de votre animal">
      <div className="max-w-2xl mx-auto">
        {/* Disclaimer */}
        <Card className="!bg-warning/5 !border-warning/20 dark:!bg-warning/10 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-textColor dark:text-textColor-dark">
                Avertissement important
              </h3>
              <p className="text-xs text-textColor-light dark:text-textColor-dark-light mt-1">
                Cet assistant fournit des informations generales et ne remplace en aucun cas un diagnostic
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
                <div className="w-8 h-8 rounded-full bg-accent/10 dark:bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-accent" />
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-md px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }} />
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
            <div className="w-16 h-16 rounded-full bg-accent/10 dark:bg-accent/20 flex items-center justify-center mx-auto mb-4">
              <Bot className="w-8 h-8 text-accent" />
            </div>
            <h2 className="text-lg font-semibold text-textColor dark:text-textColor-dark">
              Comment puis-je vous aider ?
            </h2>
            <p className="text-sm text-textColor-light dark:text-textColor-dark-light mt-2">
              Selectionnez un animal et les symptomes observes pour obtenir un avis.
            </p>
          </div>
        )}

        {/* Input Area */}
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
              onClick={handleAsk}
              isLoading={isAsking}
              disabled={!selectedAnimalId || selectedSymptoms.length === 0}
            >
              <Send className="w-4 h-4 mr-2" />
              Obtenir un avis
            </Button>
          </div>
        </Card>

        {/* Disclaimer footer */}
        <p className="text-center text-xs text-textColor-light dark:text-textColor-dark-light mt-6 pb-4">
          Cet outil ne remplace pas un diagnostic veterinaire. Consultez toujours un professionnel en cas de doute.
        </p>
      </div>
    </PageContainer>
  );
}
