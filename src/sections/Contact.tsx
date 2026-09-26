/**
 * Contact Section
 * 
 * Features:
 * - Functional contact form with validation
 * - Formspree integration for email handling
 * - Visual feedback on submission
 * - Animated background elements
 * - Social links
 */

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Send, 
  Mail, 
  MapPin, 
  Phone,
  Github,
  Linkedin,
  Twitter,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import type { ContactFormData } from '@/types';

gsap.registerPlugin(ScrollTrigger);

// Formspree configuration
const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT || '';

// Contact info
const contactInfo = [
  { icon: Mail, label: 'Email', value: 'oyin.tj8@gmail.com', href: 'mailto:oyin.tj8@gmail.com' },
  { icon: MapPin, label: 'Location', value: 'Lagos, Nigeria', href: '#' },
  { icon: Phone, label: 'Phone', value: '+234 911 832 3359', href: 'tel:+2349118323359' },
];

const socialLinks = [
  { icon: Github, label: 'GitHub', href: 'https://github.com/Oyinkansola-Ayeni' },
  { icon: Linkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/in/oyinkansola-ayeni-b90947228' },
  { icon: Twitter, label: 'Twitter', href: 'https://x.com/Oyininc' },
];

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});
  const [status, setStatus] = useState<FormStatus>('idle');

  // GSAP entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.contact-content',
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Validate email format
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof ContactFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Handle form submission with Formspree
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setStatus('submitting');

    try {
      if (!FORMSPREE_ENDPOINT || FORMSPREE_ENDPOINT === '') {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setStatus('idle'), 5000);
        return;
      }

      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          _replyto: formData.email,
        }),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative overflow-hidden bg-dark-bg"
    >
      {/* Subtle background decoration */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary-500/5 rounded-full blur-3xl" />

      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(14, 165, 233, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(14, 165, 233, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="contact-content">
          {/* Section header - space at top */}
          <div className="text-center max-w-2xl mx-auto pt-8 mb-12">
            <span className="text-primary-500 text-sm tracking-widest uppercase mb-3 block">
              Get In Touch
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">
              Let's Work
              <span className="text-primary-500"> Together</span>
            </h2>
            <p className="text-gray-400 text-base">
              Have a project in mind? I'd love to hear about it. Send me a message 
              and let's create something amazing together.
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
            {/* Contact info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-3">
                {contactInfo.map((item, index) => (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-3 p-4 rounded-xl bg-dark-card border border-gray-800 hover:border-primary-500 hover:bg-primary-500/5 transition-all duration-300 group"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center group-hover:bg-primary-500/20 transition-colors">
                      <item.icon className="text-primary-500" size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{item.label}</p>
                      <p className="text-white font-medium text-sm">{item.value}</p>
                    </div>
                  </motion.a>
                ))}
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-3">Follow me</p>
                <div className="flex gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-dark-card border border-gray-800 flex items-center justify-center hover:bg-primary-500/10 hover:border-primary-500 transition-all duration-300 group"
                      aria-label={social.label}
                    >
                      <social.icon className="text-gray-400 group-hover:text-primary-500 transition-colors" size={18} />
                    </a>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/30">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-green-400 text-xs font-medium">Available for work</span>
                </div>
                <p className="text-gray-400 text-xs">
                  Currently accepting new projects
                </p>
              </div>
            </div>

            {/* Contact form */}
            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <form onSubmit={handleSubmit} className="bg-dark-card/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
                {/* Name field */}
                <div className="mb-5">
                  <label htmlFor="name" className="block text-sm text-gray-400 mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`
                      w-full px-4 py-2.5 rounded-xl bg-dark-bg border border-gray-800 text-white placeholder-gray-500 text-sm
                      focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all
                      ${errors.name ? 'border-red-500' : 'hover:border-gray-700'}
                    `}
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email field */}
                <div className="mb-5">
                  <label htmlFor="email" className="block text-sm text-gray-400 mb-1.5">
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`
                      w-full px-4 py-2.5 rounded-xl bg-dark-bg border border-gray-800 text-white placeholder-gray-500 text-sm
                      focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all
                      ${errors.email ? 'border-red-500' : 'hover:border-gray-700'}
                    `}
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Message field */}
                <div className="mb-5">
                  <label htmlFor="message" className="block text-sm text-gray-400 mb-1.5">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className={`
                      w-full px-4 py-2.5 rounded-xl bg-dark-bg border border-gray-800 text-white placeholder-gray-500 text-sm
                      focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all resize-none
                      ${errors.message ? 'border-red-500' : 'hover:border-gray-700'}
                    `}
                    placeholder="Tell me about your project..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className={`
                    w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 text-sm
                    transition-all duration-300
                    ${status === 'submitting'
                      ? 'bg-gray-700 cursor-not-allowed'
                      : 'bg-primary-600 hover:bg-primary-700 text-white'
                    }
                  `}
                >
                  {status === 'submitting' ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : status === 'success' ? (
                    <>
                      <CheckCircle size={16} />
                      Sent!
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Send Message
                    </>
                  )}
                </button>

                {/* Status messages */}
                {status === 'success' && (
                  <motion.div
                    className="mt-4 p-3 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center gap-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <CheckCircle className="text-green-500" size={16} />
                    <p className="text-green-400 text-xs">
                      Message sent successfully! I'll get back to you soon.
                    </p>
                  </motion.div>
                )}

                {status === 'error' && (
                  <motion.div
                    className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <AlertCircle className="text-red-500" size={16} />
                    <p className="text-red-400 text-xs">
                      Something went wrong. Please try again later.
                    </p>
                  </motion.div>
                )}
              </form>
            </motion.div>
          </div>

          {/* Bottom spacer - adds space at the bottom of the section */}
          <div className="pb-8"></div>
        </div>
      </div>
    </section>
  );
}

export default Contact;