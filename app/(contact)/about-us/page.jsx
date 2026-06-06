import { basicDetails } from "@/data/BasicSetting";
import Link from "next/link";
import React from "react";

export const metadata = {
  title: "About Us | QA Playground",
  description:
    "QA Playground is a purpose-built platform for QA automation engineers to practice Selenium, Playwright, and Cypress through 22+ interactive elements, a Bank Demo app, and a Study Tracker.",
  keywords: [
    "automation testing",
    "QA testing playground",
    "selenium practice",
    "cypress testing",
    "playwright automation",
    "software testing community",
    "test automation learning",
    "QA skills development",
  ],
  alternates: {
    canonical: `${basicDetails.websiteURL}/about-us`,
  },
  openGraph: {
    title: "About Us | QA Playground",
    description:
      "A purpose-built platform for QA automation engineers to practice Selenium, Playwright, and Cypress. Explore 22+ interactive elements, a Bank Demo app, and a QA Study Tracker.",
    url: `${basicDetails.websiteURL}/about-us`,
    siteName: basicDetails.websiteName,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "About Us | QA Playground",
    description:
      "A purpose-built platform for QA automation engineers to practice Selenium, Playwright, and Cypress.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const AboutPage = () => {
  return (
    <div className="text-foreground bg-background">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-2">About Us</h1>
      <p className="text-muted-foreground mb-8 text-lg">
        Practice, learn, and excel in QA automation testing.
      </p>

      {/* Mission */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">Our Mission</h2>
        <p className="mb-3 leading-relaxed">
          <strong>{basicDetails.websiteName}</strong> is a free, purpose-built platform for QA automation engineers who want to sharpen their skills through hands-on practice. We believe the best way to learn automation is by doing — not just reading about it.
        </p>
        <p className="leading-relaxed">
          Most real-world applications are not designed with testability in mind. We built QA Playground to fill that gap: a dedicated space where every element, form, table, and interaction exists specifically to be automated.
        </p>
      </section>

      {/* Problem we solve */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">The Problem We Solve</h2>
        <p className="mb-3 leading-relaxed">
          QA engineers at all levels — from beginners learning their first Selenium script to experienced engineers exploring Playwright — struggle to find realistic, stable environments to practice automation. Demo sites go down, real apps block bots, and basic tutorials don't cover the edge cases that come up in real work.
        </p>
        <p className="leading-relaxed">
          QA Playground provides a consistent, always-available environment with elements that behave predictably, are rich with automation-friendly attributes (<code>id</code>, <code>data-testid</code>, <code>data-action</code>), and cover the scenarios you actually encounter on the job.
        </p>
      </section>

      {/* What we offer */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">What We Offer</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="border border-border rounded-lg p-5">
            <h3 className="font-semibold text-lg mb-2">22+ Practice Elements</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Interactive UI elements designed for Selenium, Playwright, and Cypress practice — including inputs, buttons, tables, calendars, drag-and-drop, alerts, file uploads, shadow DOM, and more.
            </p>
          </div>
          <div className="border border-border rounded-lg p-5">
            <h3 className="font-semibold text-lg mb-2">Bank Demo Application</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A simulated banking app with login, dashboard, accounts, and transactions — built to practice end-to-end test automation scenarios in a realistic multi-page flow.
            </p>
          </div>
          <div className="border border-border rounded-lg p-5">
            <h3 className="font-semibold text-lg mb-2">Study Tracker</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Track your QA learning progress across multiple syllabi — Manual Testing, Selenium, Playwright, Cypress, API Testing, and more — with daily logging and resource saving.
            </p>
          </div>
          <div className="border border-border rounded-lg p-5">
            <h3 className="font-semibold text-lg mb-2">QA Tools &amp; Blog</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Free tools for QA engineers (JSON converter, more coming soon) plus a blog with tutorials, best practices, and guides on automation frameworks and testing strategy.
            </p>
          </div>
        </div>
      </section>

      {/* Who we are */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">Who We Are</h2>
        <p className="mb-3 leading-relaxed">
          QA Playground was created and is maintained by <strong>Kundalik Jadhav</strong>, a QA automation engineer with hands-on experience in Selenium, Playwright, and Cypress across real-world projects. The platform was built out of a genuine frustration with the lack of high-quality, purpose-built practice environments for QA professionals.
        </p>
        <p className="mb-3 leading-relaxed">
          The platform launched in early 2025 and is actively maintained and improved based on community feedback. It is free to use and will remain so.
        </p>
        <p className="leading-relaxed">
          We are not a corporation or VC-funded startup — just a QA engineer who wanted a better playground and decided to build it for everyone.
        </p>
      </section>

      {/* Community */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">Join the Community</h2>
        <p className="mb-3 leading-relaxed">
          QA Playground is more than a toolset — it is a growing community of testers who are serious about their craft. Whether you are preparing for interviews, picking up a new framework, or just keeping your skills sharp, this is a place to practice without pressure.
        </p>
        <p className="leading-relaxed">
          Follow us on{" "}
          <Link href="https://www.youtube.com/@qaplayground" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
            YouTube
          </Link>{" "}
          for tutorials and walkthroughs, or{" "}
          <Link href="/contact-us" className="text-blue-500 underline">
            reach out
          </Link>{" "}
          if you have suggestions, feature requests, or want to collaborate.
        </p>
      </section>

      {/* CTA */}
      <section className="border border-border rounded-lg p-6 bg-muted/30">
        <h2 className="text-xl font-semibold mb-2">Have a question or idea?</h2>
        <p className="text-muted-foreground mb-4">
          We would love to hear from you. Whether it is a bug report, a feature suggestion, or just a hello — get in touch.
        </p>
        <Link
          href="/contact-us"
          className="inline-block bg-primary text-primary-foreground px-5 py-2 rounded-md font-medium hover:opacity-90 transition-opacity"
        >
          Contact Us
        </Link>
      </section>
    </div>
  );
};

export default AboutPage;
