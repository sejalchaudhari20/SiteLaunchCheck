import { UrlInput } from "@/components/landing/UrlInput";
import { 
  CheckCircle, Zap, Shield, Search, Smartphone, Globe, Layout, AlignLeft,
  ArrowRight, XCircle, AlertTriangle, CheckCircle2,
  FileCheck, PlayCircle, Wrench, Send
} from "lucide-react";
import Link from "next/link";

import { LandingFeedback } from "@/components/LandingFeedback";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Navigation */}
      <header className="border-b border-border bg-surface sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-primary" />
            <span className="font-heading font-bold text-xl tracking-tight">SiteLaunchCheck</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#how-it-works" className="text-muted hover:text-text font-medium transition-colors">How it works</a>
            <a href="#checks" className="text-muted hover:text-text font-medium transition-colors">Checks</a>
            <a href="#why-us" className="text-muted hover:text-text font-medium transition-colors">Why us?</a>
            <LandingFeedback />
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section id="audit" className="bg-background py-20 lg:py-32 overflow-hidden relative scroll-mt-24">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-5xl overflow-hidden -z-10 opacity-30">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
            <div className="absolute top-40 -left-40 w-72 h-72 bg-info/20 rounded-full blur-3xl"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-6 uppercase tracking-wider">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              FREE BETA &middot; Website Pre-Launch QA
            </div>
            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-dark max-w-4xl mb-6">
              Catch issues before your <span className="text-primary">client does.</span>
            </h1>
            <p className="text-xl text-muted max-w-2xl mb-10 leading-relaxed">
              Run a free website pre-launch audit. Check broken links, forms, images, SEO, accessibility, mobile issues and more before delivering your website.
            </p>
            
            <UrlInput />
            
            <p className="mt-4 text-sm text-muted font-medium">
              Free to use &middot; No signup required &middot; Takes less than a minute
            </p>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-24 bg-surface scroll-mt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-dark mb-4">How it works</h2>
              <p className="text-lg text-muted max-w-2xl mx-auto">From website build to client delivery in a few simple steps.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              {/* Connecting line for desktop */}
              <div className="hidden md:block absolute top-12 left-1/8 right-1/8 h-0.5 bg-border -z-10 transform translate-y-1/2 w-3/4 mx-auto" />
              
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center mb-6 border-4 border-surface shadow-sm">
                  1
                </div>
                <h3 className="font-bold text-lg mb-2 text-dark">Enter your URL</h3>
                <p className="text-muted text-sm leading-relaxed">Paste the website URL you want to check.</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center mb-6 border-4 border-surface shadow-sm">
                  2
                </div>
                <h3 className="font-bold text-lg mb-2 text-dark">Run the audit</h3>
                <p className="text-muted text-sm leading-relaxed">SiteLaunchCheck checks your website across important launch-readiness categories.</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center mb-6 border-4 border-surface shadow-sm">
                  3
                </div>
                <h3 className="font-bold text-lg mb-2 text-dark">Fix the issues</h3>
                <p className="text-muted text-sm leading-relaxed">Review critical issues, warnings, and recommendations so you know exactly what needs attention.</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center mb-6 border-4 border-surface shadow-sm">
                  4
                </div>
                <h3 className="font-bold text-lg mb-2 text-dark">Deliver with confidence</h3>
                <p className="text-muted text-sm leading-relaxed">Run the audit again and make sure the website is ready to hand over to your client.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Checks / Categories Section */}
        <section id="checks" className="py-24 bg-background scroll-mt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-dark mb-4">Everything you need to check before launch</h2>
              <p className="text-lg text-muted max-w-2xl mx-auto">SiteLaunchCheck looks beyond SEO to catch the issues that can affect your website, your client, and their visitors.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="p-6 rounded-2xl border border-border bg-surface hover:border-primary/30 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-background rounded-xl border border-border flex items-center justify-center mb-4 text-primary">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-dark">1. SEO Essentials</h3>
                <p className="text-muted text-sm leading-relaxed">Titles, meta descriptions, canonicals, Open Graph and basic indexing checks.</p>
              </div>
              
              <div className="p-6 rounded-2xl border border-border bg-surface hover:border-primary/30 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-background rounded-xl border border-border flex items-center justify-center mb-4 text-primary">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-dark">2. Links</h3>
                <p className="text-muted text-sm leading-relaxed">Find broken internal and external links, empty links and placeholder URLs.</p>
              </div>

              <div className="p-6 rounded-2xl border border-border bg-surface hover:border-primary/30 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-background rounded-xl border border-border flex items-center justify-center mb-4 text-primary">
                  <Layout className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-dark">3. Images</h3>
                <p className="text-muted text-sm leading-relaxed">Detect broken images, missing alt text, oversized images and missing dimensions.</p>
              </div>

              <div className="p-6 rounded-2xl border border-border bg-surface hover:border-primary/30 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-background rounded-xl border border-border flex items-center justify-center mb-4 text-primary">
                  <AlignLeft className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-dark">4. Forms</h3>
                <p className="text-muted text-sm leading-relaxed">Check form actions, submit buttons, email fields and accessible labels.</p>
              </div>

              <div className="p-6 rounded-2xl border border-border bg-surface hover:border-primary/30 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-background rounded-xl border border-border flex items-center justify-center mb-4 text-primary">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-dark">5. Technical</h3>
                <p className="text-muted text-sm leading-relaxed">Check HTTPS, viewport, charset, language, favicon and 404 behavior.</p>
              </div>

              <div className="p-6 rounded-2xl border border-border bg-surface hover:border-primary/30 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-background rounded-xl border border-border flex items-center justify-center mb-4 text-primary">
                  <FileCheck className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-dark">6. Content</h3>
                <p className="text-muted text-sm leading-relaxed">Catch Lorem Ipsum, placeholder text, placeholder images and outdated copyright years.</p>
              </div>

              <div className="p-6 rounded-2xl border border-border bg-surface hover:border-primary/30 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-background rounded-xl border border-border flex items-center justify-center mb-4 text-primary">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-dark">7. Accessibility Basics</h3>
                <p className="text-muted text-sm leading-relaxed">Check image accessibility, form labels, heading hierarchy and accessible control names.</p>
              </div>

              <div className="p-6 rounded-2xl border border-border bg-surface hover:border-primary/30 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-background rounded-xl border border-border flex items-center justify-center mb-4 text-primary">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-dark">8. Mobile / UX</h3>
                <p className="text-muted text-sm leading-relaxed">Detect horizontal overflow, mobile layout problems, tiny text and small touch targets.</p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <a href="#audit" className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-medium transition-colors">
                Check your website <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* Results Preview Section */}
        <section className="py-24 bg-surface border-y border-border overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-dark mb-4">See what your audit looks like</h2>
              <p className="text-lg text-muted max-w-2xl mx-auto">Get a clear picture of what's working, what needs attention, and what should be fixed before delivery.</p>
            </div>

            <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-border shadow-sm p-6 md:p-8">
              {/* Fake Dashboard Header */}
              <div className="flex flex-col md:flex-row items-center justify-between mb-8 pb-8 border-b border-border">
                <div className="text-center md:text-left mb-6 md:mb-0">
                  <p className="text-sm text-muted font-medium mb-1 uppercase tracking-wider">Example Audit Report</p>
                  <h3 className="text-2xl font-bold text-dark">https://example.com</h3>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm text-muted font-medium mb-1">Launch Status</p>
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold border bg-yellow-100 text-yellow-700 border-yellow-200">
                      ALMOST READY
                    </div>
                  </div>
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <svg className="transform -rotate-90 w-20 h-20">
                      <circle cx="40" cy="40" r="32" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-gray-100" />
                      <circle cx="40" cy="40" r="32" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray="201" strokeDashoffset="26" className="text-yellow-500" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-xl font-black text-yellow-500">87</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fake Dashboard Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-4">
                  <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center"><XCircle size={20} /></div>
                  <div><p className="text-xs text-muted uppercase font-medium">Critical</p><p className="text-2xl font-bold text-dark">3</p></div>
                </div>
                <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-xl flex items-center gap-4">
                  <div className="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center"><AlertTriangle size={20} /></div>
                  <div><p className="text-xs text-muted uppercase font-medium">Warnings</p><p className="text-2xl font-bold text-dark">5</p></div>
                </div>
                <div className="bg-green-50 border border-green-100 p-4 rounded-xl flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center"><CheckCircle2 size={20} /></div>
                  <div><p className="text-xs text-muted uppercase font-medium">Passed</p><p className="text-2xl font-bold text-dark">32</p></div>
                </div>
              </div>

              {/* Fake Categories Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { n: "SEO", s: 92, c: "bg-green-500" },
                  { n: "Links", s: 72, c: "bg-yellow-500" },
                  { n: "Forms", s: 55, c: "bg-yellow-500" },
                  { n: "Images", s: 88, c: "bg-green-500" },
                  { n: "Technical", s: 100, c: "bg-green-500" },
                  { n: "Accessibility", s: 84, c: "bg-green-500" },
                  { n: "Mobile / UX", s: 76, c: "bg-yellow-500" },
                ].map((cat, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1"><span className="text-muted">{cat.n}</span><span className="font-bold text-dark">{cat.s}%</span></div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5"><div className={`h-1.5 rounded-full ${cat.c}`} style={{ width: `${cat.s}%` }}></div></div>
                  </div>
                ))}
              </div>

              {/* Fake Issues List */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                  <XCircle size={18} className="text-red-500 shrink-0" />
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-100 text-red-700 uppercase tracking-wider shrink-0">CRITICAL</span>
                  <span className="text-sm font-medium text-dark truncate">Broken internal link</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                  <XCircle size={18} className="text-red-500 shrink-0" />
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-100 text-red-700 uppercase tracking-wider shrink-0">CRITICAL</span>
                  <span className="text-sm font-medium text-dark truncate">Contact form submission issue</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                  <AlertTriangle size={18} className="text-yellow-500 shrink-0" />
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-yellow-100 text-yellow-700 uppercase tracking-wider shrink-0">WARNING</span>
                  <span className="text-sm font-medium text-dark truncate">Missing meta description</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                  <AlertTriangle size={18} className="text-yellow-500 shrink-0" />
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-yellow-100 text-yellow-700 uppercase tracking-wider shrink-0">WARNING</span>
                  <span className="text-sm font-medium text-dark truncate">Large hero image</span>
                </div>
              </div>
              
              <div className="mt-8 text-center text-sm text-muted">
                This is a visual product preview only. Real audits provide detailed recommendations for each issue.
              </div>
            </div>
          </div>
        </section>

        {/* Why Us Section */}
        <section id="why-us" className="py-24 bg-background scroll-mt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-dark mb-4">Built for the final check before delivery</h2>
              <p className="text-lg text-muted max-w-2xl mx-auto">Don't just check if the website works. Check if it's ready to deliver.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="p-8 rounded-2xl bg-surface border border-border">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary">
                  <Send className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-dark">1. Built for website delivery</h3>
                <p className="text-muted leading-relaxed">Designed around the problems freelancers and agencies face before handing a website to a client.</p>
              </div>

              <div className="p-8 rounded-2xl bg-surface border border-border">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-dark">2. More than an SEO score</h3>
                <p className="text-muted leading-relaxed">Check links, forms, images, mobile behavior, accessibility basics, technical setup and client-facing content.</p>
              </div>

              <div className="p-8 rounded-2xl bg-surface border border-border">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary">
                  <Wrench className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-dark">3. Know what to fix</h3>
                <p className="text-muted leading-relaxed mb-3">Every issue should explain:</p>
                <ul className="space-y-2 text-sm text-muted">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> What went wrong</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Why it matters</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> How to fix it</li>
                </ul>
              </div>

              <div className="p-8 rounded-2xl bg-surface border border-border">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary">
                  <PlayCircle className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-dark">4. Check again before delivery</h3>
                <p className="text-muted leading-relaxed">Fix the issues, run the audit again, and verify the website before sending it to your client.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 bg-surface border-t border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-dark mb-4">Ready to check your website?</h2>
            <p className="text-lg text-muted mb-10">Run a final website check before you launch or hand it over to your client.</p>
            <a href="#audit" className="inline-flex items-center justify-center space-x-2 bg-primary text-white px-8 py-4 rounded-xl font-medium hover:bg-primary-dark transition-colors shadow-sm text-lg">
              <span>Check My Website</span>
              <ArrowRight size={20} />
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-6 h-6 text-primary" />
                <span className="font-heading font-bold text-xl tracking-tight">SiteLaunchCheck</span>
              </div>
              <p className="text-muted text-sm max-w-sm">
                Catch issues before you launch. The final website QA check for freelancers and agencies.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4">Product</h4>
              <ul className="space-y-3 text-sm text-muted">
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How it works</a></li>
                <li><a href="#checks" className="hover:text-white transition-colors">Checks</a></li>
                <li><a href="#why-us" className="hover:text-white transition-colors">Why us?</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-3 text-sm text-muted">
                <li><span className="opacity-50 cursor-not-allowed">Privacy</span></li>
                <li><span className="opacity-50 cursor-not-allowed">Terms</span></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted text-sm">
              © {new Date().getFullYear()} SiteLaunchCheck. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
