"use client";

import { useEffect, useState } from "react";
import LazyImage from "@/components/LazyImage";
import type { Review } from "@/lib/types";

/** Single-review-at-a-time rotator — good for mobile. */
export default function ReviewsCarousel({ reviews }: { reviews: Review[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reviews.length < 2) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % reviews.length), 6000);
    return () => clearInterval(timer);
  }, [reviews.length]);

  if (reviews.length === 0) return null;
  const review = reviews[index];

  return (
    <section id="reviews" className="bg-gray-50 px-6 py-16">
      <h2 className="text-center text-2xl font-bold text-brand-black">What Customers Say</h2>

      <div className="mx-auto mt-10 max-w-xl rounded-lg bg-white p-8 text-center shadow-sm">
        {review.rating && (
          <div className="text-brand-red">{"★".repeat(review.rating)}</div>
        )}
        <p className="mt-3 text-base text-gray-600">{review.body}</p>
        <div className="mt-5 flex items-center justify-center gap-3">
          {review.reviewer_photo_url && (
            <LazyImage
              src={review.reviewer_photo_url}
              alt={review.author_name}
              wrapperClassName="h-10 w-10 shrink-0 rounded-full"
            />
          )}
          <div className="text-left">
            <p className="text-sm font-semibold text-brand-black">
              {review.is_anonymous ? "Anonymous" : review.author_name}
            </p>
            {review.source_platform && (
              <p className="text-xs uppercase tracking-wide text-gray-400">
                {review.source_platform}
              </p>
            )}
          </div>
        </div>
      </div>

      {reviews.length > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {reviews.map((r, i) => (
            <button
              key={r.id}
              type="button"
              aria-label={`Go to review ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-8 bg-brand-red" : "w-3 bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
