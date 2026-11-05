"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import PageContainer from "@/components/layout/PageContainer";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Star,
  Dog,
  Cat,
  Rabbit,
  Fish,
  Bird,
  Package,
  Check,
  X,
  ArrowUpDown,
  SlidersHorizontal,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Product {
  id: string;
  name: string;
  brand: string;
  category: Category;
  price: number;
  rating: number;
  reviewCount: number;
  badge?: "promo" | "nouveau";
  species: Species[];
  icon: React.ElementType;
  color: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

type Category = "all" | "alimentation" | "jouets" | "sante" | "accessoires" | "hygiene";
type SortOption = "popular" | "price_asc" | "price_desc" | "rating";
type Species = "dog" | "cat" | "rabbit" | "fish" | "bird";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CATEGORIES: { key: Category; label: string }[] = [
  { key: "all", label: "Tous" },
  { key: "alimentation", label: "Alimentation" },
  { key: "jouets", label: "Jouets" },
  { key: "sante", label: "Sante" },
  { key: "accessoires", label: "Accessoires" },
  { key: "hygiene", label: "Hygiene" },
];

const SORT_OPTIONS: { key: SortOption; label: string }[] = [
  { key: "popular", label: "Populaire" },
  { key: "price_asc", label: "Prix croissant" },
  { key: "price_desc", label: "Prix decroissant" },
  { key: "rating", label: "Mieux note" },
];

const SPECIES_ICONS: Record<Species, React.ElementType> = {
  dog: Dog,
  cat: Cat,
  rabbit: Rabbit,
  fish: Fish,
  bird: Bird,
};

const PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Croquettes Premium Poulet",
    brand: "Royal Canin",
    category: "alimentation",
    price: 49.99,
    rating: 4.5,
    reviewCount: 324,
    badge: "promo",
    species: ["dog"],
    icon: Package,
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
  {
    id: "p2",
    name: "Patee Chat Saumon Bio",
    brand: "Almo Nature",
    category: "alimentation",
    price: 24.90,
    rating: 4.0,
    reviewCount: 187,
    species: ["cat"],
    icon: Package,
    color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  },
  {
    id: "p3",
    name: "Balle Interactive Smart",
    brand: "iFetch",
    category: "jouets",
    price: 34.95,
    rating: 4.5,
    reviewCount: 256,
    badge: "nouveau",
    species: ["dog", "cat"],
    icon: Package,
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  {
    id: "p4",
    name: "Arbre a Chat Deluxe",
    brand: "Trixie",
    category: "jouets",
    price: 89.99,
    rating: 4.0,
    reviewCount: 142,
    species: ["cat"],
    icon: Package,
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  },
  {
    id: "p5",
    name: "Anti-Puces Spot-On 6 mois",
    brand: "Frontline",
    category: "sante",
    price: 38.50,
    rating: 4.5,
    reviewCount: 512,
    badge: "promo",
    species: ["dog", "cat"],
    icon: Package,
    color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
  {
    id: "p6",
    name: "Vermifuge Naturel Comprime",
    brand: "Biocanina",
    category: "sante",
    price: 15.90,
    rating: 3.5,
    reviewCount: 98,
    species: ["dog", "cat"],
    icon: Package,
    color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  },
  {
    id: "p7",
    name: "Collier Cuir Personnalise",
    brand: "Hunter",
    category: "accessoires",
    price: 29.99,
    rating: 5.0,
    reviewCount: 203,
    badge: "nouveau",
    species: ["dog"],
    icon: Package,
    color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  {
    id: "p8",
    name: "Harnais Anti-Traction",
    brand: "Julius-K9",
    category: "accessoires",
    price: 44.90,
    rating: 4.5,
    reviewCount: 376,
    species: ["dog"],
    icon: Package,
    color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  },
  {
    id: "p9",
    name: "Shampooing Apaisant Aloe",
    brand: "Beaphar",
    category: "hygiene",
    price: 11.99,
    rating: 4.0,
    reviewCount: 164,
    species: ["dog", "cat"],
    icon: Package,
    color: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
  },
  {
    id: "p10",
    name: "Litiere Agglomerante Ultra",
    brand: "Cat's Best",
    category: "hygiene",
    price: 19.95,
    rating: 4.5,
    reviewCount: 431,
    badge: "promo",
    species: ["cat"],
    icon: Package,
    color: "bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400",
  },
  {
    id: "p11",
    name: "Friandises Dentaires",
    brand: "Pedigree",
    category: "alimentation",
    price: 7.49,
    rating: 4.0,
    reviewCount: 289,
    species: ["dog"],
    icon: Package,
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
  {
    id: "p12",
    name: "Croquettes Sterilise Indoor",
    brand: "Hill's Science",
    category: "alimentation",
    price: 42.50,
    rating: 4.5,
    reviewCount: 198,
    species: ["cat"],
    icon: Package,
    color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  },
  {
    id: "p13",
    name: "Jouet Corde Coton Naturel",
    brand: "Beco Pets",
    category: "jouets",
    price: 9.99,
    rating: 3.5,
    reviewCount: 112,
    species: ["dog"],
    icon: Package,
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  {
    id: "p14",
    name: "Fontaine a Eau Automatique",
    brand: "Catit",
    category: "accessoires",
    price: 32.90,
    rating: 4.5,
    reviewCount: 267,
    badge: "nouveau",
    species: ["cat", "dog"],
    icon: Package,
    color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  },
  {
    id: "p15",
    name: "Brosse Poils Longs FURminator",
    brand: "FURminator",
    category: "hygiene",
    price: 27.99,
    rating: 4.5,
    reviewCount: 345,
    species: ["dog", "cat"],
    icon: Package,
    color: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
  },
  {
    id: "p16",
    name: "Complement Articulations",
    brand: "Flexadin",
    category: "sante",
    price: 22.50,
    rating: 4.0,
    reviewCount: 156,
    species: ["dog"],
    icon: Package,
    color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  },
  {
    id: "p17",
    name: "Tunnel de Jeu Pliable",
    brand: "Trixie",
    category: "jouets",
    price: 14.95,
    rating: 4.0,
    reviewCount: 89,
    species: ["cat", "rabbit"],
    icon: Package,
    color: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  },
  {
    id: "p18",
    name: "Panier Orthopedique Mousse",
    brand: "Brunolie",
    category: "accessoires",
    price: 59.99,
    rating: 5.0,
    reviewCount: 201,
    species: ["dog", "cat"],
    icon: Package,
    color: "bg-stone-100 text-stone-700 dark:bg-stone-900/30 dark:text-stone-400",
  },
];

// ---------------------------------------------------------------------------
// Star Rating Component
// ---------------------------------------------------------------------------

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    const fill = rating >= i ? 1 : rating >= i - 0.5 ? 0.5 : 0;
    stars.push(
      <svg
        key={i}
        width={size}
        height={size}
        viewBox="0 0 20 20"
        className="flex-shrink-0"
      >
        <defs>
          <linearGradient id={`star-grad-${i}-${rating}`}>
            <stop offset={`${fill * 100}%`} stopColor="currentColor" />
            <stop offset={`${fill * 100}%`} stopColor="transparent" />
          </linearGradient>
        </defs>
        <path
          d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.49L10 14.27 5.06 16.7 6 11.21l-4-3.9 5.53-.8L10 1.5z"
          fill={`url(#star-grad-${i}-${rating})`}
          stroke="currentColor"
          strokeWidth="1"
          strokeLinejoin="round"
          className="text-yellow-400"
        />
      </svg>
    );
  }
  return <div className="flex items-center gap-0.5">{stars}</div>;
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function MarketplacePage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [category, setCategory] = useState<Category>("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("popular");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Auth guard
  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/login");
  }, [isAuthenticated, authLoading, router]);

  // Toast auto-dismiss
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  // ---------------------------------------------------------------------------
  // Filtered & sorted products
  // ---------------------------------------------------------------------------

  const filteredProducts = useMemo(() => {
    let list = PRODUCTS;

    if (category !== "all") {
      list = list.filter((p) => p.category === category);
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q)
      );
    }

    switch (sort) {
      case "price_asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list = [...list].sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
        break;
      case "popular":
      default:
        list = [...list].sort((a, b) => b.reviewCount - a.reviewCount);
        break;
    }

    return list;
  }, [category, search, sort]);

  // ---------------------------------------------------------------------------
  // Cart helpers
  // ---------------------------------------------------------------------------

  const cartCount = useMemo(() => cart.reduce((s, i) => s + i.quantity, 0), [cart]);
  const cartTotal = useMemo(
    () => cart.reduce((s, i) => s + i.product.price * i.quantity, 0),
    [cart]
  );

  const addToCart = useCallback((product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setToast(`${product.name} ajoute au panier`);
  }, []);

  const updateQuantity = useCallback((productId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((i) =>
          i.product.id === productId
            ? { ...i, quantity: i.quantity + delta }
            : i
        )
        .filter((i) => i.quantity > 0);
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const handleOrder = useCallback(() => {
    setCart([]);
    setShowCart(false);
    setToast("Commande confirmee ! Merci pour votre achat.");
  }, []);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  if (authLoading) return <LoadingSpinner fullScreen />;
  if (!isAuthenticated) return null;

  return (
    <PageContainer>
      {/* Toast notification */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] animate-fade-in">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white shadow-lg text-sm font-medium">
            <Check className="w-4 h-4 flex-shrink-0" />
            {toast}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-textColor dark:text-textColor-dark">
            Marketplace
          </h1>
          <p className="text-sm text-textColor-light dark:text-textColor-dark-light mt-0.5">
            Trouvez les meilleurs produits pour vos compagnons
          </p>
        </div>
        <button
          onClick={() => setShowCart(true)}
          className="relative p-2.5 rounded-xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-700/50 hover:border-primary/30 transition-colors"
        >
          <ShoppingCart className="w-5 h-5 text-textColor dark:text-textColor-dark" />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 flex items-center justify-center rounded-full bg-primary text-white text-[10px] font-bold">
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Search bar */}
      <div className="mb-4">
        <Input
          placeholder="Rechercher un produit..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={<Search className="w-4 h-4" />}
        />
      </div>

      {/* Category filter tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1 -mx-1 px-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setCategory(cat.key)}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
              category === cat.key
                ? "bg-primary text-white shadow-sm"
                : "bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-700/50 text-textColor dark:text-textColor-dark hover:border-primary/30"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Sort controls */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-textColor-light dark:text-textColor-dark-light">
          {filteredProducts.length} produit{filteredProducts.length !== 1 ? "s" : ""}
        </p>
        <div className="relative">
          <button
            onClick={() => setShowSort(!showSort)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-textColor dark:text-textColor-dark bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-700/50 hover:border-primary/30 transition-colors"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            {SORT_OPTIONS.find((s) => s.key === sort)?.label}
          </button>
          {showSort && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowSort(false)} />
              <div className="absolute right-0 top-full mt-1 z-20 bg-surface dark:bg-surface-dark rounded-xl shadow-lg border border-gray-100 dark:border-gray-700/50 py-1 min-w-[180px]">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => {
                      setSort(opt.key);
                      setShowSort(false);
                    }}
                    className={cn(
                      "w-full text-left px-4 py-2 text-sm transition-colors",
                      sort === opt.key
                        ? "text-primary font-medium bg-primary/5"
                        : "text-textColor dark:text-textColor-dark hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Product grid */}
      {filteredProducts.length === 0 ? (
        <Card className="text-center py-10">
          <Search className="w-8 h-8 text-textColor-light dark:text-textColor-dark-light mx-auto mb-2" />
          <p className="text-sm text-textColor-light dark:text-textColor-dark-light">
            Aucun produit trouve
          </p>
          <p className="text-xs text-textColor-light dark:text-textColor-dark-light mt-1">
            Essayez de modifier vos filtres ou votre recherche
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={addToCart}
            />
          ))}
        </div>
      )}

      {/* Cart modal */}
      <Modal
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        title="Mon panier"
        size="lg"
      >
        {cart.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingCart className="w-10 h-10 text-textColor-light dark:text-textColor-dark-light mx-auto mb-3" />
            <p className="text-sm text-textColor-light dark:text-textColor-dark-light">
              Votre panier est vide
            </p>
            <p className="text-xs text-textColor-light dark:text-textColor-dark-light mt-1">
              Parcourez nos produits et ajoutez vos favoris
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Cart items */}
            <div className="space-y-3 max-h-[50vh] overflow-y-auto">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50"
                >
                  {/* Product icon */}
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                      item.product.color
                    )}
                  >
                    <item.product.icon className="w-5 h-5" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-textColor dark:text-textColor-dark truncate">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-textColor-light dark:text-textColor-dark-light">
                      {item.product.price.toFixed(2)} EUR
                    </p>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updateQuantity(item.product.id, -1)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-600 hover:border-primary/30 transition-colors"
                    >
                      <Minus className="w-3 h-3 text-textColor dark:text-textColor-dark" />
                    </button>
                    <span className="w-6 text-center text-sm font-medium text-textColor dark:text-textColor-dark">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, 1)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-600 hover:border-primary/30 transition-colors"
                    >
                      <Plus className="w-3 h-3 text-textColor dark:text-textColor-dark" />
                    </button>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-danger" />
                  </button>
                </div>
              ))}
            </div>

            {/* Total & order */}
            <div className="border-t border-gray-100 dark:border-gray-700/50 pt-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-textColor dark:text-textColor-dark">
                  Total
                </span>
                <span className="text-lg font-bold text-primary">
                  {cartTotal.toFixed(2)} EUR
                </span>
              </div>
              <Button fullWidth onClick={handleOrder}>
                <Check className="w-4 h-4 mr-2" />
                Commander
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </PageContainer>
  );
}

// ---------------------------------------------------------------------------
// Product Card Component
// ---------------------------------------------------------------------------

function ProductCard({
  product,
  onAddToCart,
}: {
  product: Product;
  onAddToCart: (product: Product) => void;
}) {
  return (
    <div className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-700/50 overflow-hidden group hover:shadow-md transition-all">
      {/* Image placeholder */}
      <div className={cn("relative h-32 sm:h-36 flex items-center justify-center", product.color)}>
        <product.icon className="w-10 h-10 opacity-60" />
        {/* Badge */}
        {product.badge && (
          <div className="absolute top-2 left-2">
            <Badge variant={product.badge === "promo" ? "danger" : "primary"} size="sm">
              {product.badge === "promo" ? "Promo" : "Nouveau"}
            </Badge>
          </div>
        )}
        {/* Species icons */}
        <div className="absolute top-2 right-2 flex gap-1">
          {product.species.map((sp) => {
            const Icon = SPECIES_ICONS[sp];
            return (
              <div
                key={sp}
                className="w-5 h-5 rounded-full bg-white/80 dark:bg-gray-900/60 flex items-center justify-center"
              >
                <Icon className="w-3 h-3 text-textColor dark:text-textColor-dark" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-[10px] text-textColor-light dark:text-textColor-dark-light uppercase tracking-wide font-medium">
          {product.brand}
        </p>
        <p className="text-sm font-semibold text-textColor dark:text-textColor-dark mt-0.5 line-clamp-2 leading-snug min-h-[2.5rem]">
          {product.name}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mt-1.5">
          <StarRating rating={product.rating} size={12} />
          <span className="text-[10px] text-textColor-light dark:text-textColor-dark-light">
            ({product.reviewCount})
          </span>
        </div>

        {/* Price + button */}
        <div className="flex items-center justify-between mt-3">
          <span className="text-base font-bold text-primary">
            {product.price.toFixed(2)}&nbsp;EUR
          </span>
          <button
            onClick={() => onAddToCart(product)}
            className="w-8 h-8 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white flex items-center justify-center transition-all active:scale-90"
            aria-label={`Ajouter ${product.name} au panier`}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
