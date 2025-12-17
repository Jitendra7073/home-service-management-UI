const FeaturePill = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-start gap-3">
    <div className="space-y-1">
      <p className="text-xs text-blue-50 font-semibold uppercase tracking-[0.18em]">
        {label}
      </p>
      <p className="text-sm font-semibold text-white">{value}</p>
    </div>
  </div>
);
export default FeaturePill;
