import {
  Receipt,
  Zap,
  Unlink2,
  Megaphone,
  LayoutDashboard,
  Monitor,
  Telescope,
  TableProperties,
} from "lucide-react";

// Stats Data
export const statsData = [
  {
    value: "10K+",
    label: "Active Users",
  },
  {
    value: "22+",
    label: "Practice Elements",
  },
  {
    value: "99.9%",
    label: "Uptime",
  },
  {
    value: "100%",
    label: "Always Free",
  },
];

// Features Data
export const featuresData = [
  {
    icon: <Unlink2 className="h-7 w-7 text-blue-600" />,
    to: "/practice",
    badge: "UI Elements",
    badgeClass:
      "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
    title: "Practice Web Elements",
    description:
      "22+ interactive UI elements — inputs, buttons, tables, drag-drop, shadow DOM, and more. Each element is designed for Selenium, Playwright, and Cypress automation practice.",
    count: "22+",
    difficulty: "Beginner",
    difficultyClass:
      "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-300",
  },
  {
    icon: <Receipt className="h-7 w-7 text-blue-600" />,
    to: "/practice/input",
    badge: "Forms",
    badgeClass:
      "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
    title: "Forms & Inputs",
    description:
      "Practice automating text inputs, textareas, checkboxes, radio buttons, and form validation scenarios commonly found in real-world applications.",
    count: "10+",
    difficulty: "Beginner",
    difficultyClass:
      "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-300",
  },
  {
    icon: <Megaphone className="h-7 w-7 text-amber-600" />,
    to: "/practice/alert",
    badge: "Browser",
    badgeClass:
      "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
    title: "Alerts & Windows",
    description:
      "Handle browser alerts, confirm dialogs, prompt boxes, and multi-window/tab switching — essential skills for any automation engineer.",
    count: "8+",
    difficulty: "Intermediate",
    difficultyClass:
      "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
  },
  {
    icon: <LayoutDashboard className="h-7 w-7 text-teal-600" />,
    to: "/bank",
    badge: "E2E Testing",
    badgeClass:
      "bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300",
    title: "Bank Demo App",
    description:
      "A full simulated banking application with login, accounts, dashboard, and transaction management — ideal for end-to-end automation test suites.",
    count: "15+",
    difficulty: "Intermediate",
    difficultyClass:
      "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
  },
  {
    icon: <Zap className="h-7 w-7 text-violet-600" />,
    to: "/practice/elements",
    badge: "Advanced",
    badgeClass:
      "bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300",
    title: "Interactions & Waits",
    description:
      "Practice drag-and-drop, sliders, iFrames, shadow DOM, explicit and implicit waits — complex scenarios that mirror real-world automation challenges.",
    count: "12+",
    difficulty: "Advanced",
    difficultyClass:
      "bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300",
  },
  {
    icon: <TableProperties className="h-7 w-7 text-teal-600" />,
    to: "/practice/simple-table",
    badge: "Data",
    badgeClass:
      "bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300",
    title: "Tables & Data",
    description:
      "Automate simple and advanced data tables with sorting, filtering, and pagination — a must-have skill for enterprise QA automation engineers.",
    count: "6+",
    difficulty: "Intermediate",
    difficultyClass:
      "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
  },
];

// How It Works Data
export const howItWorksData = [
  {
    icon: <Monitor className="h-8 w-8 text-blue-600" />,
    title: "1. Select and Set Up a Framework",
    description:
      "Begin your journey in minutes with our straightforward and user-friendly setup guides.",
  },
  {
    icon: <Telescope className="h-8 w-8 text-blue-600" />,
    title: "2. Explore a Topic of Your Choice",
    description:
      "Practice any topic at your convenience. We provide detailed test cases and comprehensive solutions.",
  },
  {
    icon: <Zap className="h-8 w-8 text-blue-600" />,
    title: "3. Start Practicing",
    description:
      "Begin testing with confidence. If you encounter challenges, our solutions are readily available on GitHub.",
  },
];

// Testimonials Data
export const testimonialsData = [
  {
    name: "Sarah Johnson",
    role: "Senior Automation Lead",
    image: "/avatars/sarah-johnson.svg",
    quote:
      "This website is a game-changer! The hands-on practice with Selenium and API testing helped me bridge the gap between theory and real-world applications.",
  },
  {
    name: "Michael Chen",
    role: "Senior Automation Analyst",
    image: "/avatars/michael-chen.svg",
    quote:
      "The interface is super easy to use, and the challenges are practical and engaging. Highly recommended for anyone looking to excel in automation testing.",
  },
  {
    name: "Anna Clerk",
    role: "Senior Automation Tester",
    image: "/avatars/anna-clerk.svg",
    quote:
      "I love how everything is so organized and user-friendly. The website covers everything from Selenium to API testing, with real-world exercises that mimic industry challenges.",
  },
];
