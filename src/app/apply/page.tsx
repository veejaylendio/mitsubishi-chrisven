import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import ApplicationForm from "@/components/ApplicationForm";
import { getVehicleOptions } from "@/lib/content/queries";

export const metadata = {
  title: "Apply | Chrisven Romagos Mitsubishi Motors",
};

export default async function ApplyPage() {
  const vehicles = await getVehicleOptions();

  return (
    <div className="flex flex-1 flex-col">
      <NavBar />
      <section className="mx-auto w-full max-w-2xl flex-1 px-6 py-16">
        <h1 className="text-center text-2xl font-bold text-brand-black">Application Form</h1>
        <p className="mt-2 text-center text-sm text-gray-500">
          Complete your financing details and we&apos;ll follow up shortly.
        </p>
        <div className="mt-8">
          <ApplicationForm vehicles={vehicles} />
        </div>
      </section>
      <Footer />
    </div>
  );
}
