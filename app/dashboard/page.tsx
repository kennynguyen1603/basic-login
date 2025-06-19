"use client";

import React from "react";
import { useEffect, useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaGoogle, FaTwitter } from "react-icons/fa";
import toast from "react-hot-toast";
import { truncateAddress } from "@/lib/utils";
import { API_URL_AUTH } from "../page";

interface UserData {
  id: string;
  email?: string;
  name?: string;
  walletAddress?: string;
  linkedAccounts?: {
    google?: boolean;
    twitter?: boolean;
  };
}

export default function DashboardPage() {
  const { account, connected, disconnect } = useWallet();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is authenticated
    const accessToken = localStorage.getItem("accessToken");
    const userDataStr = localStorage.getItem("userData");

    if (!accessToken || !connected) {
      router.push("/");
      return;
    }

    if (userDataStr) {
      setUserData(JSON.parse(userDataStr));
    }
  }, [connected, router]);

  const handleGoogleLink = async () => {
    setLoading("google");
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("No access token found");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/issuer/me/link/google`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to initiate Google linking");
      }

      const data = await response.json();
      window.location.href = data.url; // Redirect to Google OAuth
    } catch (error) {
      console.error("Google linking error:", error);
      toast.error("Failed to link Google account");
    } finally {
      setLoading(null);
    }
  };

  const handleTwitterLink = async () => {
    setLoading("twitter");
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("No access token found");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/issuer/me/link/twitter`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to initiate Twitter linking");
      }

      const data = await response.json();
      window.location.href = data.url; // Redirect to Twitter OAuth
    } catch (error) {
      console.error("Twitter linking error:", error);
      toast.error("Failed to link Twitter account");
    } finally {
      setLoading(null);
    }
  };

  const handleLogout = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      if (accessToken) {
        const response = await fetch(`${API_URL_AUTH}/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ refreshToken }),
        });
        if (!response.ok) {
          throw new Error("Logout API call failed");
        }
      }
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userData");
      disconnect();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 relative">
                <Image
                  src="/placeholder-logo.svg"
                  alt="Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Dashboard
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Wallet Info Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Wallet Information
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">
                  Connected Address
                </label>
                <div className="mt-1 flex items-center space-x-2">
                  <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    {account?.address
                      ? truncateAddress(account.address.toString())
                      : "Not connected"}
                  </code>
                  <button
                    onClick={() => {
                      if (account?.address) {
                        navigator.clipboard.writeText(
                          account.address.toString()
                        );
                      }
                    }}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 text-sm"
                  >
                    Copy
                  </button>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">
                  Network
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  Aptos Mainnet
                </p>
              </div>
            </div>
          </div>

          {/* User Info Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              User Information
            </h2>
            <div className="space-y-3">
              {userData.name && (
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">
                    Name
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {userData.name}
                  </p>
                </div>
              )}
              {userData.email && (
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">
                    Email
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {userData.email}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Social Links Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Social Links
            </h2>
            <div className="space-y-4">
              <button
                onClick={handleGoogleLink}
                disabled={loading !== null || userData.linkedAccounts?.google}
                className="group relative w-full flex justify-center items-center py-4 px-4 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-xl text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <span className="absolute left-4">
                  <FaGoogle
                    className="w-5 h-5 text-red-500"
                    aria-hidden="true"
                  />
                </span>
                {loading === "google" ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700 dark:border-gray-200 mr-2"></div>
                    Linking...
                  </div>
                ) : userData.linkedAccounts?.google ? (
                  "Google Connected"
                ) : (
                  "Link Google Account"
                )}
              </button>

              <button
                onClick={handleTwitterLink}
                disabled={loading !== null || userData.linkedAccounts?.twitter}
                className="group relative w-full flex justify-center items-center py-4 px-4 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-xl text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <span className="absolute left-4">
                  <FaTwitter
                    className="w-5 h-5 text-blue-400"
                    aria-hidden="true"
                  />
                </span>
                {loading === "twitter" ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700 dark:border-gray-200 mr-2"></div>
                    Linking...
                  </div>
                ) : userData.linkedAccounts?.twitter ? (
                  "Twitter Connected"
                ) : (
                  "Link Twitter Account"
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
