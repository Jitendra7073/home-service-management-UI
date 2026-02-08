import Image from "next/image";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-10 text-center">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto">
        <Image
          src="/images/not-found.jpg"
          alt="Page Not Found"
          width={600}
          height={600}
          className="w-full h-auto object-contain"
          priority
        />
      </div>

      <div className="space-y-4 mt-6 sm:mt-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
          Page Not Found
        </h1>

        <p className=" text-gray-600 text-sm sm:text-base max-w-md mx-auto">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>

        <Link
          href="/"
          className="inline-block  p-2 hover:underline font-semibold text-gray-500 hover:text-black rounded-sm text-sm sm:text-base transition-all">
          Go back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
