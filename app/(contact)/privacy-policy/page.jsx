import { basicDetails } from "@/data/BasicSetting";
import { ArrowRight, Globe, Mail, MessageSquareText } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | QA Playground",
  description:
    "Read the QA Playground Privacy Policy to understand how we collect, use, and protect your personal information when you use our platform.",
  alternates: {
    canonical: `${basicDetails.websiteURL}/privacy-policy`,
  },
  openGraph: {
    title: "Privacy Policy | QA Playground",
    description:
      "Read the QA Playground Privacy Policy to understand how we collect, use, and protect your personal information.",
    url: `${basicDetails.websiteURL}/privacy-policy`,
    siteName: basicDetails.websiteName,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy | QA Playground",
    description:
      "Read the QA Playground Privacy Policy to understand how we collect, use, and protect your personal information.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const PrivacyPolicy = () => {
  return (
    <main className="text-gray-800 dark:text-gray-200 prose prose-slate dark:prose-invert max-w-none">
      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Effective Date: 6 June 2026 &nbsp;|&nbsp; Last Updated: 6 June 2026
      </p>

      <p className="mb-4">
        Welcome to <strong>{basicDetails.websiteName}</strong> (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;, or &ldquo;the Platform&rdquo;), accessible at{" "}
        <Link href={basicDetails.websiteURL} className="text-blue-500 underline">
          {basicDetails.websiteURL}
        </Link>
        . This Privacy Policy explains what personal information we collect, how we use it, and your rights regarding that information. By using the Platform, you agree to the practices described in this policy.
      </p>

      {/* 1. Information We Collect */}
      <h2 className="text-2xl font-semibold mt-8 mb-3">1. Information We Collect</h2>

      <h3 className="text-lg font-semibold mt-4 mb-2">a. Information You Provide Directly</h3>
      <ul className="list-disc pl-5 mb-4 space-y-1">
        <li>
          <strong>Account registration:</strong> Name and email address when you create an account.
        </li>
        <li>
          <strong>Contact enquiries:</strong> Name, email address, and message content when you contact us via the contact form or email.
        </li>
        <li>
          <strong>Study Tracker &amp; Resources:</strong> Learning progress data, syllabus preferences, and saved resources you choose to store in the Platform.
        </li>
      </ul>

      <h3 className="text-lg font-semibold mt-4 mb-2">b. Information Collected Automatically</h3>
      <ul className="list-disc pl-5 mb-4 space-y-1">
        <li>
          <strong>Log data:</strong> IP address, browser type and version, operating system, referring URL, pages visited, and time/date of your visit.
        </li>
        <li>
          <strong>Device information:</strong> Device type, screen resolution, and language preferences.
        </li>
        <li>
          <strong>Cookies and similar technologies:</strong> As described in detail in Section 3 below.
        </li>
        <li>
          <strong>Usage data:</strong> Interactions with practice elements, features used, and session duration, collected via Google Analytics.
        </li>
      </ul>

      {/* 2. How We Use Your Information */}
      <h2 className="text-2xl font-semibold mt-8 mb-3">2. How We Use Your Information</h2>
      <ul className="list-disc pl-5 mb-4 space-y-1">
        <li>To create and manage your account and authenticate your sessions.</li>
        <li>To provide, operate, and improve the Platform and its features.</li>
        <li>To respond to your enquiries and support requests.</li>
        <li>To analyse usage patterns and improve user experience via Google Analytics.</li>
        <li>To display relevant advertisements through Google AdSense.</li>
        <li>To send you important service-related communications (not marketing, unless you opt in).</li>
        <li>To protect our legal rights and comply with applicable laws.</li>
        <li>To detect and prevent fraudulent or abusive use of the Platform.</li>
      </ul>

      {/* 3. Cookies and Tracking Technologies */}
      <h2 className="text-2xl font-semibold mt-8 mb-3">3. Cookies and Tracking Technologies</h2>
      <p className="mb-3">
        We use cookies and similar tracking technologies to enhance your experience, analyse traffic, and serve advertisements. Cookies are small text files stored on your device by your browser.
      </p>

      <h3 className="text-lg font-semibold mt-4 mb-2">Types of Cookies We Use</h3>
      <ul className="list-disc pl-5 mb-4 space-y-2">
        <li>
          <strong>Strictly Necessary Cookies:</strong> Required for the Platform to function (e.g., session authentication via Better-Auth). These cannot be disabled.
        </li>
        <li>
          <strong>Functional / Preference Cookies:</strong> Store your preferences such as dark/light mode and Study Tracker settings (stored in localStorage).
        </li>
        <li>
          <strong>Analytics Cookies:</strong> Used by Google Analytics (see Section 4) to collect anonymous usage data. These help us understand how visitors use the Platform.
        </li>
        <li>
          <strong>Advertising Cookies:</strong> Used by Google AdSense and its partners (including the DoubleClick cookie) to serve personalised advertisements based on your browsing history on this and other websites (see Section 5).
        </li>
      </ul>

      <h3 className="text-lg font-semibold mt-4 mb-2">Managing Cookies</h3>
      <p className="mb-4">
        You can control and delete cookies through your browser settings. Note that disabling cookies may affect the functionality of certain parts of the Platform. For more information, visit{" "}
        <Link href="https://www.aboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
          www.aboutcookies.org
        </Link>
        .
      </p>

      {/* 4. Google Analytics */}
      <h2 className="text-2xl font-semibold mt-8 mb-3">4. Google Analytics</h2>
      <p className="mb-4">
        We use <strong>Google Analytics</strong> (tracking ID: <code>G-Z4H9RTYGS4</code>) to analyse how visitors interact with the Platform. Google Analytics collects data such as pages visited, time spent, and general geographic location. This data is aggregated and anonymised — we cannot identify you personally from it.
      </p>
      <p className="mb-4">
        Google Analytics uses cookies to collect this information. You can opt out of Google Analytics tracking by installing the{" "}
        <Link href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
          Google Analytics Opt-out Browser Add-on
        </Link>
        . To learn how Google uses data from sites that use its services, visit{" "}
        <Link href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
          Google&apos;s Privacy &amp; Terms
        </Link>
        .
      </p>

      {/* 5. Google AdSense and Third-Party Advertising */}
      <h2 className="text-2xl font-semibold mt-8 mb-3">5. Google AdSense and Third-Party Advertising</h2>
      <p className="mb-4">
        We use <strong>Google AdSense</strong> to display advertisements on the Platform. Google AdSense is an advertising service provided by Google LLC. Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this website and other websites across the internet.
      </p>
      <p className="mb-4">
        Google uses the <strong>DoubleClick cookie</strong> and other tracking technologies to serve ads based on your interests. These cookies allow Google and its partners to serve personalised ads to you when you visit our Platform and other websites.
      </p>
      <ul className="list-disc pl-5 mb-4 space-y-1">
        <li>We do not control the cookies placed by Google or its advertising partners.</li>
        <li>Google may share data collected via AdSense with other Google services.</li>
        <li>
          To learn more about how Google uses information from sites that use its advertising services, visit{" "}
          <Link href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
            Google&apos;s Advertising Privacy Policy
          </Link>
          .
        </li>
      </ul>

      <h3 className="text-lg font-semibold mt-4 mb-2">Opt Out of Personalised Advertising</h3>
      <p className="mb-4">
        You can opt out of personalised advertising served by Google and its partners at any time:
      </p>
      <ul className="list-disc pl-5 mb-4 space-y-1">
        <li>
          Visit{" "}
          <Link href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
            Google Ad Settings
          </Link>{" "}
          to manage your Google advertising preferences.
        </li>
        <li>
          Visit{" "}
          <Link href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
            YourAdChoices (aboutads.info)
          </Link>{" "}
          to opt out of interest-based advertising from participating companies.
        </li>
        <li>
          Visit the{" "}
          <Link href="https://www.networkadvertising.org/managing/opt_out.asp" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
            Network Advertising Initiative opt-out page
          </Link>
          .
        </li>
      </ul>
      <p className="mb-4">
        Opting out of personalised ads does not mean you will stop seeing ads — it means the ads you see will be less relevant to your interests.
      </p>

      {/* 6. Sharing Your Information */}
      <h2 className="text-2xl font-semibold mt-8 mb-3">6. Sharing Your Information</h2>
      <p className="mb-3">
        We do not sell, rent, or trade your personal information. We may share your information only in the following circumstances:
      </p>
      <ul className="list-disc pl-5 mb-4 space-y-1">
        <li>
          <strong>Service providers:</strong> Third-party vendors that help operate the Platform, such as Vercel (hosting), Neon/Supabase (database hosting), Google Analytics, and Google AdSense. These providers are bound by contractual obligations to keep your information confidential.
        </li>
        <li>
          <strong>Legal obligations:</strong> If required by law, court order, or governmental authority.
        </li>
        <li>
          <strong>Business transfers:</strong> In connection with a merger, acquisition, or sale of all or part of our assets, your information may be transferred as part of that transaction.
        </li>
        <li>
          <strong>Protection of rights:</strong> To enforce our Terms of Service, protect our rights, or prevent fraud or illegal activity.
        </li>
      </ul>

      {/* 7. Your Rights and Choices */}
      <h2 className="text-2xl font-semibold mt-8 mb-3">7. Your Rights and Choices</h2>
      <p className="mb-3">Depending on your location, you may have the following rights regarding your personal data:</p>

      <h3 className="text-lg font-semibold mt-4 mb-2">All Users</h3>
      <ul className="list-disc pl-5 mb-4 space-y-1">
        <li>Request access to the personal data we hold about you.</li>
        <li>Request correction of inaccurate or incomplete data.</li>
        <li>Request deletion of your account and associated data.</li>
        <li>Opt out of personalised advertising (see Section 5).</li>
        <li>Manage cookies through your browser settings.</li>
      </ul>

      <h3 className="text-lg font-semibold mt-4 mb-2">EU / EEA Users (GDPR)</h3>
      <ul className="list-disc pl-5 mb-4 space-y-1">
        <li>Right of access (Article 15 GDPR).</li>
        <li>Right to rectification (Article 16 GDPR).</li>
        <li>Right to erasure / &ldquo;right to be forgotten&rdquo; (Article 17 GDPR).</li>
        <li>Right to restriction of processing (Article 18 GDPR).</li>
        <li>Right to data portability (Article 20 GDPR).</li>
        <li>Right to object to processing (Article 21 GDPR).</li>
        <li>Right to withdraw consent at any time where processing is based on consent.</li>
      </ul>

      <h3 className="text-lg font-semibold mt-4 mb-2">California Residents (CCPA)</h3>
      <ul className="list-disc pl-5 mb-4 space-y-1">
        <li>Right to know what personal information is collected, used, shared, or sold.</li>
        <li>Right to delete personal information (with certain exceptions).</li>
        <li>Right to opt out of the sale of personal information. (We do not sell personal information.)</li>
        <li>Right to non-discrimination for exercising your CCPA rights.</li>
      </ul>

      <p className="mb-4">
        To exercise any of these rights, please contact us at{" "}
        <Link href={`mailto:${basicDetails.websiteEmail}`} className="text-blue-500 underline">
          {basicDetails.websiteEmail}
        </Link>
        . We will respond within 30 days.
      </p>

      {/* 8. Data Retention */}
      <h2 className="text-2xl font-semibold mt-8 mb-3">8. Data Retention</h2>
      <ul className="list-disc pl-5 mb-4 space-y-1">
        <li>
          <strong>Account data:</strong> Retained for as long as your account is active. You may delete your account at any time by contacting us.
        </li>
        <li>
          <strong>Session data:</strong> Authentication sessions expire after 7 days of inactivity.
        </li>
        <li>
          <strong>Analytics data:</strong> Google Analytics retains data for 26 months by default.
        </li>
        <li>
          <strong>Contact enquiries:</strong> Retained for up to 12 months to allow us to follow up on your request.
        </li>
        <li>
          <strong>LocalStorage data:</strong> Stored in your browser until you clear your browser data or uninstall the browser.
        </li>
      </ul>

      {/* 9. Data Security */}
      <h2 className="text-2xl font-semibold mt-8 mb-3">9. Data Security</h2>
      <p className="mb-4">
        We implement reasonable technical and organisational measures to protect your personal data against unauthorised access, alteration, disclosure, or destruction. These include encrypted database connections, secure HTTPS transmission, and session-based authentication via Better-Auth.
      </p>
      <p className="mb-4">
        However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee absolute security.
      </p>

      {/* 10. Third-Party Links */}
      <h2 className="text-2xl font-semibold mt-8 mb-3">10. Third-Party Links</h2>
      <p className="mb-4">
        The Platform may contain links to external websites (e.g., blog references, tutorial resources, GitHub). We are not responsible for the privacy practices of those sites. We encourage you to review the privacy policies of any third-party site you visit.
      </p>

      {/* 11. Children's Privacy */}
      <h2 className="text-2xl font-semibold mt-8 mb-3">11. Children&apos;s Privacy</h2>
      <p className="mb-4">
        The Platform is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe a child under 13 has provided us with personal data, please contact us immediately at{" "}
        <Link href={`mailto:${basicDetails.websiteEmail}`} className="text-blue-500 underline">
          {basicDetails.websiteEmail}
        </Link>{" "}
        so we can take appropriate action, including deleting the information.
      </p>

      {/* 12. Changes to This Policy */}
      <h2 className="text-2xl font-semibold mt-8 mb-3">12. Changes to This Policy</h2>
      <p className="mb-4">
        We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. When we do, we will update the &ldquo;Last Updated&rdquo; date at the top of this page. We encourage you to review this policy periodically. Your continued use of the Platform after any changes constitutes your acceptance of the updated policy.
      </p>

      {/* 13. Contact Us */}
      <section className="not-prose mt-12 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-6 dark:border-slate-800 dark:bg-slate-900/70 sm:px-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-rose-600 dark:text-rose-400">
            13. Contact Us
          </p>
          <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
            Questions about your privacy?
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300">
            If you have any questions, concerns, or requests regarding this Privacy Policy or your personal data, choose the best way to reach us below.
          </p>
        </div>

        <div className="grid gap-4 p-6 sm:grid-cols-3 sm:p-8">
          <Link
            href={`mailto:${basicDetails.websiteEmail}`}
            className="group rounded-xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-rose-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-rose-900/70"
          >
            <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300">
              <Mail className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="block text-sm font-semibold text-slate-950 dark:text-white">
              Email
            </span>
            <span className="mt-2 block break-words text-sm leading-6 text-slate-600 dark:text-slate-300">
              {basicDetails.websiteEmail}
            </span>
          </Link>

          <Link
            href="/contact-us"
            className="group rounded-xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-sky-900/70"
          >
            <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-300">
              <MessageSquareText className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="block text-sm font-semibold text-slate-950 dark:text-white">
              Contact page
            </span>
            <span className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-sky-700 dark:text-sky-300">
              Send a message
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
            </span>
          </Link>

          <Link
            href={basicDetails.websiteURL}
            className="group rounded-xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-900/70"
          >
            <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300">
              <Globe className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="block text-sm font-semibold text-slate-950 dark:text-white">
              Website
            </span>
            <span className="mt-2 block break-words text-sm leading-6 text-slate-600 dark:text-slate-300">
              {basicDetails.websiteURL}
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default PrivacyPolicy;
