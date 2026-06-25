"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ShoppingCart, Check, Loader2 } from "lucide-react";

export type CartItem = {
  _id: string;
  name: string;
  price: number;
  salesPrice: number;
  image: string;
  images?: { url: string }[];
  quantity: number;
  cartQty: number;
  maxQty: number;
  size?: string | null;
  color?: string | null;
  slug?: string;
};

type Props = {
  product: Omit<CartItem, "cartQty" | "size" | "color">;
  selectedSize?: string | null;
  selectedColor?: string | null;
  className?: string;
  hasSizes?: boolean;
  hasColors?: boolean;
  disabled?: boolean;
  showBuyNow?: boolean;
};

// Brand tokens
const GREEN = "#2D5016";
const GOLD = "#C8A84B";
const GOLD_LIGHT = "#E8D48A";

const AddToCartButton = ({
  product,
  selectedSize,
  selectedColor,
  className = "",
  hasSizes,
  hasColors,
  disabled = false,
  showBuyNow = false,
}: Props) => {
  const [inCart, setInCart] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isBuyNowLoading, setIsBuyNowLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
    const exists = cartItems.some(
      (item: CartItem) =>
        item._id === product._id &&
        item.size === selectedSize &&
        item.color === selectedColor
    );
    setInCart(exists);
  }, [product._id, selectedSize, selectedColor]);

  const addToCart = (redirectToCart = false) => {
    if (hasSizes && !selectedSize) {
      toast.warning("Please select a size before adding to cart.");
      return false;
    }
    if (hasColors && !selectedColor) {
      toast.warning("Please select a color before adding to cart.");
      return false;
    }
    if (product.quantity <= 0) {
      toast.error("This product is out of stock.");
      return false;
    }

    redirectToCart ? setIsBuyNowLoading(true) : setIsLoading(true);

    try {
      const cartItems: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
      const existingIndex = cartItems.findIndex(
        (item) =>
          item._id === product._id &&
          item.size === selectedSize &&
          item.color === selectedColor
      );

      if (existingIndex >= 0) {
        if (cartItems[existingIndex].cartQty >= cartItems[existingIndex].maxQty) {
          toast.error(`Maximum quantity (${cartItems[existingIndex].maxQty}) reached.`);
          return false;
        }
        cartItems[existingIndex].cartQty += 1;
        if (!redirectToCart) toast.success("Quantity increased in cart.");
      } else {
        cartItems.push({
          ...product,
          image: product.image || product.images?.[0]?.url || "",
          size: selectedSize || null,
          color: selectedColor || null,
          cartQty: 1,
          maxQty: product.quantity,
        });
        if (!redirectToCart) toast.success("Added to cart!");
      }

      localStorage.setItem("cart", JSON.stringify(cartItems));
      setInCart(true);
      window.dispatchEvent(new Event("cart-updated"));
      return true;
    } catch (error) {
      toast.error("Failed to add to cart.");
      console.error(error);
      return false;
    } finally {
      redirectToCart ? setIsBuyNowLoading(false) : setIsLoading(false);
    }
  };

  const handleAddToCart = () => addToCart(false);
  const handleBuyNow = () => {
    const success = addToCart(true);
    if (success) router.push("/cart");
  };

  // Shared button base style
  const base: React.CSSProperties = {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 52,
    borderRadius: 10,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.22em",
    textTransform: "uppercase" as const,
    border: "none",
    cursor: "pointer",
    transition: "opacity 0.2s, transform 0.15s",
  };

  // Out of stock
  if (product.quantity <= 0) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <button disabled style={{ ...base, background: "#f0f0f0", color: "#aaa", cursor: "not-allowed" }}>
          Out of Stock
        </button>
        {showBuyNow && (
          <button disabled style={{ ...base, background: "#f0f0f0", color: "#aaa", cursor: "not-allowed" }}>
            Buy Now
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {/* Add to Cart / View in Cart */}
      {inCart ? (
        <button
          onClick={() => router.push("/cart")}
          style={{
            ...base,
            background: "transparent",
            border: `1.5px solid ${GREEN}`,
            color: GREEN,
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "#f4f7f0")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          <Check size={15} strokeWidth={2.5} />
          View in Cart
        </button>
      ) : (
        <button
          onClick={handleAddToCart}
          disabled={isLoading || disabled}
          style={{
            ...base,
            background: "transparent",
            border: `1.5px solid ${GREEN}`,
            color: GREEN,
            opacity: isLoading || disabled ? 0.5 : 1,
          }}
          onMouseEnter={e => { if (!isLoading && !disabled) e.currentTarget.style.background = "#f4f7f0"; }}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          {isLoading ? (
            <><Loader2 size={14} className="animate-spin" /> Adding...</>
          ) : (
            <><ShoppingCart size={14} strokeWidth={2} /> Add to Cart</>
          )}
        </button>
      )}

      {/* Buy Now — gold fill, primary CTA */}
      {showBuyNow && (
        <button
          onClick={handleBuyNow}
          disabled={isBuyNowLoading || disabled}
          style={{
            ...base,
            background: GOLD,
            color: "#1a2e00",
            opacity: isBuyNowLoading || disabled ? 0.6 : 1,
          }}
          onMouseEnter={e => { if (!isBuyNowLoading && !disabled) e.currentTarget.style.background = GOLD_LIGHT; }}
          onMouseLeave={e => (e.currentTarget.style.background = GOLD)}
        >
          {isBuyNowLoading ? (
            <><Loader2 size={14} className="animate-spin" /> Processing...</>
          ) : (
            "Buy Now"
          )}
        </button>
      )}
    </div>
  );
};

export default AddToCartButton;