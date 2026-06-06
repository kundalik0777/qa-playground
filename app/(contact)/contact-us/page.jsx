import { allUrls, basicDetails, socialHandles } from "@/data/BasicSetting";
import Link from "next/link";
import React from "react";
import {
  Mail,
  Youtube,
  Github,
  Twitter,
  Clock,
  CheckCircle,
  MessageSquareText,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import ContactForm from "./ContactForm";

export const metadata = {
  title: "Contact Us | QA Playground",
  description:
    "Have a question, suggestion, or want to collaborate? Reach out to the QA Playground team. We typically respond within 2 business days.",
  alternates: {
    canonical: `${basicDetails.websiteURL}/contact-us`,
  },
  openGraph: {
    title: "Contact Us | QA Playground",
    description:
      "Reach out to the QA Playground team for help with automation testing, collaboration, or general enquiries.",
    url: `${basicDetails.websiteURL}/contact-us`,
    siteName: basicDetails.websiteName,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Contact Us | QA Playground",
    description:
      "Reach out to the QA Playground team for help with automation testing, collaboration, or general enquiries.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const TOPICS_WE_HELP = [
  "Bug reports on any practice element",
  "Feature requests or suggestions",
  "Collaboration and partnerships",
  "Automation testing questions",
  "General platform feedback",
];

const CONTACT_LINKS = [
  {
    icon: Mail,
    label: "Email",
    display: basicDetails.websiteEmail,
    href: `mailto:${basicDetails.websiteEmail}`,
    external: false,
  },
  {
    icon: Youtube,
    label: "YouTube",
    display: `@${socialHandles.youtubeId}`,
    href: allUrls.youtubeURL,
    external: true,
  },
  {
    icon: Github,
    label: "GitHub",
    display: socialHandles.githubId,
    href: allUrls.githubURL,
    external: true,
  },
  {
    icon: Twitter,
    label: "X (Twitter)",
    display: `@${socialHandles.twitterId}`,
    href: allUrls.twitterURL,
    external: true,
  },
  {
    icon: FaWhatsapp,
    label: "WhatsApp Community",
    display: "Join our community",
    href: allUrls.whatsappCommunityURL,
    external: true,
  },
];

const ContactUsPage = () => {
  return (
    <div className="text-foreground bg-background space-y-10">
      {/* Hero banner */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-950 dark:from-slate-900 dark:to-black px-8 py-12 text-white">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/80 mb-4">
            <MessageSquareText className="w-3.5 h-3.5" />
            We reply within 2 business days
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 leading-tight">
            Get in Touch
          </h1>
          <p className="text-white/70 text-base leading-relaxed max-w-xl">
            Have a question, spotted a bug, or want to suggest a new practice element? We&apos;d love to hear from you. Fill in the form and we&apos;ll get back to you shortly.
          </p>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid lg:grid-cols-3 gap-8">

        {/* Form card — 2/3 width */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-card shadow-sm p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-lg font-semibold">Send Us a Message</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                All fields marked <span className="text-red-500">*</span> are required.
              </p>
            </div>
            <ContactForm />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">

          {/* Contact links */}
          <div className="rounded-xl border border-border bg-card shadow-sm p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Other Ways to Reach Us
            </h2>
            <div className="space-y-3">
              {CONTACT_LINKS.map(({ icon: Icon, label, display, href, external }) => (
                <Link
                  key={label}
                  href={href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="flex items-center gap-3 group rounded-lg px-3 py-2.5 -mx-3 hover:bg-muted/60 transition-colors"
                >
                  <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                      {display}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Response time */}
          <div className="rounded-xl border border-border bg-card shadow-sm p-5">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">Response Time</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Typically within <strong className="text-foreground">2 business days</strong>. For urgent matters, mention it in the subject.
            </p>
          </div>

          {/* What we help with */}
          <div className="rounded-xl border border-border bg-card shadow-sm p-5">
            <h3 className="text-sm font-semibold mb-3">What We Can Help With</h3>
            <ul className="space-y-2">
              {TOPICS_WE_HELP.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
