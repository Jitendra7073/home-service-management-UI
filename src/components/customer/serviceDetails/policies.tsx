const PoliciesGrid = () => {
  return (
    <div className="bg-white rounded-sm shadow-xs border border-gray-200 p-6 sm:p-8 mt-8">
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6">
        Important Information
      </h2>

      <div className="grid grid-cols-1 gap-5">
        {/* ---------------- CANCELLATION ---------------- */}
        <div className="p-5 rounded-sm border border-border bg-muted">
          <h3 className="text-md font-semibold text-foreground mb-3">
            Cancellation
          </h3>

          <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed">
            <li>• You can cancel the booking anytime before the service is completed.</li>
            <li>• Once cancelled, the booking cannot be restored.</li>
          </ul>
        </div>

        {/* ---------------- PAYMENT & REFUND ---------------- */}
        <div className="p-5 rounded-sm border border-border bg-muted">
          <h3 className="text-md font-semibold text-foreground mb-3">
            Payment & Refund
          </h3>

          <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed">
            <li>• If you have already paid, your refund will be started automatically.</li>
            <li>• Refunds usually reach your account within <strong>3–7 business days</strong>.</li>
            <li>• No refund is provided if the service is already completed.</li>
          </ul>
        </div>

        {/* ---------------- NOTE ---------------- */}
        <div className="p-4 rounded-sm bg-blue-50 border border-blue-200 text-[13px] text-blue-800 font-medium">
          Need help? Contact customer support anytime.
        </div>
      </div>
    </div>
  );
};

export default PoliciesGrid;
