import { motion } from 'framer-motion';
import { ArrowRight, Github, Linkedin, Twitter } from 'lucide-react';
import FloatingOrbs from '@/components/three/FloatingOrbs';

export function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      {/* 3D Background - Floating Orbs with VISIBLE movement */}
      <div className="absolute inset-0 z-0 opacity-60">
        <FloatingOrbs />
      </div>

      {/* Dark overlay to make text readable */}
      <div className="absolute inset-0 z-1 bg-gradient-to-b from-dark-bg/50 via-transparent to-dark-bg/50" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-primary-500 text-sm font-medium tracking-wide uppercase mb-4 block">
              Welcome to my portfolio
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Building Digital
              <br />
              <span className="text-primary-500">Experiences</span>
            </h1>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl">
              I'm a developer specializing in creating immersive web experiences
              with cutting-edge technology. Let's bring your ideas to life.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-all duration-300"
              >
                View Work
                <ArrowRight size={18} />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3 border border-gray-600 text-white font-medium rounded-lg hover:bg-white/10 transition-all duration-300"
              >
                Contact Me
              </a>
            </div>

            <div className="flex gap-4">
              <a
                href="https://github.com/Oyinkansola-Ayeni"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a
                href="https://www.linkedin.com/in/oyinkansola-ayeni-b90947228"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://x.com/Oyininc"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Hero;