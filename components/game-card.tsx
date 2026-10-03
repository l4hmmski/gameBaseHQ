type GameCardProps = {
  title: string;
  platform: string;
  status: string;
};

export function GameCard({
  title,
  platform,
  status,
}: GameCardProps) {
  return (
    <article
      className="
        rounded-xl border
        border-gray-200 bg-white
        p-6 shadow-sm
        transition hover:-translate-y-1
        hover:shadow-md text-black
      "
    >
      <h2 className="text-xl font-bold">
        {title}
      </h2>

      <div className="mt-4 space-y-2">
        <p className="text-gray-600">
          <span className="font-semibold text-gray-900">
            Platform:
          </span>{" "}
          {platform}
        </p>

        <p className="text-gray-600">
          <span className="font-semibold text-gray-900">
            Status:
          </span>{" "}
          {status}
        </p>
      </div>
    </article>
  );
}