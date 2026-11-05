"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import PageContainer from "@/components/layout/PageContainer";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Badge from "@/components/ui/Badge";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import {
  Search,
  Plus,
  Heart,
  MessageCircle,
  Eye,
  Send,
  ChevronDown,
  ChevronUp,
  Users,
  PawPrint,
} from "lucide-react";

// ---- Types ----

interface ForumComment {
  id: string;
  postId: string;
  authorName: string;
  authorInitials: string;
  content: string;
  date: string;
}

interface ForumPost {
  id: string;
  authorName: string;
  authorInitials: string;
  date: string;
  title: string;
  preview: string;
  content: string;
  category: string;
  animalTag?: string;
  likes: number;
  likedByMe: boolean;
  commentCount: number;
  views: number;
  comments: ForumComment[];
}

// ---- Constants ----

const CATEGORIES = [
  { value: "all", label: "Tous" },
  { value: "sante", label: "Sante" },
  { value: "nutrition", label: "Nutrition" },
  { value: "comportement", label: "Comportement" },
  { value: "races", label: "Races" },
  { value: "conseils", label: "Conseils" },
];

const ANIMAL_TAGS = [
  { value: "", label: "Aucun" },
  { value: "chien", label: "Chien" },
  { value: "chat", label: "Chat" },
  { value: "lapin", label: "Lapin" },
  { value: "oiseau", label: "Oiseau" },
  { value: "rongeur", label: "Rongeur" },
  { value: "reptile", label: "Reptile" },
];

const CATEGORY_BADGE_VARIANT: Record<string, "primary" | "success" | "warning" | "danger" | "accent" | "default"> = {
  sante: "danger",
  nutrition: "success",
  comportement: "warning",
  races: "accent",
  conseils: "primary",
};

const STORE_KEY = "petcare_mock_forum";

// ---- Default data ----

function getDefaultPosts(): ForumPost[] {
  return [
    {
      id: "p1",
      authorName: "Marie Dupont",
      authorInitials: "MD",
      date: "2026-10-18",
      title: "Mon chien se gratte sans arret - que faire ?",
      preview: "Depuis quelques jours, mon labrador se gratte constamment les oreilles et le ventre...",
      content:
        "Depuis quelques jours, mon labrador de 3 ans se gratte constamment les oreilles et le ventre. Je ne vois pas de puces mais il semble vraiment inconfortable. J'ai essaye un shampoing doux mais ca n'a rien change. Est-ce que quelqu'un a deja eu ce probleme ? Faut-il consulter le veterinaire directement ou y a-t-il des remedes maison que je pourrais essayer d'abord ?",
      category: "sante",
      animalTag: "chien",
      likes: 12,
      likedByMe: false,
      commentCount: 3,
      views: 87,
      comments: [
        {
          id: "c1",
          postId: "p1",
          authorName: "Dr. Laurent",
          authorInitials: "DL",
          content: "Ca peut etre une allergie alimentaire ou environnementale. Je recommande une visite chez le veto pour un diagnostic precis.",
          date: "2026-10-18",
        },
        {
          id: "c2",
          postId: "p1",
          authorName: "Sophie Martin",
          authorInitials: "SM",
          content: "Mon chien avait le meme probleme, c'etait une allergie aux acariens. Le veto lui a prescrit des antihistaminiques.",
          date: "2026-10-19",
        },
        {
          id: "c3",
          postId: "p1",
          authorName: "Pierre Bernard",
          authorInitials: "PB",
          content: "Essayez de verifier si ce n'est pas lie a un changement de nourriture recent. Parfois les allergies alimentaires se manifestent ainsi.",
          date: "2026-10-19",
        },
      ],
    },
    {
      id: "p2",
      authorName: "Thomas Leroy",
      authorInitials: "TL",
      date: "2026-10-17",
      title: "Quelle alimentation pour un chaton de 3 mois ?",
      preview: "Je viens d'adopter un chaton et je suis un peu perdu niveau nourriture...",
      content:
        "Je viens d'adopter un chaton de 3 mois et je suis un peu perdu concernant son alimentation. Le refuge m'a donne des croquettes mais je ne sais pas si c'est suffisant. Faut-il completer avec de la patee ? Combien de repas par jour ? Et quelle marque recommandez-vous pour les chatons ? Merci pour vos conseils !",
      category: "nutrition",
      animalTag: "chat",
      likes: 8,
      likedByMe: false,
      commentCount: 2,
      views: 64,
      comments: [
        {
          id: "c4",
          postId: "p2",
          authorName: "Claire Petit",
          authorInitials: "CP",
          content: "A 3 mois, 3 a 4 repas par jour c'est ideal. Privilegiez des croquettes specifiques chatons, riches en proteines.",
          date: "2026-10-17",
        },
        {
          id: "c5",
          postId: "p2",
          authorName: "Julien Moreau",
          authorInitials: "JM",
          content: "Un mix croquettes/patee est parfait. La patee aide a l'hydratation. Evitez le lait de vache, contrairement aux idees recues !",
          date: "2026-10-18",
        },
      ],
    },
    {
      id: "p3",
      authorName: "Isabelle Roux",
      authorInitials: "IR",
      date: "2026-10-16",
      title: "Mon chat fait pipi hors de sa litiere",
      preview: "Depuis notre demenagement, mon chat refuse d'utiliser sa litiere...",
      content:
        "Depuis notre demenagement il y a deux semaines, mon chat de 5 ans refuse d'utiliser sa litiere et fait ses besoins un peu partout dans la maison. J'ai essaye de changer la litiere, de deplacer le bac, mais rien n'y fait. C'est un chat qui etait propre avant. Est-ce du stress ? Comment l'aider a retrouver ses habitudes ?",
      category: "comportement",
      animalTag: "chat",
      likes: 15,
      likedByMe: false,
      commentCount: 4,
      views: 123,
      comments: [
        {
          id: "c6",
          postId: "p3",
          authorName: "Dr. Martin",
          authorInitials: "DM",
          content: "Le demenagement est tres stressant pour les chats. Utilisez un diffuseur de pheromones (Feliway) et laissez-lui le temps de s'adapter.",
          date: "2026-10-16",
        },
        {
          id: "c7",
          postId: "p3",
          authorName: "Anne Duval",
          authorInitials: "AD",
          content: "Meme situation chez moi. Le Feliway a fait des miracles en 1 semaine. Patience !",
          date: "2026-10-17",
        },
        {
          id: "c8",
          postId: "p3",
          authorName: "Luc Girard",
          authorInitials: "LG",
          content: "Assurez-vous aussi qu'il n'y a pas de probleme medical (infection urinaire). Un check-up chez le veto serait prudent.",
          date: "2026-10-17",
        },
        {
          id: "c9",
          postId: "p3",
          authorName: "Marie Dupont",
          authorInitials: "MD",
          content: "Essayez de mettre plusieurs litieres dans differentes pieces, ca aide parfois les chats a retrouver leurs reperes.",
          date: "2026-10-18",
        },
      ],
    },
    {
      id: "p4",
      authorName: "Jean-Marc Fontaine",
      authorInitials: "JF",
      date: "2026-10-15",
      title: "Golden Retriever vs Labrador : lequel choisir ?",
      preview: "Nous hesitions entre ces deux races pour notre premier chien de famille...",
      content:
        "Ma famille et moi souhaitons adopter notre premier chien. Nous hesitons entre un Golden Retriever et un Labrador. Nous avons deux enfants (6 et 9 ans) et un jardin de taille moyenne. Quelle race serait la plus adaptee a notre situation ? Y a-t-il des differences majeures en termes de caractere, de besoins d'exercice et d'entretien ? Merci pour vos retours d'experience !",
      category: "races",
      animalTag: "chien",
      likes: 22,
      likedByMe: false,
      commentCount: 2,
      views: 156,
      comments: [
        {
          id: "c10",
          postId: "p4",
          authorName: "Patrick Simon",
          authorInitials: "PS",
          content: "Les deux sont excellents avec les enfants ! Le Golden est un peu plus calme, le Labrador plus energique. Le Golden demande plus de brossage.",
          date: "2026-10-15",
        },
        {
          id: "c11",
          postId: "p4",
          authorName: "Nathalie Blanc",
          authorInitials: "NB",
          content: "J'ai eu les deux races. Le Labrador est plus facile a entretenir mais le Golden est incroyablement doux. Vous ne pouvez pas vous tromper !",
          date: "2026-10-16",
        },
      ],
    },
    {
      id: "p5",
      authorName: "Emilie Renard",
      authorInitials: "ER",
      date: "2026-10-14",
      title: "Conseils pour la premiere visite chez le veto",
      preview: "Je viens d'adopter un chiot et sa premiere visite veterinaire approche...",
      content:
        "Mon chiot de 2 mois va avoir sa premiere visite chez le veterinaire la semaine prochaine. Je suis un peu anxieuse car je veux que tout se passe bien pour lui. Avez-vous des conseils pour le preparer ? Que dois-je apporter ? Quelles questions poser au veto ? Et combien ca coute en general une premiere consultation ? Merci de votre aide !",
      category: "conseils",
      animalTag: "chien",
      likes: 18,
      likedByMe: false,
      commentCount: 2,
      views: 94,
      comments: [
        {
          id: "c12",
          postId: "p5",
          authorName: "Dr. Laurent",
          authorInitials: "DL",
          content: "Apportez le carnet de sante du refuge si vous en avez un. Demandez le calendrier vaccinal et les traitements antiparasitaires. Comptez 40-60 EUR pour une premiere consultation.",
          date: "2026-10-14",
        },
        {
          id: "c13",
          postId: "p5",
          authorName: "Sophie Martin",
          authorInitials: "SM",
          content: "Habituez votre chiot a etre manipule avant la visite (pattes, oreilles, gueule). Ca rend l'examen beaucoup plus facile !",
          date: "2026-10-15",
        },
      ],
    },
    {
      id: "p6",
      authorName: "Lucas Moreau",
      authorInitials: "LM",
      date: "2026-10-13",
      title: "Nourriture maison vs croquettes : le grand debat",
      preview: "Je me demande si la nourriture maison est vraiment meilleure pour nos animaux...",
      content:
        "Je vois de plus en plus de proprietaires passer a la nourriture maison ou au BARF pour leurs chiens. Est-ce vraiment mieux que les croquettes de bonne qualite ? J'ai peur de faire des erreurs et de provoquer des carences. Pour ceux qui ont fait la transition, comment ca s'est passe ? Avez-vous vu des differences au niveau de la sante, du poil, de l'energie de votre animal ?",
      category: "nutrition",
      animalTag: "chien",
      likes: 31,
      likedByMe: false,
      commentCount: 1,
      views: 212,
      comments: [
        {
          id: "c14",
          postId: "p6",
          authorName: "Dr. Martin",
          authorInitials: "DM",
          content: "La nourriture maison peut etre excellente MAIS elle doit etre equilibree par un nutritionniste veterinaire. Sans suivi, les carences sont frequentes.",
          date: "2026-10-14",
        },
      ],
    },
    {
      id: "p7",
      authorName: "Camille Dubois",
      authorInitials: "CD",
      date: "2026-10-12",
      title: "Mon lapin refuse de manger son foin",
      preview: "Mon lapin nain ne touche plus a son foin depuis trois jours...",
      content:
        "Mon lapin nain de 2 ans ne mange presque plus de foin depuis trois jours. Il mange encore ses granules et quelques legumes mais boude completement le foin. Je sais que le foin est essentiel pour sa digestion et ses dents. Est-ce que je dois m'inquieter ? Avez-vous des astuces pour l'encourager a en manger ? J'ai essaye differentes varietes sans succes.",
      category: "sante",
      animalTag: "lapin",
      likes: 7,
      likedByMe: false,
      commentCount: 2,
      views: 45,
      comments: [
        {
          id: "c15",
          postId: "p7",
          authorName: "Aurelie Petit",
          authorInitials: "AP",
          content: "Essayez le foin de Crau ou le foin de fleole (timothy hay). Parfois un changement de variete fait toute la difference !",
          date: "2026-10-12",
        },
        {
          id: "c16",
          postId: "p7",
          authorName: "Vincent Lefevre",
          authorInitials: "VL",
          content: "3 jours sans foin c'est preoccupant pour un lapin. Verifiez ses dents et consultez un veto NAC rapidement.",
          date: "2026-10-13",
        },
      ],
    },
    {
      id: "p8",
      authorName: "Sarah Lemoine",
      authorInitials: "SL",
      date: "2026-10-11",
      title: "Comment socialiser un chiot craintif ?",
      preview: "Mon berger australien de 4 mois a peur de tout : les bruits, les gens, les autres chiens...",
      content:
        "J'ai adopte un berger australien de 4 mois qui est extremement craintif. Il a peur des bruits forts, des inconnus et meme des autres chiens au parc. J'ai lu que la socialisation etait cruciale a cet age mais je ne veux pas le brusquer. Comment proceder en douceur ? Faut-il faire appel a un educateur canin ? Quels exercices puis-je faire a la maison pour l'aider a prendre confiance ?",
      category: "comportement",
      animalTag: "chien",
      likes: 25,
      likedByMe: false,
      commentCount: 2,
      views: 178,
      comments: [
        {
          id: "c17",
          postId: "p8",
          authorName: "Marc Legrand",
          authorInitials: "ML",
          content: "La desensibilisation progressive est la cle. Exposez-le tres graduellement aux stimuli en recompensant le calme. Un educateur positif peut enormement aider.",
          date: "2026-10-11",
        },
        {
          id: "c18",
          postId: "p8",
          authorName: "Claire Petit",
          authorInitials: "CP",
          content: "Evitez absolument les parcs a chiens pour l'instant. Commencez par des rencontres individuelles avec des chiens calmes et bien socialises.",
          date: "2026-10-12",
        },
      ],
    },
    {
      id: "p9",
      authorName: "Antoine Fabre",
      authorInitials: "AF",
      date: "2026-10-10",
      title: "Perruche qui perd ses plumes : mue ou maladie ?",
      preview: "Ma perruche ondulee perd beaucoup de plumes ces derniers temps...",
      content:
        "Ma perruche ondulee perd enormement de plumes depuis environ 10 jours. Je trouve des plumes partout dans la cage. Elle mange normalement et semble active. Est-ce une mue saisonniere normale ou dois-je m'inquieter ? Comment differencier une mue normale d'un probleme de sante ? Y a-t-il des complements alimentaires que je pourrais lui donner ?",
      category: "sante",
      animalTag: "oiseau",
      likes: 5,
      likedByMe: false,
      commentCount: 1,
      views: 33,
      comments: [
        {
          id: "c19",
          postId: "p9",
          authorName: "Dr. Lambert",
          authorInitials: "DL",
          content: "Si elle reste active et mange bien, c'est probablement une mue. Ajoutez un os de seiche et des vitamines dans l'eau. Si des zones denudees apparaissent, consultez.",
          date: "2026-10-11",
        },
      ],
    },
    {
      id: "p10",
      authorName: "Helene Garnier",
      authorInitials: "HG",
      date: "2026-10-09",
      title: "Proteger son animal de la chaleur en ete : mes astuces",
      preview: "Avec les fortes chaleurs, voici quelques conseils pratiques pour proteger vos compagnons...",
      content:
        "Avec le changement climatique, les etes sont de plus en plus chauds et nos animaux en souffrent. Voici mes astuces testees et approuvees : 1) Toujours de l'eau fraiche disponible (changee plusieurs fois par jour). 2) Tapis rafraichissant, un investissement genial. 3) Promenades tot le matin ou tard le soir uniquement. 4) Test du bitume : si c'est trop chaud pour votre main, c'est trop chaud pour leurs pattes. 5) Ne JAMAIS laisser un animal dans une voiture, meme 5 minutes. Partagez vos astuces aussi !",
      category: "conseils",
      likes: 42,
      likedByMe: false,
      commentCount: 1,
      views: 298,
      comments: [
        {
          id: "c20",
          postId: "p10",
          authorName: "Francois Dupuis",
          authorInitials: "FD",
          content: "Super conseils ! J'ajouterais : glacons dans la gamelle d'eau et brumisateur pour les jours de canicule. Mon chien adore !",
          date: "2026-10-10",
        },
      ],
    },
  ];
}

// ---- Storage helpers ----

function getPosts(): ForumPost[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORE_KEY);
    if (data) return JSON.parse(data);
  } catch {
    // ignore parse errors
  }
  const defaults = getDefaultPosts();
  savePosts(defaults);
  return defaults;
}

function savePosts(posts: ForumPost[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(posts));
  } catch {
    // storage full or unavailable
  }
}

// ---- Helpers ----

function formatForumDate(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return "Hier";
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function getCategoryLabel(value: string): string {
  return CATEGORIES.find((c) => c.value === value)?.label ?? value;
}

function getAnimalLabel(value: string): string {
  return ANIMAL_TAGS.find((t) => t.value === value)?.label ?? value;
}

// ---- Component ----

export default function CommunityPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [newCommentText, setNewCommentText] = useState<Record<string, string>>({});

  // New post form state
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("sante");
  const [newContent, setNewContent] = useState("");
  const [newAnimalTag, setNewAnimalTag] = useState("");

  // Load data
  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/login");
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    setPosts(getPosts());
  }, []);

  // Filtered posts
  const filteredPosts = useMemo(() => {
    let result = posts;
    if (activeCategory !== "all") {
      result = result.filter((p) => p.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.preview.toLowerCase().includes(q) ||
          p.authorName.toLowerCase().includes(q)
      );
    }
    return result;
  }, [posts, activeCategory, searchQuery]);

  // Actions
  const handleToggleLike = (postId: string) => {
    setPosts((prev) => {
      const updated = prev.map((p) => {
        if (p.id !== postId) return p;
        return {
          ...p,
          likedByMe: !p.likedByMe,
          likes: p.likedByMe ? p.likes - 1 : p.likes + 1,
        };
      });
      savePosts(updated);
      return updated;
    });
  };

  const handleExpandPost = (postId: string) => {
    setExpandedPostId((prev) => {
      const newId = prev === postId ? null : postId;
      // Increment views when expanding
      if (newId) {
        setPosts((prevPosts) => {
          const updated = prevPosts.map((p) =>
            p.id === postId ? { ...p, views: p.views + 1 } : p
          );
          savePosts(updated);
          return updated;
        });
      }
      return newId;
    });
  };

  const handleAddComment = (postId: string) => {
    const text = newCommentText[postId]?.trim();
    if (!text || !user) return;

    const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    const comment: ForumComment = {
      id: Date.now().toString(36),
      postId,
      authorName: `${user.firstName} ${user.lastName}`,
      authorInitials: initials,
      content: text,
      date: new Date().toISOString().split("T")[0],
    };

    setPosts((prev) => {
      const updated = prev.map((p) => {
        if (p.id !== postId) return p;
        return {
          ...p,
          comments: [...p.comments, comment],
          commentCount: p.commentCount + 1,
        };
      });
      savePosts(updated);
      return updated;
    });

    setNewCommentText((prev) => ({ ...prev, [postId]: "" }));
  };

  const handleCreatePost = () => {
    if (!newTitle.trim() || !newContent.trim() || !user) return;

    const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    const newPost: ForumPost = {
      id: Date.now().toString(36),
      authorName: `${user.firstName} ${user.lastName}`,
      authorInitials: initials,
      date: new Date().toISOString().split("T")[0],
      title: newTitle.trim(),
      preview: newContent.trim().slice(0, 120) + (newContent.trim().length > 120 ? "..." : ""),
      content: newContent.trim(),
      category: newCategory,
      animalTag: newAnimalTag || undefined,
      likes: 0,
      likedByMe: false,
      commentCount: 0,
      views: 0,
      comments: [],
    };

    setPosts((prev) => {
      const updated = [newPost, ...prev];
      savePosts(updated);
      return updated;
    });

    // Reset form
    setNewTitle("");
    setNewCategory("sante");
    setNewContent("");
    setNewAnimalTag("");
    setShowNewPostModal(false);
  };

  if (authLoading) return <LoadingSpinner fullScreen />;
  if (!isAuthenticated) return null;

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-textColor dark:text-textColor-dark">Communaute</h1>
          <p className="text-sm text-textColor-light dark:text-textColor-dark-light mt-0.5">
            Echangez avec d&apos;autres proprietaires d&apos;animaux
          </p>
        </div>
        <Button size="sm" onClick={() => setShowNewPostModal(true)}>
          <Plus className="w-4 h-4 mr-1.5" />
          Nouveau sujet
        </Button>
      </div>

      {/* Search bar */}
      <div className="mb-4">
        <Input
          placeholder="Rechercher un sujet..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={<Search className="w-4 h-4" />}
        />
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
              activeCategory === cat.value
                ? "bg-primary text-white shadow-sm"
                : "bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-700/50 text-textColor dark:text-textColor-dark hover:border-primary/30"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Posts list */}
      {filteredPosts.length === 0 ? (
        <EmptyState
          icon={<Users className="w-7 h-7" />}
          title="Aucun sujet trouve"
          description={
            searchQuery
              ? "Aucun resultat pour votre recherche. Essayez d'autres mots-cles."
              : "Aucun sujet dans cette categorie pour le moment. Soyez le premier a en creer un !"
          }
          action={
            <Button size="sm" onClick={() => setShowNewPostModal(true)}>
              <Plus className="w-4 h-4 mr-1.5" />
              Creer un sujet
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {filteredPosts.map((post) => {
            const isExpanded = expandedPostId === post.id;
            return (
              <Card key={post.id} className="overflow-hidden">
                {/* Post header */}
                <button
                  onClick={() => handleExpandPost(post.id)}
                  className="w-full text-left"
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold text-xs">{post.authorInitials}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Author + date */}
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-textColor dark:text-textColor-dark">
                          {post.authorName}
                        </span>
                        <span className="text-xs text-textColor-light dark:text-textColor-dark-light">
                          {formatForumDate(post.date)}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-sm font-semibold text-textColor dark:text-textColor-dark mb-1 leading-snug">
                        {post.title}
                      </h3>

                      {/* Preview (only when collapsed) */}
                      {!isExpanded && (
                        <p className="text-xs text-textColor-light dark:text-textColor-dark-light line-clamp-2 mb-2">
                          {post.preview}
                        </p>
                      )}

                      {/* Badges */}
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <Badge variant={CATEGORY_BADGE_VARIANT[post.category] ?? "default"} size="sm">
                          {getCategoryLabel(post.category)}
                        </Badge>
                        {post.animalTag && (
                          <Badge variant="default" size="sm">
                            <PawPrint className="w-3 h-3 mr-1" />
                            {getAnimalLabel(post.animalTag)}
                          </Badge>
                        )}
                      </div>

                      {/* Stats row */}
                      <div className="flex items-center gap-4 text-xs text-textColor-light dark:text-textColor-dark-light">
                        <span className="flex items-center gap-1">
                          <Heart
                            className={cn("w-3.5 h-3.5", post.likedByMe && "fill-danger text-danger")}
                          />
                          {post.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-3.5 h-3.5" />
                          {post.commentCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          {post.views}
                        </span>
                        <span className="ml-auto">
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/50">
                    {/* Full content */}
                    <p className="text-sm text-textColor dark:text-textColor-dark leading-relaxed mb-4 whitespace-pre-line">
                      {post.content}
                    </p>

                    {/* Like button */}
                    <div className="mb-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleLike(post.id);
                        }}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                          post.likedByMe
                            ? "bg-danger/10 text-danger"
                            : "bg-gray-100 dark:bg-gray-800 text-textColor-light dark:text-textColor-dark-light hover:bg-danger/10 hover:text-danger"
                        )}
                      >
                        <Heart className={cn("w-4 h-4", post.likedByMe && "fill-current")} />
                        {post.likedByMe ? "Aime" : "J'aime"}
                        <span className="text-xs">({post.likes})</span>
                      </button>
                    </div>

                    {/* Comments section */}
                    <div>
                      <h4 className="text-sm font-semibold text-textColor dark:text-textColor-dark mb-3">
                        Commentaires ({post.commentCount})
                      </h4>

                      {post.comments.length === 0 ? (
                        <p className="text-xs text-textColor-light dark:text-textColor-dark-light mb-3">
                          Aucun commentaire pour le moment. Soyez le premier !
                        </p>
                      ) : (
                        <div className="space-y-3 mb-4">
                          {post.comments.map((comment) => (
                            <div
                              key={comment.id}
                              className="flex gap-2.5 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50"
                            >
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <span className="text-primary font-bold text-[10px]">
                                  {comment.authorInitials}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span className="text-xs font-medium text-textColor dark:text-textColor-dark">
                                    {comment.authorName}
                                  </span>
                                  <span className="text-[10px] text-textColor-light dark:text-textColor-dark-light">
                                    {formatForumDate(comment.date)}
                                  </span>
                                </div>
                                <p className="text-xs text-textColor dark:text-textColor-dark leading-relaxed">
                                  {comment.content}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add comment */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Ecrire un commentaire..."
                          value={newCommentText[post.id] ?? ""}
                          onChange={(e) =>
                            setNewCommentText((prev) => ({
                              ...prev,
                              [post.id]: e.target.value,
                            }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleAddComment(post.id);
                          }}
                          className="flex-1 rounded-xl border border-gray-200 dark:border-gray-600 bg-surface dark:bg-surface-dark px-3 py-2 text-sm text-textColor dark:text-textColor-dark placeholder:text-textColor-light dark:placeholder:text-textColor-dark-light focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                        />
                        <Button
                          size="sm"
                          onClick={() => handleAddComment(post.id)}
                          disabled={!newCommentText[post.id]?.trim()}
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* New Post Modal */}
      <Modal
        isOpen={showNewPostModal}
        onClose={() => setShowNewPostModal(false)}
        title="Nouveau sujet"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Titre"
            placeholder="Ex: Comment toiletter un caniche ?"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />

          <Select
            label="Categorie"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            options={CATEGORIES.filter((c) => c.value !== "all").map((c) => ({
              value: c.value,
              label: c.label,
            }))}
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-textColor dark:text-textColor-dark">
              Contenu
            </label>
            <textarea
              className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-surface dark:bg-surface-dark px-4 py-2.5 text-sm text-textColor dark:text-textColor-dark placeholder:text-textColor-light dark:placeholder:text-textColor-dark-light focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all min-h-[120px] resize-y"
              placeholder="Decrivez votre question ou partagez vos conseils..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
            />
          </div>

          <Select
            label="Espece animale (optionnel)"
            value={newAnimalTag}
            onChange={(e) => setNewAnimalTag(e.target.value)}
            options={ANIMAL_TAGS}
          />

          <Button
            fullWidth
            onClick={handleCreatePost}
            disabled={!newTitle.trim() || !newContent.trim()}
          >
            <Plus className="w-4 h-4 mr-2" />
            Publier le sujet
          </Button>
        </div>
      </Modal>
    </PageContainer>
  );
}
