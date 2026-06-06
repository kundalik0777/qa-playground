"use client";

import { useState } from "react";
import {
  User,
  Mail,
  Tag,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
} from "lucide-react";

const TOPICS = [
  { value: "", label: "Select a topic…" },
  { value: "Bug Report", label: "🐛 Bug Report — something is broken" },
  { value: "Feature Request", label: "💡 Feature Request — suggest an idea" },
  { value: "Collaboration", label: "🤝 Collaboration — work together" },
  { value: "Automation Help", label: "🤖 Automation Help — testing question" },
  { value: "Feedback", label: "💬 Give Feedback — share your thoughts" },
  { value: "General Enquiry", label: "📩 General Enquiry — anything else" },
];

const MAX_MESSAGE = 1000;
const initialState = { name: "", email: "", topic: "", message: "" };

const FieldIcon = ({ icon: Icon }) => (
  <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
);

const ContactForm = () => {
  const [form, setForm] = useState(initialState);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "message" && value.length > MAX_MESSAGE) return;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, subject: form.topic }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");

      setSubmittedEmail(form.email);
      setStatus("success");
      setForm(initialState);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message || "Failed to send. Please try again.");
    }
  };

  const inputBase =
    "w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed";

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12 px-6 rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20">
        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-xl font-semibold text-green-800 dark:text-green-300 mb-2">
          Message Sent!
        </h3>
        <p className="text-sm text-green-700 dark:text-green-400 max-w-sm leading-relaxed">
          Thanks for reaching out. We&apos;ll get back to you within 2 business days at{" "}
          <strong className="break-all">{submittedEmail}</strong>.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 inline-flex items-center gap-2 text-sm text-green-700 dark:text-green-400 hover:text-green-900 dark:hover:text-green-200 transition-colors font-medium"
        >
          <RotateCcw className="w-4 h-4" />
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Name + Email row */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="name" className="block text-sm font-medium">
            Full Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <FieldIcon icon={User} />
            <input
              id="name"
              name="name"
              type="text"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              className={inputBase}
              disabled={status === "loading"}
              autoComplete="name"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-sm font-medium">
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <FieldIcon icon={Mail} />
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={inputBase}
              disabled={status === "loading"}
              autoComplete="email"
            />
          </div>
        </div>
      </div>

      {/* Topic */}
      <div className="space-y-1.5">
        <label htmlFor="topic" className="block text-sm font-medium">
          Topic <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <select
            id="topic"
            name="topic"
            required
            value={form.topic}
            onChange={handleChange}
            className="w-full rounded-lg border border-input bg-background pl-10 pr-8 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed appearance-none cursor-pointer"
            disabled={status === "loading"}
          >
            {TOPICS.map(({ value, label }) => (
              <option key={value} value={value} disabled={value === ""}>
                {label}
              </option>
            ))}
          </select>
          {/* Custom chevron */}
          <svg
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Message */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="message" className="block text-sm font-medium">
            Message <span className="text-red-500">*</span>
          </label>
          <span
            className={`text-xs tabular-nums transition-colors ${
              form.message.length >= MAX_MESSAGE
                ? "text-red-500"
                : form.message.length >= MAX_MESSAGE * 0.85
                ? "text-amber-500"
                : "text-muted-foreground"
            }`}
          >
            {form.message.length}/{MAX_MESSAGE}
          </span>
        </div>
        <div className="relative">
          <MessageSquare className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground pointer-events-none" />
          <textarea
            id="message"
            name="message"
            required
            rows={6}
            value={form.message}
            onChange={handleChange}
            placeholder="Describe your question, issue, or idea in detail…"
            className="w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed resize-none"
            disabled={status === "loading"}
          />
        </div>
      </div>

      {/* Error banner */}
      {status === "error" && (
        <div className="flex items-start gap-2.5 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20 px-4 py-3">
          <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
          <p className="text-sm text-red-700 dark:text-red-400">{errorMsg}</p>
        </div>
      )}

      {/* Footer row — submit + privacy note */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground px-6 py-2.5 text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "loading" ? (
            <>
              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Sending…
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Send Message
            </>
          )}
        </button>
        <p className="text-xs text-muted-foreground">
          We&apos;ll only use your email to reply to your message.
        </p>
      </div>
    </form>
  );
};

export default ContactForm;
