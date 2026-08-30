import LazyImage from "@/components/LazyImage";
import type { ClientPhoto } from "@/lib/types";

const ROTATIONS = ["-rotate-3", "rotate-2", "-rotate-1", "rotate-3", "rotate-1", "-rotate-2"];

/** Slightly-rotated overlapping polaroid cards — warm, personal, scrapbook feel. */
export default function ClientsPolaroid({ photos }: { photos: ClientPhoto[] }) {
  const visible = photos.filter((p) => p.consent_confirmed);
  if (visible.length === 0) return null;

  return (
    <section className="bg-gray-50 px-6 py-16">
      <h2 className="text-center text-2xl font-bold text-brand-black">
        Released to Happy Clients
      </h2>
      <div className="mx-auto mt-12 flex max-w-5xl flex-wrap justify-center gap-x-2 gap-y-8">
        {visible.map((photo, i) => {
          const caption =
            photo.quote ??
            photo.caption ??
            [photo.client_name, photo.vehicle_model].filter(Boolean).join(" — ");
          return (
            <figure
              key={photo.id}
              className={`w-48 shrink-0 bg-white p-3 pb-6 shadow-md transition hover:z-10 hover:scale-105 hover:rotate-0 ${ROTATIONS[i % ROTATIONS.length]}`}
            >
              <LazyImage src={photo.image_url} alt={caption || ""} wrapperClassName="h-40 w-full" />
              {caption && (
                <figcaption className="mt-3 text-center font-serif text-sm italic text-gray-600">
                  {caption}
                </figcaption>
              )}
            </figure>
          );
        })}
      </div>
    </section>
  );
}
