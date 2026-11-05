"use client";

import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import PageContainer from "@/components/layout/PageContainer";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import {
  MessageCircle,
  Send,
  Paperclip,
  ArrowLeft,
  Plus,
  Search,
  Phone,
  Video,
  MoreVertical,
  Check,
  CheckCheck,
  ChevronDown,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  role: "owner" | "veterinarian";
  specialty?: string;
  online: boolean;
  avatarColor: string;
}

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  timestamp: string; // ISO
  read: boolean;
}

interface Conversation {
  id: string;
  contactId: string;
  animalContext?: string; // e.g. "Max (Labrador)"
  messages: Message[];
  typing: boolean;
}

// ---------------------------------------------------------------------------
// Mock data helpers
// ---------------------------------------------------------------------------

const STORE_KEY = "petcare_mock_chats";

const AVATAR_COLORS = [
  "bg-primary",
  "bg-secondary",
  "bg-accent",
  "bg-amber-500",
  "bg-rose-500",
  "bg-indigo-500",
  "bg-teal-500",
];

const MOCK_CONTACTS: Contact[] = [
  {
    id: "vet-1",
    firstName: "Jean",
    lastName: "Dupont",
    role: "veterinarian",
    specialty: "Generaliste",
    online: true,
    avatarColor: AVATAR_COLORS[0],
  },
  {
    id: "vet-2",
    firstName: "Marie",
    lastName: "Laurent",
    role: "veterinarian",
    specialty: "Dermatologue animalier",
    online: true,
    avatarColor: AVATAR_COLORS[1],
  },
  {
    id: "vet-3",
    firstName: "Pierre",
    lastName: "Martin",
    role: "veterinarian",
    specialty: "Chirurgien",
    online: false,
    avatarColor: AVATAR_COLORS[2],
  },
];

function buildMockConversations(userId: string): Conversation[] {
  const now = Date.now();
  const min = 60_000;
  const hour = 3_600_000;

  return [
    {
      id: "conv-1",
      contactId: "vet-1",
      animalContext: "Max (Labrador)",
      typing: false,
      messages: [
        { id: "m1-1", conversationId: "conv-1", senderId: "vet-1", text: "Bonjour ! Comment va Max depuis sa derniere visite ?", timestamp: new Date(now - 5 * hour).toISOString(), read: true },
        { id: "m1-2", conversationId: "conv-1", senderId: userId, text: "Bonjour Dr. Dupont, il va beaucoup mieux ! Il mange bien et est tres actif.", timestamp: new Date(now - 4.5 * hour).toISOString(), read: true },
        { id: "m1-3", conversationId: "conv-1", senderId: "vet-1", text: "Tres bien ! N'oubliez pas son rappel de vaccination dans 2 semaines.", timestamp: new Date(now - 4 * hour).toISOString(), read: true },
        { id: "m1-4", conversationId: "conv-1", senderId: userId, text: "Oui, c'est note. Est-ce que je dois prendre rendez-vous a l'avance ?", timestamp: new Date(now - 3.5 * hour).toISOString(), read: true },
        { id: "m1-5", conversationId: "conv-1", senderId: "vet-1", text: "Oui, appelez le cabinet ou reservez en ligne. Le vaccin DHPP est disponible.", timestamp: new Date(now - 3 * hour).toISOString(), read: true },
        { id: "m1-6", conversationId: "conv-1", senderId: userId, text: "Parfait, je reserve un creneau cette semaine. Merci beaucoup !", timestamp: new Date(now - 2 * hour).toISOString(), read: true },
        { id: "m1-7", conversationId: "conv-1", senderId: "vet-1", text: "De rien ! Si Max montre le moindre signe de fatigue ou perte d'appetit, n'hesitez pas a me contacter.", timestamp: new Date(now - 1.5 * hour).toISOString(), read: false },
      ],
    },
    {
      id: "conv-2",
      contactId: "vet-2",
      animalContext: "Luna (Chat europeen)",
      typing: false,
      messages: [
        { id: "m2-1", conversationId: "conv-2", senderId: userId, text: "Bonjour Dr. Laurent, Luna se gratte enormement depuis quelques jours.", timestamp: new Date(now - 26 * hour).toISOString(), read: true },
        { id: "m2-2", conversationId: "conv-2", senderId: "vet-2", text: "Bonjour, est-ce localise sur une zone en particulier ?", timestamp: new Date(now - 25 * hour).toISOString(), read: true },
        { id: "m2-3", conversationId: "conv-2", senderId: userId, text: "Oui, surtout derriere les oreilles et sur le ventre. J'ai remarque des petites rougeurs.", timestamp: new Date(now - 24 * hour).toISOString(), read: true },
        { id: "m2-4", conversationId: "conv-2", senderId: "vet-2", text: "Cela pourrait etre une dermatite allergique ou des puces. Utilisez-vous un antiparasitaire ?", timestamp: new Date(now - 23 * hour).toISOString(), read: true },
        { id: "m2-5", conversationId: "conv-2", senderId: userId, text: "Non, pas recemment. Je vais en acheter. Faut-il quand meme consulter ?", timestamp: new Date(now - 22 * hour).toISOString(), read: true },
        { id: "m2-6", conversationId: "conv-2", senderId: "vet-2", text: "Appliquez un antiparasitaire d'abord. Si les demangeaisons persistent apres 48h, prenez rendez-vous pour un examen dermatologique.", timestamp: new Date(now - 21 * hour).toISOString(), read: true },
        { id: "m2-7", conversationId: "conv-2", senderId: userId, text: "D'accord, je fais ca tout de suite. Merci pour vos conseils !", timestamp: new Date(now - 20 * hour).toISOString(), read: true },
        { id: "m2-8", conversationId: "conv-2", senderId: "vet-2", text: "Je vous en prie. Tenez-moi au courant de l'evolution. Bon courage avec Luna !", timestamp: new Date(now - 19 * hour).toISOString(), read: false },
      ],
    },
    {
      id: "conv-3",
      contactId: "vet-3",
      animalContext: "Caramel (Lapin nain)",
      typing: false,
      messages: [
        { id: "m3-1", conversationId: "conv-3", senderId: "vet-3", text: "Bonjour, suite a notre consultation, je vous confirme que l'operation de Caramel est prevue pour mardi prochain.", timestamp: new Date(now - 72 * hour).toISOString(), read: true },
        { id: "m3-2", conversationId: "conv-3", senderId: userId, text: "Merci Dr. Martin. Y a-t-il des consignes particulieres avant l'intervention ?", timestamp: new Date(now - 71 * hour).toISOString(), read: true },
        { id: "m3-3", conversationId: "conv-3", senderId: "vet-3", text: "Oui, Caramel doit etre a jeun 12h avant. Pas de nourriture apres 20h la veille. L'eau est autorisee.", timestamp: new Date(now - 70 * hour).toISOString(), read: true },
        { id: "m3-4", conversationId: "conv-3", senderId: userId, text: "Compris. L'operation est risquee pour un lapin ?", timestamp: new Date(now - 69 * hour).toISOString(), read: true },
        { id: "m3-5", conversationId: "conv-3", senderId: "vet-3", text: "C'est une intervention courante avec un taux de reussite eleve. Caramel est jeune et en bonne sante, tout devrait bien se passer.", timestamp: new Date(now - 68 * hour).toISOString(), read: true },
        { id: "m3-6", conversationId: "conv-3", senderId: userId, text: "Ca me rassure. A quelle heure dois-je l'amener mardi ?", timestamp: new Date(now - 48 * hour).toISOString(), read: true },
        { id: "m3-7", conversationId: "conv-3", senderId: "vet-3", text: "Amenez-le a 8h30. Vous pourrez le recuperer en fin d'apres-midi vers 17h. Je vous appellerai apres l'operation.", timestamp: new Date(now - 47 * hour).toISOString(), read: true },
      ],
    },
  ];
}

const AUTO_RESPONSES: Record<string, string[]> = {
  "vet-1": [
    "Je comprends votre inquietude. Surveillez bien son comportement ces prochains jours.",
    "N'hesitez pas a prendre rendez-vous si les symptomes persistent.",
    "C'est tout a fait normal apres une vaccination. Pas d'inquietude !",
    "Je vous recommande de continuer le traitement pendant encore une semaine.",
    "Tres bien, tenez-moi au courant de l'evolution de Max.",
  ],
  "vet-2": [
    "Les demangeaisons devraient diminuer dans les 48 heures avec le traitement.",
    "Avez-vous change de nourriture recemment ? Cela peut provoquer des reactions cutanees.",
    "Je vous conseille d'utiliser un shampooing hypoallergenique pour les prochains bains.",
    "Si les rougeurs s'etendent, envoyez-moi une photo pour que je puisse evaluer.",
    "Luna devrait se sentir mieux tres bientot. Courage !",
  ],
  "vet-3": [
    "L'operation se passera tres bien, ne vous inquietez pas.",
    "Pensez a preparer un espace calme pour sa convalescence.",
    "La recuperation prend generalement 5 a 7 jours pour ce type d'intervention.",
    "Vous pourrez le nourrir normalement le soir apres l'operation.",
    "N'hesitez pas a m'appeler si vous avez la moindre question avant mardi.",
  ],
};

function getConversations(userId: string): Conversation[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORE_KEY);
    if (data) return JSON.parse(data);
    const initial = buildMockConversations(userId);
    localStorage.setItem(STORE_KEY, JSON.stringify(initial));
    return initial;
  } catch {
    return [];
  }
}

function saveConversations(conversations: Conversation[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(conversations));
  } catch {
    // quota exceeded — silently ignore
  }
}

function getContact(id: string): Contact | undefined {
  return MOCK_CONTACTS.find((c) => c.id === id);
}

function formatMessageTime(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function formatConversationDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return formatMessageTime(iso);
  if (days === 1) return "Hier";
  if (days < 7) {
    const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
    return dayNames[d.getDay()];
  }
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function shouldShowDateSeparator(current: string, previous: string | null): boolean {
  if (!previous) return true;
  const a = new Date(current).toDateString();
  const b = new Date(previous).toDateString();
  return a !== b;
}

function formatDateSeparator(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return "Aujourd'hui";
  if (days === 1) return "Hier";
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ChatPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileShowChat, setMobileShowChat] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auth guard
  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/login");
  }, [isAuthenticated, authLoading, router]);

  // Load conversations
  useEffect(() => {
    if (user) {
      setConversations(getConversations(user.id));
    }
  }, [user]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations, activeConvId]);

  // Focus input when conversation opens
  useEffect(() => {
    if (activeConvId) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [activeConvId]);

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeConvId) ?? null,
    [conversations, activeConvId]
  );

  const activeContact = useMemo(
    () => (activeConversation ? getContact(activeConversation.contactId) : null),
    [activeConversation]
  );

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const q = searchQuery.toLowerCase();
    return conversations.filter((conv) => {
      const contact = getContact(conv.contactId);
      if (!contact) return false;
      const name = `${contact.firstName} ${contact.lastName}`.toLowerCase();
      const lastMsg = conv.messages[conv.messages.length - 1]?.text.toLowerCase() ?? "";
      return name.includes(q) || lastMsg.includes(q) || (conv.animalContext ?? "").toLowerCase().includes(q);
    });
  }, [conversations, searchQuery]);

  const unreadCount = useCallback(
    (conv: Conversation) => {
      if (!user) return 0;
      return conv.messages.filter((m) => !m.read && m.senderId !== user.id).length;
    },
    [user]
  );

  const totalUnread = useMemo(
    () => conversations.reduce((sum, c) => sum + unreadCount(c), 0),
    [conversations, unreadCount]
  );

  // Mark messages as read when opening a conversation
  const openConversation = useCallback(
    (convId: string) => {
      setActiveConvId(convId);
      setMobileShowChat(true);
      if (!user) return;
      setConversations((prev) => {
        const updated = prev.map((c) => {
          if (c.id !== convId) return c;
          return {
            ...c,
            messages: c.messages.map((m) =>
              m.senderId !== user.id ? { ...m, read: true } : m
            ),
          };
        });
        saveConversations(updated);
        return updated;
      });
    },
    [user]
  );

  // Send a message
  const handleSend = useCallback(() => {
    if (!inputText.trim() || !activeConvId || !user) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      conversationId: activeConvId,
      senderId: user.id,
      text: inputText.trim(),
      timestamp: new Date().toISOString(),
      read: true,
    };

    setConversations((prev) => {
      const updated = prev.map((c) => {
        if (c.id !== activeConvId) return c;
        return { ...c, messages: [...c.messages, newMsg] };
      });
      saveConversations(updated);
      return updated;
    });

    setInputText("");

    // Simulate typing then auto-reply
    const contactId = conversations.find((c) => c.id === activeConvId)?.contactId;
    if (!contactId) return;

    // Show typing indicator
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    setTimeout(() => {
      setConversations((prev) =>
        prev.map((c) => (c.id === activeConvId ? { ...c, typing: true } : c))
      );
    }, 800);

    // Send auto-response
    const delay = 2000 + Math.random() * 1500;
    typingTimeoutRef.current = setTimeout(() => {
      const responses = AUTO_RESPONSES[contactId] ?? [];
      const responseText =
        responses[Math.floor(Math.random() * responses.length)] ??
        "Merci pour votre message. Je vous recontacte bientot.";

      const replyMsg: Message = {
        id: `msg-${Date.now()}`,
        conversationId: activeConvId,
        senderId: contactId,
        text: responseText,
        timestamp: new Date().toISOString(),
        read: true,
      };

      setConversations((prev) => {
        const updated = prev.map((c) => {
          if (c.id !== activeConvId) return c;
          return { ...c, typing: false, messages: [...c.messages, replyMsg] };
        });
        saveConversations(updated);
        return updated;
      });
    }, delay);
  }, [inputText, activeConvId, user, conversations]);

  // Start a new conversation with a vet
  const startNewConversation = useCallback(
    (contact: Contact) => {
      if (!user) return;
      // Check if conversation already exists
      const existing = conversations.find((c) => c.contactId === contact.id);
      if (existing) {
        openConversation(existing.id);
        setShowNewChatModal(false);
        return;
      }

      const newConv: Conversation = {
        id: `conv-${Date.now()}`,
        contactId: contact.id,
        typing: false,
        messages: [],
      };

      setConversations((prev) => {
        const updated = [newConv, ...prev];
        saveConversations(updated);
        return updated;
      });

      setActiveConvId(newConv.id);
      setMobileShowChat(true);
      setShowNewChatModal(false);
    },
    [user, conversations, openConversation]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  if (authLoading) return <LoadingSpinner fullScreen />;
  if (!isAuthenticated) return null;

  // -------------------------------------------------------------------------
  // Sub-components (inline for single-file)
  // -------------------------------------------------------------------------

  const ContactAvatar = ({ contact, size = "md" }: { contact: Contact; size?: "sm" | "md" | "lg" }) => {
    const sizes = { sm: "w-8 h-8 text-xs", md: "w-11 h-11 text-sm", lg: "w-14 h-14 text-lg" };
    const dotSizes = { sm: "w-2 h-2", md: "w-3 h-3", lg: "w-3.5 h-3.5" };
    const dotPos = { sm: "-bottom-0 -right-0", md: "-bottom-0.5 -right-0.5", lg: "-bottom-0.5 -right-0.5" };
    const initials = `${contact.firstName[0]}${contact.lastName[0]}`;
    return (
      <div className="relative flex-shrink-0">
        <div
          className={cn(
            "rounded-full flex items-center justify-center text-white font-semibold",
            contact.avatarColor,
            sizes[size]
          )}
        >
          {initials}
        </div>
        <span
          className={cn(
            "absolute border-2 border-white dark:border-surface-dark rounded-full",
            contact.online ? "bg-green-500" : "bg-gray-400",
            dotSizes[size],
            dotPos[size]
          )}
        />
      </div>
    );
  };

  const TypingIndicator = () => (
    <div className="flex items-end gap-2 mb-3">
      <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-bl-md px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-textColor-light dark:text-textColor-dark-light italic mr-1">
            en train d&apos;ecrire
          </span>
          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );

  // -------------------------------------------------------------------------
  // Sidebar: conversation list
  // -------------------------------------------------------------------------

  const ConversationList = () => (
    <div
      className={cn(
        "flex flex-col h-full bg-surface dark:bg-surface-dark",
        "lg:w-[380px] lg:border-r lg:border-gray-100 lg:dark:border-gray-700/50",
        mobileShowChat ? "hidden lg:flex" : "flex w-full"
      )}
    >
      {/* Sidebar header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700/50">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-xl font-bold text-textColor dark:text-textColor-dark">Messages</h1>
            {totalUnread > 0 && (
              <p className="text-xs text-textColor-light dark:text-textColor-dark-light mt-0.5">
                {totalUnread} message{totalUnread > 1 ? "s" : ""} non lu{totalUnread > 1 ? "s" : ""}
              </p>
            )}
          </div>
          <Button size="sm" onClick={() => setShowNewChatModal(true)}>
            <Plus className="w-4 h-4 mr-1" />
            Nouveau
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textColor-light dark:text-textColor-dark-light" />
          <input
            type="text"
            placeholder="Rechercher une conversation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 text-sm text-textColor dark:text-textColor-dark placeholder:text-textColor-light dark:placeholder:text-textColor-dark-light focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Conversation items */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={<MessageCircle className="w-7 h-7" />}
              title="Aucune conversation"
              description="Demarrez une conversation avec un veterinaire pour obtenir des conseils."
              action={
                <Button size="sm" onClick={() => setShowNewChatModal(true)}>
                  <Plus className="w-4 h-4 mr-1" />
                  Nouvelle conversation
                </Button>
              }
            />
          </div>
        ) : (
          filteredConversations
            .sort((a, b) => {
              const aLast = a.messages[a.messages.length - 1]?.timestamp ?? "";
              const bLast = b.messages[b.messages.length - 1]?.timestamp ?? "";
              return bLast.localeCompare(aLast);
            })
            .map((conv) => {
              const contact = getContact(conv.contactId);
              if (!contact) return null;
              const lastMsg = conv.messages[conv.messages.length - 1];
              const unread = unreadCount(conv);
              const isActive = conv.id === activeConvId;
              const isSentByMe = lastMsg?.senderId === user?.id;

              return (
                <button
                  key={conv.id}
                  onClick={() => openConversation(conv.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50",
                    isActive && "bg-primary/5 dark:bg-primary/10 border-r-2 border-primary"
                  )}
                >
                  <ContactAvatar contact={contact} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span
                        className={cn(
                          "text-sm font-semibold truncate",
                          unread > 0
                            ? "text-textColor dark:text-textColor-dark"
                            : "text-textColor dark:text-textColor-dark"
                        )}
                      >
                        Dr. {contact.firstName} {contact.lastName}
                      </span>
                      {lastMsg && (
                        <span className="text-[10px] text-textColor-light dark:text-textColor-dark-light flex-shrink-0 ml-2">
                          {formatConversationDate(lastMsg.timestamp)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mb-0.5">
                      <Badge size="sm" variant={contact.role === "veterinarian" ? "primary" : "accent"}>
                        {contact.role === "veterinarian" ? "Veterinaire" : "Proprietaire"}
                      </Badge>
                      {conv.animalContext && (
                        <span className="text-[10px] text-textColor-light dark:text-textColor-dark-light truncate">
                          {conv.animalContext}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-textColor-light dark:text-textColor-dark-light truncate flex-1 flex items-center gap-1">
                        {isSentByMe && <CheckCheck className="w-3 h-3 flex-shrink-0 text-primary" />}
                        {conv.typing ? (
                          <span className="text-primary italic">en train d&apos;ecrire...</span>
                        ) : (
                          lastMsg?.text ?? "Aucun message"
                        )}
                      </p>
                      {unread > 0 && (
                        <span className="ml-2 flex-shrink-0 w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                          {unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
        )}
      </div>
    </div>
  );

  // -------------------------------------------------------------------------
  // Chat panel
  // -------------------------------------------------------------------------

  const ChatPanel = () => {
    if (!activeConversation || !activeContact) {
      return (
        <div
          className={cn(
            "flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900/30",
            mobileShowChat ? "flex" : "hidden lg:flex"
          )}
        >
          <EmptyState
            icon={<MessageCircle className="w-7 h-7" />}
            title="Selectionnez une conversation"
            description="Choisissez une conversation dans la liste ou demarrez-en une nouvelle."
          />
        </div>
      );
    }

    return (
      <div
        className={cn(
          "flex-1 flex flex-col bg-gray-50 dark:bg-gray-900/30",
          mobileShowChat ? "flex" : "hidden lg:flex"
        )}
      >
        {/* Chat header */}
        <div className="flex items-center gap-3 px-4 py-3 bg-surface dark:bg-surface-dark border-b border-gray-100 dark:border-gray-700/50">
          <button
            onClick={() => {
              setMobileShowChat(false);
              setActiveConvId(null);
            }}
            className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-textColor dark:text-textColor-dark" />
          </button>
          <ContactAvatar contact={activeContact} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-textColor dark:text-textColor-dark truncate">
                Dr. {activeContact.firstName} {activeContact.lastName}
              </h2>
              <Badge size="sm" variant="primary">
                {activeContact.specialty ?? "Veterinaire"}
              </Badge>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  activeContact.online ? "bg-green-500" : "bg-gray-400"
                )}
              />
              <span className="text-xs text-textColor-light dark:text-textColor-dark-light">
                {activeContact.online ? "En ligne" : "Hors ligne"}
              </span>
              {activeConversation.animalContext && (
                <>
                  <span className="text-xs text-textColor-light dark:text-textColor-dark-light">-</span>
                  <span className="text-xs text-primary font-medium">{activeConversation.animalContext}</span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <Phone className="w-4 h-4 text-textColor-light dark:text-textColor-dark-light" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <Video className="w-4 h-4 text-textColor-light dark:text-textColor-dark-light" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <MoreVertical className="w-4 h-4 text-textColor-light dark:text-textColor-dark-light" />
            </button>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {activeConversation.messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <MessageCircle className="w-7 h-7 text-primary" />
                </div>
                <p className="text-sm text-textColor-light dark:text-textColor-dark-light">
                  Envoyez un message pour demarrer la conversation
                </p>
              </div>
            </div>
          ) : (
            <>
              {activeConversation.messages.map((msg, idx) => {
                const isMe = msg.senderId === user?.id;
                const prevMsg = idx > 0 ? activeConversation.messages[idx - 1] : null;
                const showDate = shouldShowDateSeparator(msg.timestamp, prevMsg?.timestamp ?? null);

                return (
                  <React.Fragment key={msg.id}>
                    {showDate && (
                      <div className="flex items-center justify-center my-4">
                        <span className="px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-[10px] font-medium text-textColor-light dark:text-textColor-dark-light">
                          {formatDateSeparator(msg.timestamp)}
                        </span>
                      </div>
                    )}
                    <div className={cn("flex mb-3", isMe ? "justify-end" : "justify-start")}>
                      <div
                        className={cn(
                          "max-w-[75%] px-4 py-2.5 text-sm leading-relaxed",
                          isMe
                            ? "bg-primary text-white rounded-2xl rounded-br-md"
                            : "bg-white dark:bg-gray-800 text-textColor dark:text-textColor-dark rounded-2xl rounded-bl-md shadow-sm border border-gray-100 dark:border-gray-700/50"
                        )}
                      >
                        <p>{msg.text}</p>
                        <div
                          className={cn(
                            "flex items-center gap-1 mt-1",
                            isMe ? "justify-end" : "justify-start"
                          )}
                        >
                          <span
                            className={cn(
                              "text-[10px]",
                              isMe
                                ? "text-white/70"
                                : "text-textColor-light dark:text-textColor-dark-light"
                            )}
                          >
                            {formatMessageTime(msg.timestamp)}
                          </span>
                          {isMe && (
                            <CheckCheck
                              className={cn(
                                "w-3 h-3",
                                msg.read ? "text-white/90" : "text-white/50"
                              )}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
              {activeConversation.typing && <TypingIndicator />}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Scroll to bottom button */}

        {/* Message input bar */}
        <div className="px-4 py-3 bg-surface dark:bg-surface-dark border-t border-gray-100 dark:border-gray-700/50">
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0">
              <Paperclip className="w-5 h-5 text-textColor-light dark:text-textColor-dark-light" />
            </button>
            <input
              ref={inputRef}
              type="text"
              placeholder="Tapez votre message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 text-sm text-textColor dark:text-textColor-dark placeholder:text-textColor-light dark:placeholder:text-textColor-dark-light focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
            <Button
              size="sm"
              onClick={handleSend}
              disabled={!inputText.trim()}
              className="flex-shrink-0 !rounded-xl !px-3"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // -------------------------------------------------------------------------
  // New chat modal
  // -------------------------------------------------------------------------

  const availableVets = MOCK_CONTACTS.filter((c) => c.role === "veterinarian");

  return (
    <PageContainer className="!px-0 !py-0 !pb-0 !max-w-none">
      <div className="flex h-[calc(100vh-4rem)] lg:h-[calc(100vh-4rem)]">
        <ConversationList />
        <ChatPanel />
      </div>

      {/* New conversation modal */}
      <Modal
        isOpen={showNewChatModal}
        onClose={() => setShowNewChatModal(false)}
        title="Nouvelle conversation"
      >
        <div className="space-y-2">
          <p className="text-sm text-textColor-light dark:text-textColor-dark-light mb-4">
            Selectionnez un veterinaire pour demarrer une conversation.
          </p>
          {availableVets.map((vet) => {
            const existing = conversations.find((c) => c.contactId === vet.id);
            return (
              <button
                key={vet.id}
                onClick={() => startNewConversation(vet)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border border-gray-100 dark:border-gray-700/50"
              >
                <ContactAvatar contact={vet} />
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-textColor dark:text-textColor-dark">
                      Dr. {vet.firstName} {vet.lastName}
                    </span>
                    <span
                      className={cn(
                        "w-2 h-2 rounded-full",
                        vet.online ? "bg-green-500" : "bg-gray-400"
                      )}
                    />
                  </div>
                  <p className="text-xs text-textColor-light dark:text-textColor-dark-light">
                    {vet.specialty}
                  </p>
                  {existing && (
                    <p className="text-[10px] text-primary mt-0.5">Conversation existante</p>
                  )}
                </div>
                <Badge size="sm" variant="primary">
                  Veterinaire
                </Badge>
              </button>
            );
          })}
        </div>
      </Modal>
    </PageContainer>
  );
}
