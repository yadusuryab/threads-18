"use client";

import React from "react";
import PriceFormat_Sale from "@/components/commerce-ui/price-format-sale";
import StarRating_Basic from "@/components/commerce-ui/star-rating-basic";
import AddToCartButton from "../utils/add-to-cart";

// Brand tokens
const GREEN = "#2D5016";
const GOLD = "#C8A84B";

// ── Size Selector ──────────────────────────────────────────────
const SizeSelector = ({ sizes, selectedSize, onSizeSelect }: {
  sizes: string[];
  selectedSize: string | null;
  onSizeSelect: (size: string) => void;
}) => {
  if (!sizes || sizes.length === 0) return null;

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <label className="text-[9px] font-bold tracking-[0.28em] uppercase" style={{ color: "rgba(0,0,0,0.38)" }}>
          Size
        </label>
        <button
          className="text-[9px] font-bold tracking-[0.2em] uppercase transition-opacity duration-200 hover:opacity-60"
          style={{ color: GOLD }}
        >
          Size Guide
        </button>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => onSizeSelect(size)}
            className="py-3 px-2 text-xs font-bold tracking-widest uppercase rounded-lg transition-all duration-200"
            style={
              selectedSize === size
                ? { background: GREEN, color: "#ffffff" }
                : { background: "#f2f4f0", color: "#2a2a2a", border: "1px solid transparent" }
            }
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
};

// ── Color Selector ─────────────────────────────────────────────
const ColorSelector = ({ colors, selectedColor, onColorSelect }: {
  colors: string[];
  selectedColor: string | null;
  onColorSelect: (color: string) => void;
}) => {
  if (!colors || colors.length === 0) return null;

  const getColorValue = (colorName: string) => {
    const colorMap: { [key: string]: string } = {
      black: "#000000", white: "#FFFFFF", silver: "#C0C0C0", gray: "#808080",
      red: "#FF0000", blue: "#0055A4", navy: "#001F5B", green: "#008000",
      olive: "#556B2F", yellow: "#FFFF00", gold: "#C8A84B", orange: "#FFA500",
      pink: "#FFC0CB", purple: "#800080", brown: "#A52A2A", beige: "#F5F5DC",
      cream: "#FFFDD0", burgundy: "#800020", maroon: "#800000", teal: "#008080",
    };
    const lower = colorName.toLowerCase();
    if (colorMap[lower]) return colorMap[lower];
    for (const [key, val] of Object.entries(colorMap)) {
      if (lower.includes(key)) return val;
    }
    return "#cccccc";
  };

  return (
    <div className="mt-7">
      <label className="text-[9px] font-bold tracking-[0.28em] uppercase mb-4 block" style={{ color: "rgba(0,0,0,0.38)" }}>
        Colorway
      </label>
      <div className="flex flex-wrap gap-3">
        {colors.map((color) => (
          <div key={color} className="flex flex-col items-center gap-1.5">
            <button
              onClick={() => onColorSelect(color)}
              title={color}
              className="w-10 h-10 rounded-full transition-all duration-200"
              style={{
                backgroundColor: getColorValue(color),
                border: selectedColor === color ? `2.5px solid ${GOLD}` : "2px solid #ddd",
                transform: selectedColor === color ? "scale(1.12)" : "scale(1)",
                boxShadow: selectedColor === color ? `0 0 0 3px rgba(200,168,75,0.2)` : "none",
              }}
            />
            <span className="text-[9px] tracking-wide text-center leading-tight max-w-[44px]" style={{ color: "rgba(0,0,0,0.35)" }}>
              {color}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────
const ProductDetailsClient = ({ product }: { product: any }) => {
  const [selectedSize, setSelectedSize] = React.useState<string | null>(null);
  const [selectedColor, setSelectedColor] = React.useState<string | null>(null);
  const [openSection, setOpenSection] = React.useState("description");

  const availableSizes = product.sizes || [];
  const availableColors = product.colors || [];

  const accordionSections = [
    {
      id: "description",
      title: "Description",
      content: product.description || "No description available.",
    },
    {
      id: "details",
      title: "Details",
      content: product.features?.length ? (
        <ul className="space-y-2">
          {product.features.map((feat: string, i: number) => (
            <li key={i} className="flex items-start gap-2">
              <span style={{ color: GOLD }} className="font-bold">—</span>
              <span style={{ color: "rgba(0,0,0,0.5)" }}>{feat}</span>
            </li>
          ))}
        </ul>
      ) : "No details available.",
    },
    {
      id: "shipping",
      title: "Shipping & Returns",
      content: "Read our terms and policy.",
    },
  ];

  return (
    <div className="lg:pl-8" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>

      {/* Eyebrow */}
      <div className="flex items-center gap-2 mb-5">
        <span className="block w-5 h-px" style={{ background: GOLD }} />
        <span className="text-[9px] font-bold tracking-[0.3em] uppercase" style={{ color: GOLD }}>
          18 Threads — Official Jersey
        </span>
      </div>

      {/* Product Title */}
      <h1
        className="font-black uppercase leading-none tracking-tight mb-5"
        style={{ fontSize: "clamp(28px, 4vw, 48px)", letterSpacing: "-0.02em", color: "#111111" }}
      >
        {product.name}
      </h1>

      {/* Rating */}
      <div className="flex items-center gap-2.5 mb-6">
        <StarRating_Basic value={product.rating} readOnly iconSize={14} />
        <span className="text-xs" style={{ color: "rgba(0,0,0,0.35)" }}>
          ({product.reviewCount || 0} reviews)
        </span>
      </div>

      {/* Price */}
      <div className="mb-8 pb-8" style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
        {product.salesPrice ? (
          <PriceFormat_Sale
            originalPrice={product.price}
            salePrice={product.salesPrice}
            prefix="₹"
            showSavePercentage={true}
            classNameSalePrice="text-3xl font-black tracking-tight"
            classNameOriginalPrice="text-base line-through ml-2"
          />
        ) : (
          <div className="text-3xl font-black tracking-tight" style={{ color: "#111111" }}>
            ₹{product.price}
          </div>
        )}
      </div>

      <SizeSelector sizes={availableSizes} selectedSize={selectedSize} onSizeSelect={setSelectedSize} />
      <ColorSelector colors={availableColors} selectedColor={selectedColor} onColorSelect={setSelectedColor} />

      <div className="mt-8">
        <AddToCartButton
          product={product}
          selectedSize={selectedSize}
          selectedColor={selectedColor}
          hasSizes={availableSizes.length > 0}
          hasColors={availableColors.length > 0}
          showBuyNow
        />
      </div>

      {/* Accordion */}
      <div className="mt-10" style={{ borderTop: "1px solid rgba(0,0,0,0.07)" }}>
        {accordionSections.map((section) => (
          <div key={section.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
            <button
              onClick={() => setOpenSection(openSection === section.id ? "" : section.id)}
              className="w-full py-5 flex justify-between items-center text-left"
            >
              <span
                className="text-[10px] font-bold tracking-[0.25em] uppercase transition-colors duration-200"
                style={{ color: openSection === section.id ? GREEN : "rgba(0,0,0,0.4)" }}
              >
                {section.title}
              </span>
              <span
                className="text-lg font-light transition-transform duration-300"
                style={{
                  display: "inline-block",
                  color: openSection === section.id ? GOLD : "rgba(0,0,0,0.3)",
                  transform: openSection === section.id ? "rotate(45deg)" : "rotate(0deg)",
                }}
              >
                +
              </span>
            </button>
            {openSection === section.id && (
              <div className="pb-6 text-sm leading-relaxed" style={{ color: "rgba(0,0,0,0.5)" }}>
                {section.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductDetailsClient;