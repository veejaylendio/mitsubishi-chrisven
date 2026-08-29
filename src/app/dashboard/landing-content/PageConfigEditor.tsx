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
import { usePersistedBoolean } from "@/lib/hooks/usePersistedBoolean";
import type { PageProfile, PageSection, SectionKey } from "@/lib/types";
import type {
  AdminClientPhoto,
  AdminHeroSlide,
  AdminReview,
  AdminVehicle,
} from "@/lib/content/admin-types";
import type { ClientPhoto, HeroSlide, Review, VehicleGroup } from "@/lib/types";

const PANEL_STORAGE_KEY = "page-config-panel-open";

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
  const [fullPreview, setFullPreview] = useState(false);
  const [panelOpen, setPanelOpen] = usePersistedBoolean(
    PANEL_STORAGE_KEY,
    true,
    () => window.innerWidth >= 1280,
  );

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

  const togglePanel = () => setPanelOpen(!panelOpen);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "\\") {
        e.preventDefault();
        setPanelOpen(!panelOpen);
      } else if (e.key === "Escape" && fullPreview) {
        setFullPreview(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [fullPreview, panelOpen, setPanelOpen]);

  const refresh = () => router.refresh();

  if (fullPreview) {
    return (
      <div className="fixed inset-0 z-40 bg-white">
        <PreviewPane
          heroSlides={heroSlidesPublicShape}
          vehicleGroups={vehicleGroups}
          reviews={reviewsPublicShape}
          clientPhotos={clientPhotosPublicShape}
          onExitFullPreview={() => setFullPreview(false)}
        />
      </div>
    );
  }

  return (
    <div className="-m-8 flex h-[calc(100vh-2rem)] flex-col">
      <ProfileToolbar
        profiles={profiles}
        currentProfile={currentProfile}
        dueProfiles={dueProfiles}
        panelOpen={panelOpen}
        onTogglePanel={togglePanel}
        onOpenPreview={() => setFullPreview(true)}
      />

      <div className="flex flex-1 overflow-hidden">
        <aside
          className={`shrink-0 overflow-hidden border-gray-200 bg-gray-50 transition-[width] duration-200 ease-out ${
            panelOpen ? "w-96 border-r" : "w-0 border-r-0"
          }`}
        >
          <div className="h-full w-96 overflow-y-auto">
            <SectionList onManageContent={setManager} onOpenTypography={() => setTypographyOpen(true)} />
          </div>
        </aside>

        <main className="min-w-0 flex-1 overflow-hidden">
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
