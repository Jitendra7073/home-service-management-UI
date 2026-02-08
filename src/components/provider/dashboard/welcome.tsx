const Welcome = ({ username, isLoading, isPending }: any) => {
  return (
    <div className="px-6 py-4">
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
          Welcome back,{" "}
          <span className="inline-block">
            {isLoading || isPending ? (
              <span className="inline-block h-6 w-32 rounded-sm bg-gray-200 animate-pulse align-middle" />
            ) : (
              <span className="text-blue-700 font-bold">{username}</span>
            )}
          </span>
        </h1>
        <p className="text-sm text-gray-500">
          Here is what&apos;s happening with your business today.
        </p>
      </div>
    </div>
  );
};

export default Welcome;
