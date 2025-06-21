"use client";

import React from "react";
import { useEffect, useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaGoogle, FaTwitter } from "react-icons/fa";
import { IconType } from "react-icons";
import toast from "react-hot-toast";
import { truncateAddress } from "@/lib/utils";
import { API_URL_AUTH } from "../page";
import axios, { AxiosError } from "axios";

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

      // Lấy URL xác thực từ backend
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/issuer/me/link/google/url`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.data.data.url) {
        throw new Error("No auth URL received");
      }

      // Cấu hình cửa sổ popup
      const width = 500;
      const height = 600;
      const left = (window.innerWidth - width) / 2 + window.screenX;
      const top = (window.innerHeight - height) / 2 + window.screenY;

      // Tạo window features string
      const features = [
        `width=${width}`,
        `height=${height}`,
        `left=${left}`,
        `top=${top}`,
        "resizable=yes",
        "scrollbars=yes",
        "status=yes",
      ].join(",");

      // Mở popup và lưu reference
      const popupWindow = window.open(
        response.data.data.url,
        "_blank",
        features
      );

      if (!popupWindow) {
        toast.error("Popup was blocked. Please allow popups for this site.");
        setLoading(null);
        return;
      }

      // Xử lý message từ popup
      const handleMessage = (event: MessageEvent) => {
        const allowedOrigins = [
          process.env.NEXT_PUBLIC_API_URL,
          "http://localhost:8080",
          "http://localhost:3000",
        ];

        if (allowedOrigins.includes(event.origin)) {
          if (event.data.success) {
            toast.success("Google account linked successfully");
            setUserData((prev) => ({
              ...prev!,
              linkedAccounts: {
                ...prev!.linkedAccounts,
                google: true,
              },
            }));
          } else {
            toast.error(event.data.error || "Failed to link Google account");
          }

          // Cleanup
          window.removeEventListener("message", handleMessage);
          setLoading(null);
        }
      };

      // Thêm event listener cho message
      window.addEventListener("message", handleMessage);

      // Kiểm tra popup đóng
      const checkPopupClosed = setInterval(() => {
        if (popupWindow.closed) {
          clearInterval(checkPopupClosed);
          window.removeEventListener("message", handleMessage);
          setLoading(null);
        }
      }, 1000);
    } catch (error) {
      console.error("Error:", error);
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message || "Failed to link Google account"
        );
      } else {
        toast.error(
          (error as Error).message || "Failed to link Google account"
        );
      }
      setLoading(null);
    }
  };

  const handleTwitterLink = async () => {
    setLoading("twitter");
    let popupWindow: Window | null = null;
    let checkPopupInterval: NodeJS.Timeout | null = null;

    const cleanup = () => {
      if (checkPopupInterval) {
        clearInterval(checkPopupInterval);
      }
      window.removeEventListener("message", handleMessage);
      setLoading(null);
    };

    // Định nghĩa interface cho message data
    interface MessageData {
      success: boolean;
      provider: string;
      message?: string;
      error?: string;
    }

    const handleMessage = (event: MessageEvent<MessageData>) => {
      try {
        console.log("Received message event:", event);

        const allowedOrigins = [
          process.env.NEXT_PUBLIC_API_URL,
          "http://localhost:8080",
          "http://localhost:3000",
        ];

        // Kiểm tra origin và data
        if (!allowedOrigins.includes(event.origin)) {
          console.warn("Message from unauthorized origin:", event.origin);
          return;
        }

        if (!event.data) {
          console.warn("No data in message event");
          return;
        }

        const { success, provider, message, error } = event.data;

        // Kiểm tra xem có phải message từ Twitter OAuth không
        if (provider !== "twitter") {
          return;
        }

        if (success) {
          toast.success(message || "Twitter account linked successfully");
          setUserData((prev) => ({
            ...prev!,
            linkedAccounts: {
              ...prev!.linkedAccounts,
              twitter: true,
            },
          }));
        } else {
          toast.error(error || "Failed to link Twitter account");
        }

        // Cleanup
        cleanup();
        if (popupWindow && !popupWindow.closed) {
          popupWindow.close();
        }
      } catch (err) {
        console.error("Error handling message:", err);
        toast.error("Failed to process Twitter linking response");
        cleanup();
      }
    };

    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("No access token found");
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/issuer/me/link/twitter/url`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.data.data.url) {
        throw new Error("No auth URL received");
      }

      // Cấu hình cửa sổ popup
      const width = 500;
      const height = 600;
      const left = (window.innerWidth - width) / 2 + window.screenX;
      const top = (window.innerHeight - height) / 2 + window.screenY;

      const features = [
        `width=${width}`,
        `height=${height}`,
        `left=${left}`,
        `top=${top}`,
        "resizable=yes",
        "scrollbars=yes",
        "status=yes",
        "toolbar=no",
        "menubar=no",
        "location=yes",
      ].join(",");

      // Thêm event listener trước khi mở popup
      window.addEventListener("message", handleMessage);

      // Mở popup
      popupWindow = window.open(response.data.data.url, "_blank", features);

      if (!popupWindow) {
        cleanup();
        throw new Error(
          "Popup was blocked. Please allow popups for this site."
        );
      }

      // Focus vào popup
      popupWindow.focus();

      // Kiểm tra popup đóng
      checkPopupInterval = setInterval(() => {
        if (popupWindow?.closed) {
          console.log("Popup was closed");
          cleanup();
          if (loading === "twitter") {
            toast.error("Twitter linking was cancelled");
          }
        }
      }, 1000);
    } catch (error) {
      console.error("Twitter linking error:", error);
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message || error.message;
        toast.error(
          errorMessage === "Network Error"
            ? "Unable to connect to the server"
            : `Failed to link Twitter account: ${errorMessage}`
        );
      } else {
        toast.error(
          (error as Error).message || "Failed to link Twitter account"
        );
      }
      cleanup();
    }

    // Cleanup khi component unmount
    return () => {
      cleanup();
      if (popupWindow && !popupWindow.closed) {
        popupWindow.close();
      }
    };
  };

  const handleLogout = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      if (accessToken) {
        await axios.post(
          `${API_URL_AUTH}/logout`,
          { refreshToken },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
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
                    as="svg"
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
                    as="svg"
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
