import LazyImage from "./LazyImage";

export type ClientPhoto = {
  id: string;
  image_url: string;
  caption: string | null;
};

export default function ClientsGallery({ photos }: { photos: ClientPhoto[] }) {
  if (photos.length === 0) return null;

  return (
    <section className="px-6 py-16">
      <h2 className="text-center text-2xl font-bold text-brand-black">
        Released to Happy Clients
      </h2>
      <div className="mx-auto mt-10 grid max-w-5xl grid-cols-2 gap-4 sm:grid-cols-3">
        {photos.map((photo) => (
          <figure key={photo.id} className="overflow-hidden rounded-lg">
            <LazyImage
              src={photo.image_url}
              alt={photo.caption ?? "Released client vehicle"}
              wrapperClassName="h-48 w-full"
            />
            {photo.caption && (
              <figcaption className="mt-1 text-center text-xs text-gray-500">
                {photo.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </section>
  );
}
