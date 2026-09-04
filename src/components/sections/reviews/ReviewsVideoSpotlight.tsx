import LazyImage from "@/components/LazyImage";
import type { Review } from "@/lib/types";

/** One large video testimonial + a strip of smaller text-review cards. */
export default function ReviewsVideoSpotlight({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return null;
  const spotlight = reviews.find((r) => r.video_url) ?? reviews.find((r) => r.is_featured) ?? reviews[0];
  const rest = reviews.filter((r) => r.id !== spotlight.id);

  return (
    <section id="reviews" className="@container bg-gray-50 px-6 py-16">
      <h2 className="text-center text-2xl font-bold text-brand-black">What Customers Say</h2>
      <div className="mx-auto mt-10 max-w-5xl">
        <div className="overflow-hidden rounded-lg bg-white shadow-sm @2xl:flex">
          <div className="bg-black @2xl:w-1/2">
            {spotlight.video_url ? (
              <video
                src={spotlight.video_url}
                poster={spotlight.reviewer_photo_url ?? undefined}
                controls
                className="h-64 w-full object-cover @2xl:h-full"
              />
            ) : (
              spotlight.reviewer_photo_url && (
                <LazyImage
                  src={spotlight.reviewer_photo_url}
                  alt={spotlight.author_name}
                  wrapperClassName="h-64 w-full @2xl:h-full"
                />
              )
            )}
          </div>
          <div className="flex flex-col justify-center p-8 @2xl:w-1/2">
            {spotlight.rating && (
              <div className="text-lg text-brand-red">{"★".repeat(spotlight.rating)}</div>
            )}
            <p className="mt-3 text-lg text-gray-700">{spotlight.body}</p>
            <p className="mt-4 text-sm font-semibold text-brand-black">
              {spotlight.is_anonymous ? "Anonymous" : spotlight.author_name}
            </p>
          </div>
        </div>

        {rest.length > 0 && (
          <div className="mt-6 grid grid-cols-1 gap-4 @2xl:grid-cols-3">
            {rest.map((review) => (
              <div key={review.id} className="rounded-lg bg-white p-4 shadow-sm">
                {review.rating && (
                  <div className="text-sm text-brand-red">{"★".repeat(review.rating)}</div>
                )}
                <p className="mt-2 text-xs text-gray-600">{review.body}</p>
                <p className="mt-2 text-xs font-semibold text-brand-black">
                  — {review.is_anonymous ? "Anonymous" : review.author_name}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
