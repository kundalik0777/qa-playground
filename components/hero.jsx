import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { allUrls } from "@/data/BasicSetting";

const HeroSection = () => {
  return (
    <section
      aria-label="Hero section"
      className="mt-24 mb-8 md:mb-16 px-4 bg-background text-foreground"
    >
      <div className="container mx-auto text-center flex flex-col items-center">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
          Master Automation Testing With{" "}
          <span className="gradient-subTitle pl-2 text-4xl md:text-7xl font-bold leading-tight mb-6">
            QA PlayGround
          </span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-4xl mx-auto">
          Practice Selenium, Playwright, and Cypress automation testing with 22+
          interactive UI elements, a Bank Demo app, and a built-in Study
          Tracker. Free for QA engineers at every level.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/practice" passHref prefetch={false}>
            <Button
              size="lg"
              variant="default"
              className="px-8 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Get Started
            </Button>
          </Link>
          <Link
            href={allUrls.youtubeURL}
            target="_blank"
            rel="noopener noreferrer"
            passHref
          >
            <Button
              size="lg"
              variant="ghost"
              className="px-8 border border-border text-foreground hover:bg-accent hover:text-accent-foreground"
            >
              Watch Demo
            </Button>
          </Link>
        </div>

        {/* Buy Me A Coffee — subtle text link, de-emphasised from primary CTAs */}
        <div className="mt-6">
          <a
            href="https://www.buymeacoffee.com/randomcoders"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            ☕ Buy me a coffee
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
