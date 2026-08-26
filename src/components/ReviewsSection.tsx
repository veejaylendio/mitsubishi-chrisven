export type Review = {
  id: string;
  author_name: string;
  rating: number | null;
  body: string | null;
};

export default function ReviewsSection({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return null;

  return (
    <section id="reviews" className="bg-gray-50 px-6 py-16">
      <h2 className="text-center text-2xl font-bold text-brand-black">
        What Customers Say
      </h2>
      <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3">
        {reviews.map((review) => (
          <div key={review.id} className="rounded-lg bg-white p-6 shadow-sm">
            {review.rating && (
              <div className="text-brand-red">{"★".repeat(review.rating)}</div>
            )}
            <p className="mt-3 text-sm text-gray-600">{review.body}</p>
            <p className="mt-4 text-sm font-semibold text-brand-black">
              — {review.author_name}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
