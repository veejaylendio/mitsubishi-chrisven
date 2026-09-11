import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import FinancingRate from "@/components/FinancingRate";
import { getBankRates, getVehiclePriceOptions } from "@/lib/content/queries";

export const metadata = {
  title: "Financing Rate | Chrisven Romagos Mitsubishi Motors",
};

export default async function CalculatorPage() {
  const [banks, vehicles] = await Promise.all([getBankRates(), getVehiclePriceOptions()]);

  return (
    <div className="flex flex-1 flex-col">
      <NavBar />
      <section className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
        <h1 className="text-center text-2xl font-bold text-brand-black">Financing Rate</h1>
        <p className="mt-2 text-center text-sm text-gray-500">
          Check cash pricing, all-in financing down payments, or estimate your monthly amortization.
        </p>
        <div className="mt-8">
          <FinancingRate banks={banks} vehicles={vehicles} />
        </div>
      </section>
      <Footer />
    </div>
  );
}
