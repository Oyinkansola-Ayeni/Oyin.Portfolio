import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, PlayCircle, X } from "lucide-react";

interface Project {
  title: string;
  description: string;
  tech: string[];
  image: string;
  live?: string;
  video?: string;
  github?: string;
}

const projects: Project[] = [
  {
    title: "MediCore HMS",
    description:
      "A full hospital management system built as 11 independent microservices (Java/Spring Boot) plus a React/TypeScript frontend, deployed to a production Kubernetes cluster on AWS EKS. Patients book appointments and pay real invoices via Flutterwave and Payaza, with AI-assisted symptom triage powered by Groq.",
    tech: ["Spring Boot", "Kafka", "React", "TypeScript", "Docker", "Kubernetes", "AWS EKS"],
    video: "/videos/medicore-demo.mp4",
    github: "#",
    image: "/images/medicore.jpg",
  },
  {
    title: "TAFFsTECH & TAFFSUNNY",
    description: "I brought their vision to life with visually captivating elements and simple yet beautiful to navigate website",
    tech: ["Three.js", "GSAP", "React"],
    live: "https://www.taffsunny.com/",
    github: "#",
    image: "/images/taffstech.png",
  },
  {
    title: "Mind Haven (App & Website)",
    description: "A Software with the mission of helping those who need a community and mental wellness through others",
    tech: ["React Native", "React", "Spring", "Docker"],
    video: "/videos/mindhaven-demo.mp4",
    github: "#",
    image: "/images/mindhaven.png",
  },
];

export function Projects() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  return (
    <section id="projects" className="bg-dark-card">
      <div className="section-container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-primary-500 text-sm tracking-widest uppercase mb-3 block">
            Featured Work
          </span>
          <h2 className="section-title mb-4">
            My Recent
            <span className="text-primary-500"> Projects</span>
          </h2>
          <p className="text-gray-400 text-base">
            Here are some of my latest projects showcasing my skills in web development
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              className="group relative bg-dark-bg rounded-xl overflow-hidden border border-gray-800 hover:border-primary-500/50 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              {/* Project Image */}
              <div
                className={`relative h-44 overflow-hidden bg-primary-500/10 ${project.video ? "cursor-pointer" : ""}`}
                onClick={() => project.video && setActiveVideo(project.video)}
              >
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-primary-500 text-sm">Project Preview</div>
                  </div>
                )}
                {project.video && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <PlayCircle size={44} className="text-white drop-shadow-lg" />
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-white mb-2">{project.title}</h3>
                <p className="text-gray-400 text-sm mb-3 leading-relaxed">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map(tech => (
                    <span key={tech} className="text-xs px-2 py-1 bg-gray-800 rounded-full text-gray-300">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4">
                  {project.video ? (
                    <button
                      onClick={() => setActiveVideo(project.video!)}
                      className="text-sm flex items-center gap-1 text-primary-500 hover:text-primary-400 transition-colors"
                    >
                      <PlayCircle size={14} /> Watch Video
                    </button>
                  ) : project.live ? (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm flex items-center gap-1 text-primary-500 hover:text-primary-400 transition-colors"
                    >
                      <ExternalLink size={14} /> Live Demo
                    </a>
                  ) : null}
                  {project.github && project.github !== "#" && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
                    >
                      <Github size={14} /> Code
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveVideo(null)}
          >
            <motion.div
              className="relative w-full max-w-3xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute -top-10 right-0 text-gray-300 hover:text-white transition-colors"
                aria-label="Close video"
              >
                <X size={28} />
              </button>
              <video
                src={activeVideo}
                controls
                autoPlay
                className="w-full rounded-lg shadow-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default Projects;