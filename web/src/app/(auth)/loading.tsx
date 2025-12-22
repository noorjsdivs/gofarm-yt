import { Loader2 } from "lucide-react";

const AuthLoading = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gofarm-light-orange flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <Loader2 className="w-12 h-12 text-gofarm-green animate-spin mx-auto mb-4" />
          <div className="absolute inset-0 w-12 h-12 border-2 border-gofarm-light-green/30 rounded-full animate-pulse mx-auto"></div>
        </div>
        <h2 className="text-xl font-semibold text-gofarm-green mb-2">
          Loading Authentication...
        </h2>
        <p className="text-dark-text">
          Please wait while we prepare your sign-in experience.
        </p>
      </div>
    </div>
  );
};

export default AuthLoading;
