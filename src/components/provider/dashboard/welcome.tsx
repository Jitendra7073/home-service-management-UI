const Welcome = ({username,isLoading, isPending}:any) => {
  return (
    <section className="w-full rounded-md border bg-gray-50 px-6 py-6 sm:px-8 sm:py-8">
      <div className="space-y-2">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900">
          Welcome back,
          <span className="ml-2 inline-flex items-center">
            {isLoading || isPending ? (
              <span className="inline-block h-6 w-32 rounded-md bg-gray-200 animate-pulse" />
            ) : (
              <span className="text-blue-700 font-bold">
                {username }
              </span>
            )}
          </span>
        </h1>

        <p className="text-sm sm:text-base text-gray-600 max-w-xl">
          Here’s a quick overview of how your business is performing today.
        </p>
      </div>
    </section>
  );
};

export default Welcome;
