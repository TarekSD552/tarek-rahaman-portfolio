"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Send,
  Sparkles,
  CheckCircle,
  Download,
  ArrowUpRight
} from "lucide-react";
import confetti from "canvas-confetti";
import SectionHeader from "@/components/ui/SectionHeader";
import MagneticButton from "@/components/ui/MagneticButton";
import { profileData } from "@/data/portfolioData";
import { useCms } from "@/context/CmsContext";

export default function ContactSection() {
  const { cmsData } = useCms();
  const contact = cmsData?.contactInfo;
  const email = contact?.email || profileData.email;
  const altEmail = contact?.alternateEmail || profileData.alternateEmail;
  const phone = contact?.phone || profileData.phone;
  const altPhone = contact?.alternatePhone || profileData.alternatePhone;
  const whatsapp = contact?.whatsapp || profileData.whatsapp;
  const location = contact?.location || profileData.location;
  const cvUrl = cmsData?.hero?.primaryButtonUrl || profileData.cvUrl;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate submission with delay
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);

      // Trigger celebratory confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#f59e0b", "#fbbf24", "#ffffff", "#38bdf8"],
      });
    }, 800);
  };

  return (
    <section id="contact" className="relative py-24 sm:py-32 overflow-hidden bg-[#04060b]">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 right-1/4 w-[36rem] h-[36rem] bg-amber-500/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          badge="Let's Connect"
          title="LET'S CREATE SOMETHING"
          highlightText="AMAZING TOGETHER"
          description="Have a high-impact project in mind or looking for a talented web developer? Reach out today and let's turn your vision into digital excellence."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Contact Info & Channels */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 space-y-6"
          >
            {/* Quick Action Box */}
            <div className="p-8 rounded-3xl bg-white/[0.02] border border-amber-500/20 backdrop-blur-xl space-y-6">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                <Sparkles className="w-4 h-4" />
                <span>DIRECT REACH CHANNELS</span>
              </div>

              <h3 className="text-2xl font-black text-white">
                Get In Touch Directly
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                I typically respond within a few hours. For urgent inquiries, feel free to drop a direct message on WhatsApp.
              </p>

              {/* Contact Items List */}
              <div className="space-y-4 pt-2">
                {/* WhatsApp Chat */}
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] hover:bg-emerald-500/10 border border-white/[0.06] hover:border-emerald-500/30 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                      WhatsApp (Instant)
                    </span>
                    <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {phone}
                    </h4>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 ml-auto group-hover:text-white transition-colors" />
                </a>

                {/* Email Address */}
                <a
                  href={`mailto:${email}`}
                  className="group flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] hover:bg-amber-500/10 border border-white/[0.06] hover:border-amber-500/30 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 group-hover:bg-amber-400 group-hover:text-black transition-all">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                      Primary Email
                    </span>
                    <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                      {email}
                    </h4>
                    <span className="text-[10px] text-slate-500">
                      Alt: {altEmail}
                    </span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 ml-auto group-hover:text-white transition-colors" />
                </a>

                {/* Phone Call */}
                <a
                  href={`tel:${phone.replace(/\s+/g, "")}`}
                  className="group flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] hover:bg-cyan-500/10 border border-white/[0.06] hover:border-cyan-500/30 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-black transition-all">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                      Direct Phone
                    </span>
                    <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {phone}
                    </h4>
                    <span className="text-[10px] text-slate-500">
                      Alt: {altPhone}
                    </span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 ml-auto group-hover:text-white transition-colors" />
                </a>

                {/* Location & Hours */}
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                    <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>Working Hours: Sat - Thu (10:00 AM - 8:00 PM)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Resume Quick Pill */}
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.08] flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">Need an official resume?</h4>
                <p className="text-xs text-slate-400 mt-0.5">Tarek Rahaman CV Resume (PDF)</p>
              </div>
              <MagneticButton>
                <a
                  href={cvUrl}
                  download="Tarek-Rahaman-CV.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-full text-xs font-bold text-white bg-white/[0.08] hover:bg-amber-400 hover:text-black transition-all flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
              </MagneticButton>
            </div>
          </motion.div>

          {/* Right Column: Interactive Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7"
          >
            <div className="p-8 sm:p-10 rounded-3xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              {submitted ? (
                <div className="py-16 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-[0_0_25px_rgba(16,185,129,0.4)]">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black text-white">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out. Tarek Rahaman will review your project details and get back to you shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
                    }}
                    className="mt-4 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-black bg-gradient-to-r from-amber-400 to-amber-500"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-black text-white">
                      Send A Message
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      Fill out the form below to kickstart your next project.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. John Doe"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] focus:border-amber-400 focus:outline-none text-sm text-white placeholder-slate-600 transition-colors"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                        Your Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] focus:border-amber-400 focus:outline-none text-sm text-white placeholder-slate-600 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                        Phone Number / WhatsApp
                      </label>
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+880 1XXX XXXXXX"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] focus:border-amber-400 focus:outline-none text-sm text-white placeholder-slate-600 transition-colors"
                      />
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                        Project Interest / Subject
                      </label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="e.g. E-Commerce Website Development"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] focus:border-amber-400 focus:outline-none text-sm text-white placeholder-slate-600 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                      Project Details & Requirements *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Briefly describe what you would like to build, timeline, or objectives..."
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] focus:border-amber-400 focus:outline-none text-sm text-white placeholder-slate-600 transition-colors resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <MagneticButton className="w-full sm:w-auto">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-sm font-bold text-black bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 shadow-[0_0_25px_rgba(245,158,11,0.5)] hover:shadow-[0_0_40px_rgba(245,158,11,0.8)] transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Submitting...</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Send Message Now</span>
                        </>
                      )}
                    </button>
                  </MagneticButton>
                </form>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

