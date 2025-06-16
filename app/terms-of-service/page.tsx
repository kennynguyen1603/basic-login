import React from "react";

const TermsOfService = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <p className="text-gray-600 mb-4">Last updated: June 14, 2025</p>

      <div className="prose max-w-none">
        <p className="mb-6">
          Welcome to Firestarter.dev – a decentralized platform designed for
          tokenizing and launching Real World Asset (RWA) projects. By accessing
          or using our platform, you agree to the following Terms of Service
          ("Terms").
        </p>
        <p className="mb-8">
          Please read them carefully before using our services.
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            1. Acceptance of Terms
          </h2>
          <p className="mb-4">
            By accessing or using Firestarter.dev, you agree to be bound by
            these Terms, our Privacy Policy, and any future amendments.
          </p>
          <p className="mb-4">
            If you do not agree to these Terms, you may not use the service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Eligibility</h2>
          <p className="mb-4">You must:</p>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2">
              Be at least 18 years old or the age of majority in your
              jurisdiction.
            </li>
            <li className="mb-2">
              Have the legal authority to bind yourself or the organization you
              represent.
            </li>
            <li className="mb-2">
              Comply with all applicable local, national, and international
              laws.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            3. Account Registration
          </h2>
          <p className="mb-4">
            To access issuer functionalities, you must register by:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2">
              Connecting a valid crypto wallet (e.g. MetaMask)
            </li>
            <li className="mb-2">
              Or signing in via social OAuth (Google, Twitter, LinkedIn)
            </li>
            <li className="mb-2">
              Optionally completing KYC for verification and improved trust
              score.
            </li>
          </ul>
          <p className="mb-4">
            You are responsible for maintaining the confidentiality of your
            login credentials.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Platform Usage</h2>
          <p className="mb-4">You agree not to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2">
              Use the platform for fraudulent, misleading, or illegal purposes.
            </li>
            <li className="mb-2">
              Impersonate any person or entity or misrepresent your affiliation.
            </li>
            <li className="mb-2">
              Upload or launch projects that violate regulations, including
              securities laws.
            </li>
          </ul>
          <p className="mb-4">
            Firestarter.dev reserves the right to remove or suspend any issuer
            or project at our sole discretion.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            5. Issuer Responsibilities
          </h2>
          <p className="mb-4">As an issuer, you agree to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2">
              Provide accurate information when linking wallet and social
              accounts.
            </li>
            <li className="mb-2">
              Launch only legitimate and well-documented projects.
            </li>
            <li className="mb-2">
              Engage transparently with the investor community.
            </li>
          </ul>
          <p className="mb-4">
            Misuse or proven fraud will lead to trust score penalties,
            delisting, or platform bans.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Trust Score System</h2>
          <p className="mb-4">
            Each issuer is assigned a dynamic Trust Score, which is calculated
            using factors such as:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2">On-chain activity (staking, token use)</li>
            <li className="mb-2">KYC and social profile verifications</li>
            <li className="mb-2">Historical campaign performance</li>
            <li className="mb-2">Community interaction and transparency</li>
            <li className="mb-2">Absence of scam/fraud behavior</li>
          </ul>
          <p className="mb-4">
            Firestarter retains the right to adjust scoring algorithms at any
            time.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            7. Intellectual Property
          </h2>
          <p className="mb-4">
            All platform content, branding, and design belong to Firestarter.dev
            unless otherwise stated. You may not reproduce, distribute, or
            create derivative works without prior consent.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            8. Limitation of Liability
          </h2>
          <p className="mb-4">Firestarter.dev is not liable for:</p>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2">
              Investment outcomes on projects listed on the platform
            </li>
            <li className="mb-2">Loss of access due to wallet mismanagement</li>
            <li className="mb-2">
              Actions of third-party identity or KYC providers
            </li>
          </ul>
          <p className="mb-4">Use of the platform is at your own risk.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Termination</h2>
          <p className="mb-4">
            We reserve the right to suspend or terminate your account at any
            time if you violate these Terms or if we believe your actions harm
            the platform or its users.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Changes to Terms</h2>
          <p className="mb-4">
            We may modify these Terms at any time. Continued use of the platform
            indicates your acceptance of the updated Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">11. Governing Law</h2>
          <p className="mb-4">
            These Terms are governed by the laws of Singapore, without regard to
            conflict of law principles.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">12. Contact</h2>
          <p className="mb-4">
            If you have any questions about these Terms, please contact us at:
          </p>
          <p className="mb-4">
            Email:{" "}
            <a
              href="mailto:support@firestarter.io"
              className="text-blue-600 hover:text-blue-800"
            >
              support@firestarter.io
            </a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfService;
