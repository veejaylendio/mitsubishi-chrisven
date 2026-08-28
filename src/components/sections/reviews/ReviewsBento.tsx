import LazyImage from "@/components/LazyImage";
import type { Review } from "@/lib/types";

/** Mixed-size tiles: a larger tile for the featured review, smaller for the rest. */
export default function ReviewsBento({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return null;
  const featured = reviews.find((r) => r.is_featured) ?? reviews[0];
  const rest = reviews.filter((r) => r.id !== featured.id);

  return (
    <section id="reviews" className="bg-gray-50 px-6 py-16">
      <h2 className="text-center text-2xl font-bold text-brand-black">What Customers Say</h2>
      <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="flex flex-col justify-center rounded-lg bg-white p-8 shadow-sm sm:col-span-2 sm:row-span-2">
          {featured.rating && (
            <div className="text-lg text-brand-red">{"★".repeat(featured.rating)}</div>
          )}
          <p className="mt-3 text-lg text-gray-700">{featured.body}</p>
          <div className="mt-5 flex items-center gap-3">
            {featured.reviewer_photo_url && (
              <LazyImage
                src={featured.reviewer_photo_url}
                alt={featured.author_name}
                wrapperClassName="h-10 w-10 shrink-0 rounded-full"
              />
            )}
            <p className="text-sm font-semibold text-brand-black">
              {featured.is_anonymous ? "Anonymous" : featured.author_name}
            </p>
          </div>
        </div>
        {rest.map((review) => (
          <div key={review.id} className="rounded-lg bg-white p-5 shadow-sm">
            {review.rating && <div className="text-brand-red">{"★".repeat(review.rating)}</div>}
            <p className="mt-2 text-sm text-gray-600">{review.body}</p>
            <p className="mt-3 text-xs font-semibold text-brand-black">
              — {review.is_anonymous ? "Anonymous" : review.author_name}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
