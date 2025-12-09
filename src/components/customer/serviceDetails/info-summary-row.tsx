const InfoRow = ({
  icon,
  label,
  value,
  isLink,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  isLink?: boolean;
}) => (
  <div className="flex  items-center gap-3 p-3 rounded-sm bg-gray-50 border border-gray-200">
    <div className="mt-0.5 text-gray-600">{icon}</div>
    <div>
      {/* <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500 font-semibold">
        {label}
      </p> */}
      {isLink ? (
        <a
          href={value}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-semibold text-blue-600 hover:underline break-all">
          {value}
        </a>
      ) : (
        <p className="text-sm font-medium text-gray-900 ">{value}</p>
      )}
    </div>
  </div>
);

const SummaryRow = ({
  label,
  value,
  subtle,
}: {
  label: string;
  value: string;
  subtle?: boolean;
}) => (
  <div className="flex items-center justify-between gap-3">
    <span
      className={`text-xs ${
        subtle ? "text-gray-500" : "text-gray-700 font-medium"
      }`}>
      {label}
    </span>
    <span
      className={`text-sm ${
        subtle ? "text-gray-700" : "text-gray-900 font-semibold"
      } text-right`}>
      {value}
    </span>
  </div>
);

export { InfoRow, SummaryRow };
