import { motion } from "framer-motion";
import { Code2, Palette, Rocket, Zap } from "lucide-react";

const services = [
  {
    icon: Code2,
    title: "Web Development",
    description: "Modern, responsive websites built with the latest technologies.",
    color: "text-primary-500",
  },
  {
    icon: Palette,
    title: "  UI/UX Design & 3D Design",
    description: "Immersive and eye catching designs.",
    color: "text-primary-500",
  },
  {
    icon: Zap,
    title: "Performance",
    description: "Fast, optimized applications with great user experience.",
    color: "text-primary-500",
  },
  {
    icon: Rocket,
    title: "Deployment",
    description: "Seamless deployment and continuous integration setup.",
    color: "text-primary-500",
  },
];

export function Services() {
  return (
    <section id="services" className="bg-dark-bg">
      <div className="section-container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-primary-500 text-sm tracking-widest uppercase mb-3 block">
            What I Do
          </span>
          <h2 className="section-title mb-4">
            Services I
            <span className="text-primary-500"> Offer</span>
          </h2>
          <p className="text-gray-400 text-base">
            I provide high-quality web development services tailored to your needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              className="p-5 rounded-xl bg-dark-card border border-gray-800 hover:border-primary-500/50 transition-all duration-300 text-center group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary-500/20 transition-colors">
                <service.icon className={`${service.color}`} size={22} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{service.title}</h3>
              <p className="text-gray-400 text-sm">{service.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm transition-all duration-300"
          >
            Start a Project
            <Rocket size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}

export default Services;