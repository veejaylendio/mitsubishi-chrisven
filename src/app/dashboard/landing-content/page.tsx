import {
  getAllProfiles,
  getSectionsForProfileAdmin,
  getDueScheduledProfiles,
  getAllHeroSlidesAdmin,
  getAllVehiclesAdmin,
  getAllReviewsAdmin,
  getAllClientPhotosAdmin,
} from "@/lib/content/admin-queries";
import {
  getHeroSlides,
  getVehicleGroups,
  getReviews,
  getClientPhotos,
} from "@/lib/content/queries";
import PageConfigEditor from "./PageConfigEditor";

export default async function LandingContentPage(props: PageProps<"/dashboard/landing-content">) {
  const searchParams = await props.searchParams;
  const requestedProfileId =
    typeof searchParams.profile === "string" ? searchParams.profile : undefined;

  const profiles = await getAllProfiles();

  if (profiles.length === 0) {
    return (
      <div>
        <h1 className="text-xl font-bold text-brand-black">Page Configuration</h1>
        <p className="mt-2 text-sm text-gray-500">
          No profiles exist yet. Run the seed migration or create one from the database.
        </p>
      </div>
    );
  }

  const currentProfile =
    profiles.find((p) => p.id === requestedProfileId) ??
    profiles.find((p) => p.status === "active") ??
    profiles[0];

  const [
    sections,
    dueProfiles,
    heroSlidesAdmin,
    vehiclesAdmin,
    reviewsAdmin,
    clientsAdmin,
    heroSlidesPublicShape,
    vehicleGroups,
    reviewsPublicShape,
    clientPhotosPublicShape,
  ] = await Promise.all([
    getSectionsForProfileAdmin(currentProfile.id),
    getDueScheduledProfiles(),
    getAllHeroSlidesAdmin(),
    getAllVehiclesAdmin(),
    getAllReviewsAdmin(),
    getAllClientPhotosAdmin(),
    getHeroSlides(),
    getVehicleGroups(),
    getReviews(),
    getClientPhotos(),
  ]);

  return (
    <PageConfigEditor
      key={currentProfile.id}
      profiles={profiles}
      currentProfile={currentProfile}
      sections={sections}
      dueProfiles={dueProfiles}
      heroSlidesAdmin={heroSlidesAdmin}
      vehiclesAdmin={vehiclesAdmin}
      reviewsAdmin={reviewsAdmin}
      clientsAdmin={clientsAdmin}
      heroSlidesPublicShape={heroSlidesPublicShape}
      vehicleGroups={vehicleGroups}
      reviewsPublicShape={reviewsPublicShape}
      clientPhotosPublicShape={clientPhotosPublicShape}
    />
  );
}
