"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCanvasStore } from "./store";
import ProfileToolbar from "./components/ProfileToolbar";
import SectionList from "./components/SectionList";
import PreviewPane from "./components/PreviewPane";
import TypographyPanel from "./components/TypographyPanel";
import HeroEditor from "./components/HeroEditor";
import VehicleManager from "./components/VehicleManager";
import ReviewManager from "./components/ReviewManager";
import ClientManager from "./components/ClientManager";
import type { PageProfile, PageSection, SectionKey } from "@/lib/types";
import type {
  AdminClientPhoto,
  AdminHeroSlide,
  AdminReview,
  AdminVehicle,
} from "@/lib/content/admin-types";
import type { ClientPhoto, HeroSlide, Review, VehicleGroup } from "@/lib/types";

export default function PageConfigEditor({
  profiles,
  currentProfile,
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
}: {
  profiles: PageProfile[];
  currentProfile: PageProfile;
  sections: PageSection[];
  dueProfiles: PageProfile[];
  heroSlidesAdmin: AdminHeroSlide[];
  vehiclesAdmin: AdminVehicle[];
  reviewsAdmin: AdminReview[];
  clientsAdmin: AdminClientPhoto[];
  heroSlidesPublicShape: HeroSlide[];
  vehicleGroups: VehicleGroup[];
  reviewsPublicShape: Review[];
  clientPhotosPublicShape: ClientPhoto[];
}) {
  const router = useRouter();
  const initialize = useCanvasStore((s) => s.initialize);
  const [manager, setManager] = useState<SectionKey | null>(null);
  const [typographyOpen, setTypographyOpen] = useState(false);

  // `key={currentProfile.id}` on this component in page.tsx forces a full remount on
  // profile switch, so this only ever needs to run once for the lifetime of an instance.
  useEffect(() => {
    initialize({
      profileId: currentProfile.id,
      profileName: currentProfile.name,
      sections: sections.map((s) => ({
        section_key: s.section_key,
        is_visible: s.is_visible,
        sort_order: s.sort_order,
        layout_variant: s.layout_variant,
        settings: s.settings,
      })),
      typography: currentProfile.typography,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refresh = () => router.refresh();

  return (
    <div className="-m-8 flex h-[calc(100vh-2rem)] flex-col">
      <ProfileToolbar profiles={profiles} currentProfile={currentProfile} dueProfiles={dueProfiles} />

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-96 shrink-0 overflow-y-auto border-r border-gray-200 bg-gray-50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Sections
            </p>
            <button
              type="button"
              onClick={() => setTypographyOpen(true)}
              className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50"
            >
              Typography
            </button>
          </div>
          <SectionList onManageContent={setManager} />
        </aside>

        <main className="flex-1 overflow-hidden">
          <PreviewPane
            heroSlides={heroSlidesPublicShape}
            vehicleGroups={vehicleGroups}
            reviews={reviewsPublicShape}
            clientPhotos={clientPhotosPublicShape}
          />
        </main>
      </div>

      {typographyOpen && <TypographyPanel onClose={() => setTypographyOpen(false)} />}

      {manager === "hero" && (
        <HeroEditor slides={heroSlidesAdmin} onChanged={refresh} onClose={() => setManager(null)} />
      )}
      {manager === "vehicles" && (
        <VehicleManager vehicles={vehiclesAdmin} onChanged={refresh} onClose={() => setManager(null)} />
      )}
      {manager === "reviews" && (
        <ReviewManager reviews={reviewsAdmin} onChanged={refresh} onClose={() => setManager(null)} />
      )}
      {manager === "clients" && (
        <ClientManager photos={clientsAdmin} onChanged={refresh} onClose={() => setManager(null)} />
      )}
    </div>
  );
}
