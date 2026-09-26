import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import GitHubGrid from '@/components/three/GitHubGrid';

export function ArchitecturalShowcase() {
  return (
    <section className="relative bg-dark-bg">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-bg via-dark-bg/95 to-dark-bg" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true, margin: "-50px" }}
            className="text-center mb-10"
          >
            {/* Badge */}
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/30 text-primary-400 text-xs font-medium mb-4 backdrop-blur-sm"
            >
              GitHub Activity
            </motion.span>
            
            {/* Main Title */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
              Contribution{' '}
              <span className="bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent">
                Grid
              </span>
            </h2>
            
            {/* Description */}
            <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto mb-6 leading-relaxed">
              A visual representation of my coding journey —
              <br className="hidden sm:block" />
              every commit, every contribution, every day.
            </p>
          </motion.div>

          {/* GitHub Grid Container */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-dark-card/30 backdrop-blur-sm border border-gray-800 rounded-2xl p-5 md:p-6"
          >
            <GitHubGrid />
          </motion.div>

          {/* Scroll Indicator */}
          <div className="hidden md:block text-center mt-8">
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="inline-flex items-center gap-2 text-gray-500 text-xs"
            >
              <span>Scroll to explore projects</span>
              <ChevronDown size={14} />
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-dark-bg to-transparent pointer-events-none" />
    </section>
  );
}

export default ArchitecturalShowcase;