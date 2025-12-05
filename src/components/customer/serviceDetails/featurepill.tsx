const FeaturePill = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) => (
  <div className="flex items-start gap-3">
    <div className="text-2xl">{icon}</div>
    <div>
      <p className="text-xs text-gray-400 font-semibold uppercase tracking-[0.18em]">
        {label}
      </p>
      <p className="text-sm font-semibold text-white">{value}</p>
    </div>
  </div>
);
export default FeaturePill;
