import LazyImage from "@/components/LazyImage";
import type { VehicleGroup } from "@/lib/types";

/** Compact, data-dense rows — good for comparing specs quickly. */
export default function VehicleTable({ groups }: { groups: VehicleGroup[] }) {
  const rows = groups.flatMap((group) =>
    group.trims.map((trim) => ({ vehicleName: group.name, ...trim })),
  );
  if (rows.length === 0) return null;

  return (
    <div className="mx-auto max-w-6xl overflow-x-auto px-6">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-400">
          <tr>
            <th className="py-3 pr-4">Vehicle</th>
            <th className="py-3 pr-4">Price</th>
            <th className="py-3 pr-4">Year</th>
            <th className="py-3 pr-4">Mileage</th>
            <th className="py-3 pr-4">Fuel</th>
            <th className="py-3 pr-4" />
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const primary = row.images.find((i) => i.is_primary) ?? row.images[0];
            return (
              <tr key={row.id} className="border-b border-gray-100">
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-3">
                    {primary && (
                      <LazyImage
                        src={primary.image_url}
                        alt={row.vehicleName}
                        wrapperClassName="h-12 w-16 shrink-0 rounded"
                      />
                    )}
                    <div>
                      <p className="font-semibold text-brand-black">
                        {row.vehicleName}
                        {row.trim && <span className="ml-1 font-normal text-gray-400">— {row.trim}</span>}
                      </p>
                      {row.badge && (
                        <span className="mt-0.5 inline-block rounded-full bg-brand-red/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-brand-red">
                          {row.badge}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-3 pr-4 font-semibold text-brand-red">
                  {row.price ? `₱${Number(row.price).toLocaleString()}` : "—"}
                </td>
                <td className="py-3 pr-4 text-gray-600">{row.year ?? "—"}</td>
                <td className="py-3 pr-4 text-gray-600">
                  {row.mileage != null ? `${row.mileage.toLocaleString()} km` : "—"}
                </td>
                <td className="py-3 pr-4 text-gray-600">{row.fuel_type ?? "—"}</td>
                <td className="py-3 pr-4 text-right">
                  <a
                    href={`/apply?vehicle=${row.id}`}
                    className="rounded-md bg-brand-black px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-red"
                  >
                    Inquire
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
