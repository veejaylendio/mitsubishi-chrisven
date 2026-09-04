import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import FinancingCalculator from "@/components/FinancingCalculator";
import { getBankRates, getVehiclePriceOptions } from "@/lib/content/queries";

export const metadata = {
  title: "Financing Calculator | Chrisven Romagos Mitsubishi Motors",
};

export default async function CalculatorPage() {
  const [banks, vehicles] = await Promise.all([getBankRates(), getVehiclePriceOptions()]);

  return (
    <div className="flex flex-1 flex-col">
      <NavBar />
      <section className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
        <h1 className="text-center text-2xl font-bold text-brand-black">Financing Calculator</h1>
        <p className="mt-2 text-center text-sm text-gray-500">
          Estimate your monthly amortization and compare rates across our partner banks.
        </p>
        <div className="mt-8">
          <FinancingCalculator banks={banks} vehicles={vehicles} />
        </div>
      </section>
      <Footer />
    </div>
  );
}
