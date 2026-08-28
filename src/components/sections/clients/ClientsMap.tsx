import LazyImage from "@/components/LazyImage";
import type { ClientPhoto } from "@/lib/types";

const PIN = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
    <path d="M12 2C7.6 2 4 5.6 4 10c0 6 8 12 8 12s8-6 8-12c0-4.4-3.6-8-8-8zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
  </svg>
);

/**
 * Photos grouped by branch/location — a "location wall" rather than a literal
 * geographic map, since no branch coordinates exist in the data model.
 */
export default function ClientsMap({ photos }: { photos: ClientPhoto[] }) {
  const visible = photos.filter((p) => p.consent_confirmed);
  if (visible.length === 0) return null;

  const groups = visible.reduce<Record<string, ClientPhoto[]>>((acc, photo) => {
    const key = photo.branch ?? "Other locations";
    acc[key] ??= [];
    acc[key].push(photo);
    return acc;
  }, {});

  return (
    <section className="bg-gray-50 px-6 py-16">
      <h2 className="text-center text-2xl font-bold text-brand-black">
        Released to Happy Clients
      </h2>
      <p className="mt-2 text-center text-sm text-gray-400">Across our service areas</p>

      <div className="mx-auto mt-10 max-w-5xl space-y-10">
        {Object.entries(groups).map(([branch, branchPhotos]) => (
          <div key={branch}>
            <div className="flex items-center gap-2 text-brand-red">
              {PIN}
              <h3 className="text-sm font-semibold uppercase tracking-wide">{branch}</h3>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {branchPhotos.map((photo) => {
                const caption =
                  photo.quote ??
                  photo.caption ??
                  [photo.client_name, photo.vehicle_model].filter(Boolean).join(" — ");
                return (
                  <figure key={photo.id} className="overflow-hidden rounded-lg">
                    <LazyImage
                      src={photo.image_url}
                      alt={caption || ""}
                      wrapperClassName="h-32 w-full sm:h-40"
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
          </div>
        ))}
      </div>
    </section>
  );
}
