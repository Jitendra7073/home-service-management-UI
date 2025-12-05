import { ChevronRight, Clock } from "lucide-react";

const OtherServicesGrid = ({
  services,
  currentServiceId,
}: {
  services: Service[];
  currentServiceId: string;
}) => {
  const otherServices = services.filter((s) => s.id !== currentServiceId);
  if (otherServices.length === 0) return null;

  return (
    <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6 sm:p-8">
      <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-6">
        More Services from this Business
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {otherServices.map((s) => (
          <div
            key={s.id}
            className="group border border-gray-200 rounded-md bg-gray-50 transition-all cursor-pointer p-5">
            <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500 font-semibold mb-1">
              {s.category.name}
            </p>
            <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mb-2">
              {s.name}
            </h3>
            <p className="text-xs text-gray-600 line-clamp-2 mb-4">
              {s.category.description}
            </p>
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-black text-gray-900">
                ₹{s.price.toLocaleString("en-IN")}
              </span>
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{s.durationInMinutes} min</span>
              </div>
            </div>
            <div className="float-right flex items-center gap-1 text-xs text-blue-600 font-semibold opacity-0 group-hover:opacity-100 transition-all">
              View details <ChevronRight className="w-3 h-3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default OtherServicesGrid;
