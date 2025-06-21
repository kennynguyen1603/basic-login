"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { WalletSelector } from "@/components/wallet-selector";

export const API_URL_AUTH = `${process.env.NEXT_PUBLIC_API_URL}/auth`;

export default function LoginPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const { account, connected, signMessage } = useWallet();
  const router = useRouter();

  const handleWalletLogin = async () => {
    if (!connected || !account?.address || !account?.publicKey) {
      toast.error("Please connect your wallet first");
      return;
    }

    setLoading("wallet");
    try {
      const walletAddress = account.address.toString();
      const publicKey = account.publicKey.toString();

      // 1. Get nonce from server
      const nonceResponse = await axios.get(`${API_URL_AUTH}/nonce`, {
        params: { wallet_address: walletAddress },
      });

      const { nonce, message } = nonceResponse.data.data;

      // 2. Sign message with wallet
      if (!signMessage) {
        throw new Error("Wallet does not support message signing");
      }

      // Sign the message using Aptos wallet
      const signedMessage = await signMessage({
        message: message,
        nonce: nonce,
      });

      // Construct the login payload
      const loginPayload = {
        address: walletAddress,
        publicKey: publicKey,
        signature: signedMessage.signature,
        message: message,
      };

      // 3. Send login request with signature
      const loginResponse = await axios.post(
        `${API_URL_AUTH}/wallet-login`,
        loginPayload
      );

      const { accessToken, refreshToken, user } = loginResponse.data.data;

      // Save tokens and user data
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("userData", JSON.stringify(user));

      toast.success("Successfully logged in with wallet!");
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Wallet login error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to login with wallet";
      toast.error(errorMessage);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="mx-auto w-20 h-20 relative mb-4">
            <Image
              src="/placeholder-logo.svg"
              alt="Logo"
              fill
              className="object-contain"
            />
          </div>
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white">
            Welcome Back
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            Sign in to continue to your account
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl px-8 py-10 border border-gray-200 dark:border-gray-700">
          <div className="space-y-6">
            {/* Wallet Connect */}
            <div className="space-y-4">
              <WalletSelector />
              {connected && (
                <button
                  onClick={handleWalletLogin}
                  disabled={loading !== null}
                  className="w-full flex justify-center items-center py-4 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {loading === "wallet" ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Connecting...
                    </div>
                  ) : (
                    "Connect Wallet"
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              By signing in, you agree to our{" "}
              <Link
                href="/terms-of-service"
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy-policy"
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
