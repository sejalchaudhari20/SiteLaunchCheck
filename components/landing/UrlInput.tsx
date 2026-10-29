"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Search } from "lucide-react";
import { trackAuditStarted } from "@/lib/analytics";

export function UrlInput() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    setIsLoading(true);
    trackAuditStarted('home', 'website');
    // In MVP, we just navigate to the results page with the URL
    router.push(`/audit?url=${encodeURIComponent(url)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl relative">
      <div className="relative flex items-center">
        <Search className="absolute left-4 text-muted w-5 h-5" />
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://your-website.com"
          required
          className="w-full pl-12 pr-[180px] sm:pr-[200px] py-4 rounded-full border-2 border-border focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all text-lg shadow-sm"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="absolute right-2 bg-primary hover:bg-primary/90 text-white font-medium py-2.5 px-6 rounded-full transition-all flex items-center gap-2 disabled:opacity-70"
        >
          {isLoading ? "Checking..." : "Check My Website"}
          {!isLoading && <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
    </form>
  );
}
