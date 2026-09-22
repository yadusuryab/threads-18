import ReviewsMarquee from "@/components/cards/rm";
import fs from "fs";
import path from "path";

// Force fresh read of the folder on every request in dev.
// In production this still runs at request time on the server
// (or at build time if you statically generate this route).
export const dynamic = "force-dynamic";

const REVIEWS_DIR = path.join(process.cwd(), "public", "reviews");
const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif"];

function getReviewImages(): string[] {
  try {
    const files = fs.readdirSync(REVIEWS_DIR);
    return files
      .filter((file) => IMAGE_EXTENSIONS.includes(path.extname(file).toLowerCase()))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map((file) => `/reviews/${file}`);
  } catch (err) {
    console.error("Could not read public/reviews:", err);
    return [];
  }
}

export default function ReviewsPage() {
  const images = getReviewImages();

  return (
    <main style={{ padding: "3rem 0" }}>
      <h1
        style={{
          textAlign: "center",
          fontSize: "2rem",
          fontWeight: 700,
          marginBottom: "2rem",
        }}
      >
        What people are saying
      </h1>

      {images.length === 0 ? (
        <p style={{ textAlign: "center", color: "#888" }}>
          No reviews found in public/reviews.
        </p>
      ) : (
        <ReviewsMarquee images={images} />
      )}
    </main>
  );
}