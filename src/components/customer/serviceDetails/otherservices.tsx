import { ChevronRight, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

interface BusinessData {
  services: any[];
}

const OtherServicesGrid = ({
  providerId,
  business,
  currentServiceId,
}: {
  providerId: any;
  business: BusinessData;
  currentServiceId: string;
}) => {
  const otherServices = business.services.filter(
    (s: any) => s.id !== currentServiceId
  );
  if (otherServices.length === 0) return null;

  const router = useRouter();
  console.log()

  const handleRedirecting = (service: any) => {
    router.push(
      `/customer/explore/${providerId.id}?serviceId=${service.id}`
    );
  };

  return (
    <div className="bg-white rounded-sm shadow-xs border border-gray-200 p-6 sm:p-8">
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-5">
        More Services from this Business
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {otherServices.map((s: any) => (
          <div
            key={s.id}
            className="group border border-gray-200 rounded-sm bg-gray-50 transition-all cursor-pointer p-5 hover:shadow-md hover:border-gray-300 "
            onClick={() => handleRedirecting(s)}>
            <h3 className="flex justify-between items-center gap-1 text-sm font-bold text-gray-900 line-clamp-2 mb-2">
              {s.name}
            </h3>
            <p className="text-xs text-gray-600 line-clamp-2 mb-4">
              {s.category.description}
            </p>
            <div className="flex items-center justify-between ">
              <span className="text-md font-semibold text-gray-800">
                ₹{s.price.toLocaleString("en-IN")}
              </span>
              <div className="flex items-center gap-1 text-xs text-gray-800">
                <Clock className="w-4 h-4" />
                <span>{
                        (s.durationInMinutes / 60)
                          .toFixed(2)
                          .split(".")[0]
                      }{s.durationInMinutes < 60 ? "Min" : "Hrs"} {
                        (s.durationInMinutes / 60)
                          .toFixed(2)
                          .split(".")[1] == "00"
                          ? ""
                          :(s.durationInMinutes / 60)
                              .toFixed(2)
                              .split(".")[1] + " Min"
                      }
                      </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default OtherServicesGrid;
