type ProfileItemProps = {
  label: string;
  value: string;
};

export function ProfileItem({
  label,
  value,
}: ProfileItemProps) {
  return (
    <div
      className="
        border-b border-gray-100
        py-5 last:border-b-0
      "
    >
      <p className="text-sm text-black">
        {label}
      </p>

      <p className="mt-1 font-semibold text-black">
        {value}
      </p>
    </div>
  );
}