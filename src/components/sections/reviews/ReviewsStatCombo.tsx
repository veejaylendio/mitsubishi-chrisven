import type { Review } from "@/lib/types";

/** Pairs review cards with aggregate trust stats. */
export default function ReviewsStatCombo({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return null;
  const rated = reviews.filter((r) => r.rating != null);
  const average = rated.length > 0 ? rated.reduce((sum, r) => sum + (r.rating ?? 0), 0) / rated.length : null;
  const recommendPct =
    rated.length > 0
      ? Math.round((rated.filter((r) => (r.rating ?? 0) >= 4).length / rated.length) * 100)
      : null;

  return (
    <section id="reviews" className="bg-gray-50 px-6 py-16">
      <h2 className="text-center text-2xl font-bold text-brand-black">What Customers Say</h2>

      <div className="mx-auto mt-6 flex max-w-md flex-wrap justify-center gap-8 text-center">
        {average != null && (
          <div>
            <p className="text-3xl font-extrabold text-brand-red">{average.toFixed(1)}★</p>
            <p className="text-xs text-gray-500">
              average from {rated.length} review{rated.length === 1 ? "" : "s"}
            </p>
          </div>
        )}
        {recommendPct != null && (
          <div>
            <p className="text-3xl font-extrabold text-brand-red">{recommendPct}%</p>
            <p className="text-xs text-gray-500">would recommend</p>
          </div>
        )}
      </div>

      <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3">
        {reviews.map((review) => (
          <div key={review.id} className="rounded-lg bg-white p-6 shadow-sm">
            {review.rating && <div className="text-brand-red">{"★".repeat(review.rating)}</div>}
            <p className="mt-3 text-sm text-gray-600">{review.body}</p>
            <p className="mt-4 text-sm font-semibold text-brand-black">
              — {review.is_anonymous ? "Anonymous" : review.author_name}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
