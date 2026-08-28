import LazyImage from "@/components/LazyImage";
import type { ClientPhoto } from "@/lib/types";

/** Horizontal scroll strip — consistent UI pattern with the vehicles carousel. */
export default function ClientsCarousel({ photos }: { photos: ClientPhoto[] }) {
  const visible = photos.filter((photo) => photo.consent_confirmed);
  if (visible.length === 0) return null;

  return (
    <section className="px-6 py-16">
      <h2 className="text-center text-2xl font-bold text-brand-black">
        Released to Happy Clients
      </h2>
      <div className="scrollbar-hide mx-auto mt-10 flex max-w-6xl snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-2">
        {visible.map((photo) => {
          const caption =
            photo.quote ??
            photo.caption ??
            [photo.client_name, photo.vehicle_model].filter(Boolean).join(" — ");
          return (
            <figure
              key={photo.id}
              className="w-64 shrink-0 snap-start overflow-hidden rounded-lg"
            >
              <LazyImage
                src={photo.image_url}
                alt={caption || "Released client vehicle"}
                wrapperClassName="h-48 w-full"
              />
              {caption && (
                <figcaption className="mt-1 text-center text-xs text-gray-500">
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
