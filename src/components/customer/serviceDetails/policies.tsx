const PoliciesGrid = () => {
  return (
    <div className="bg-white rounded-sm shadow-xs border border-gray-200 p-6 sm:p-8 mt-8">
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        Rules & Regulations / Booking Policies
      </h2>

      <div className="grid grid-cols-1 gap-5">
        <div className="p-5 rounded-sm border border-gray-200 bg-gray-50 transition-all">
          <h3 className="text-md font-bold text-gray-900 flex items-center gap-2 mb-3">
            Cancellation Policy
          </h3>
          <ul className="space-y-2 text-gray-700 text-sm leading-relaxed">
            <li>• Free cancellation Before provider approve your request.</li>
            <li>
              • No refund for missed or unavailability at service location.
            </li>
          </ul>
        </div>

        <div className="p-5 rounded-sm border border-gray-200 bg-gray-50 transition-all">
          <h3 className="text-md font-bold text-gray-900 flex items-center gap-2 mb-3">
            Payment Policy
          </h3>
          <ul className="space-y-2 text-gray-700 text-sm leading-relaxed">
            <li>• Prices are inclusive of all taxes.</li>
            <li>• Online payments are processed securely.</li>
          </ul>
        </div>

        <div className="p-4 rounded-sm bg-blue-50 border border-blue-200 text-[13px] text-blue-800 font-medium">
          ⚠️ By booking this service, you agree to all the above policies, rules
          and regulations. If you have any questions, please contact customer
          support.
        </div>
      </div>
    </div>
  );
};
export default PoliciesGrid;
