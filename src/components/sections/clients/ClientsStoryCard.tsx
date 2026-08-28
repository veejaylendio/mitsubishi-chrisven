import LazyImage from "@/components/LazyImage";
import type { ClientPhoto } from "@/lib/types";

/** Photo paired with a short testimonial-style caption card. */
export default function ClientsStoryCard({ photos }: { photos: ClientPhoto[] }) {
  const visible = photos.filter((p) => p.consent_confirmed);
  if (visible.length === 0) return null;

  return (
    <section className="px-6 py-16">
      <h2 className="text-center text-2xl font-bold text-brand-black">
        Released to Happy Clients
      </h2>
      <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((photo) => (
          <div key={photo.id} className="overflow-hidden rounded-lg bg-white shadow-sm">
            <LazyImage src={photo.image_url} alt={photo.client_name ?? ""} wrapperClassName="h-48 w-full" />
            <div className="p-4">
              {photo.quote && <p className="text-sm italic text-gray-600">&ldquo;{photo.quote}&rdquo;</p>}
              <p className="mt-2 text-sm font-semibold text-brand-black">
                {photo.client_name ?? "Happy client"}
              </p>
              {photo.vehicle_model && (
                <p className="text-xs text-gray-400">{photo.vehicle_model}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
