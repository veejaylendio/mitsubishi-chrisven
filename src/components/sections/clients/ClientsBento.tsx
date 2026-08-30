import LazyImage from "@/components/LazyImage";
import type { ClientPhoto } from "@/lib/types";

/** Mixed large/small tiles — bigger tiles for photos with a quote (standout moments). */
export default function ClientsBento({ photos }: { photos: ClientPhoto[] }) {
  const visible = photos.filter((p) => p.consent_confirmed);
  if (visible.length === 0) return null;

  return (
    <section className="px-6 py-16">
      <h2 className="text-center text-2xl font-bold text-brand-black">
        Released to Happy Clients
      </h2>
      <div className="mx-auto mt-10 grid max-w-5xl grid-cols-2 gap-4 sm:grid-cols-4">
        {visible.map((photo, i) => {
          const caption =
            photo.quote ??
            photo.caption ??
            [photo.client_name, photo.vehicle_model].filter(Boolean).join(" — ");
          const featured = Boolean(photo.quote) || i === 0;
          return (
            <figure
              key={photo.id}
              className={`overflow-hidden rounded-lg ${featured ? "col-span-2 row-span-2" : ""}`}
            >
              <LazyImage
                src={photo.image_url}
                alt={caption || "Released client vehicle"}
                wrapperClassName={featured ? "h-64 w-full sm:h-full" : "h-32 w-full sm:h-40"}
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
