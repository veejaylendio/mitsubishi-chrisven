import LazyImage from "./LazyImage";
import type { Review } from "@/lib/types";

export default function ReviewsSection({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return null;

  return (
    <section id="reviews" className="@container bg-gray-50 px-6 py-16">
      <h2 className="text-center text-2xl font-bold text-brand-black">
        What Customers Say
      </h2>
      <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-6 @2xl:grid-cols-3">
        {reviews.map((review) => (
          <div key={review.id} className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              {review.rating && (
                <div className="text-brand-red">{"★".repeat(review.rating)}</div>
              )}
              {review.source_platform && (
                <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  {review.source_platform}
                </span>
              )}
            </div>
            <p className="mt-3 text-sm text-gray-600">{review.body}</p>
            <div className="mt-4 flex items-center gap-3">
              {review.reviewer_photo_url && (
                <LazyImage
                  src={review.reviewer_photo_url}
                  alt={review.author_name}
                  wrapperClassName="h-8 w-8 shrink-0 rounded-full"
                />
              )}
              <p className="text-sm font-semibold text-brand-black">
                — {review.is_anonymous ? "Anonymous" : review.author_name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
