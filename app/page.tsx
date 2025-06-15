"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { FaGoogle, FaTwitter, FaWallet } from "react-icons/fa";

export default function LoginPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setLoading("google");
    try {
      const response = await fetch("http://localhost:8080/api/v1/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        if (data.redirectUrl) {
          window.location.href = data.redirectUrl;
        } else {
          toast.success("Successfully signed in with Google!");
        }
      } else {
        toast.error(data.message || "Failed to sign in with Google");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const handleTwitterSignIn = async () => {
    setLoading("twitter");
    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/auth/twitter",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        if (data.redirectUrl) {
          window.location.href = data.redirectUrl;
        } else {
          toast.success("Successfully signed in with Twitter!");
        }
      } else {
        toast.error(data.message || "Failed to sign in with Twitter");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const handleWalletConnect = async () => {
    setLoading("wallet");
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast("Coming soon", {
        icon: "🚀",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Choose your preferred sign-in method
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg px-8 py-10 border border-gray-200 dark:border-gray-700">
          <div className="space-y-4">
            {/* Google Sign In */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading !== null}
              className="group relative w-full flex justify-center items-center py-3 px-4 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <FaGoogle className="w-5 h-5 mr-3 text-red-500" />
              {loading === "google" ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700 dark:border-gray-200 mr-2"></div>
                  Signing in...
                </div>
              ) : (
                "Sign in with Google"
              )}
            </button>

            {/* Twitter Sign In */}
            <button
              onClick={handleTwitterSignIn}
              disabled={loading !== null}
              className="group relative w-full flex justify-center items-center py-3 px-4 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <FaTwitter className="w-5 h-5 mr-3 text-blue-400" />
              {loading === "twitter" ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700 dark:border-gray-200 mr-2"></div>
                  Signing in...
                </div>
              ) : (
                "Sign in with Twitter"
              )}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Or
                </span>
              </div>
            </div>

            {/* Wallet Connect */}
            <button
              onClick={handleWalletConnect}
              disabled={loading !== null}
              className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
            >
              <FaWallet className="w-5 h-5 mr-3" />
              {loading === "wallet" ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Connecting...
                </div>
              ) : (
                "Connect Wallet"
              )}
            </button>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              By signing in, you agree to our{" "}
              <a
                href="#"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
