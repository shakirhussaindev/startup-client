"use client";
import Link from "next/link";
import { Flame, Mail, MapPin } from "lucide-react";
import { FaGithub, FaXTwitter, FaLinkedin, FaDiscord } from "react-icons/fa6";
import { usePathname } from "next/navigation";

const platformLinks = [
  { name: "Home", href: "/" },
  { name: "Browse Startups", href: "/startups" },
  { name: "Co-founder Roles", href: "/opportunities" },
  { name: "Launch Guide", href: "/guide" },
];

const companyLinks = [
  { name: "About Us", href: "/about" },
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms of Service", href: "/terms" },
  { name: "Contact Support", href: "mailto:contact@startupforge.dev" },
];

const socialLinks = [
  { name: "GitHub", href: "https://github.com", icon: FaGithub },
  { name: "X (Twitter)", href: "https://twitter.com", icon: FaXTwitter },
  { name: "LinkedIn", href: "https://linkedin.com", icon: FaLinkedin },
  { name: "Discord", href: "https://discord.com", icon: FaDiscord },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const pathName = usePathname();
  if (pathName.includes("dashboard")) {
    return null;
  }

  return (
    <footer className="relative border-t border-default-200/50 bg-background/95 transition-colors dark:border-default-100/20">
      <div className="mx-auto max-w-7xl px-4 pt-14 pb-10 sm:px-6 lg:px-8">
        {/* ================= TOP GRID ================= */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* Brand & Contact (Takes 6 cols) */}
          <div className="space-y-4 md:col-span-6">
            <Link
              href="/"
              className="group inline-flex items-center gap-2.5 focus:outline-none"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-600 shadow-md shadow-orange-500/20 transition-transform duration-300 group-hover:scale-105">
                <Flame className="h-5 w-5 text-white" strokeWidth={2.2} />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">
                Startup
                <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                  Forge
                </span>
              </span>
            </Link>

            <p className="max-w-md text-sm leading-relaxed text-default-500">
              The co-founder network built for ambitious builders. Form teams,
              validate MVPs, and scale real ventures.
            </p>

            {/* Direct Contact Info */}
            <div className="flex flex-col space-y-2 pt-1 text-sm text-default-600 dark:text-default-400">
              <div className="flex items-center gap-2.5">
                <Mail size={15} className="text-orange-500" />
                <a
                  href="mailto:contact@startupforge.dev"
                  className="transition-colors hover:text-foreground hover:underline"
                >
                  contact@startupforge.dev
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin size={15} className="text-orange-500" />
                <span>San Francisco, CA & Remote Worldwide</span>
              </div>
            </div>
          </div>

          {/* Quick Links: Platform (Takes 3 cols) */}
          <div className="space-y-3.5 md:col-span-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Platform
            </h3>
            <ul className="space-y-2.5 text-sm">
              {platformLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-default-500 transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links: Company (Takes 3 cols) */}
          <div className="space-y-3.5 md:col-span-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Company
            </h3>
            <ul className="space-y-2.5 text-sm">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-default-500 transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ================= BOTTOM BAR ================= */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-default-200/50 pt-7 dark:border-default-100/20 sm:flex-row">
          {/* Copyright */}
          <p className="text-xs text-default-400 text-center sm:text-left">
            &copy; {currentYear} StartupForge Inc. All rights reserved.
          </p>

          {/* Social Media Links */}
          <div className="flex items-center gap-2.5">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-default-200/60 bg-background text-default-500 transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-500/40 hover:bg-orange-500/10 hover:text-orange-500 dark:border-default-100/30"
                >
                  <Icon size={14} />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
