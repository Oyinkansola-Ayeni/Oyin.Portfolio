import { motion } from "framer-motion";
import { Code2, Globe, Layers, Zap } from "lucide-react";

const skills = [
  { name: "React/Next.js", level: 90 },
  { name: "Spring", level: 85 },
  { name: "Three.js/WebGL", level: 85 },
  { name: "TypeScript", level: 80 },
  { name: "Node.js", level: 80 },
  { name: "MongoDB", level: 92 },
  { name: "SQL", level: 92 },
];

export function About() {
  return (
    <section id="about" className="bg-dark-bg">
      <div className="section-container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-primary-500 text-sm tracking-widest uppercase mb-3 block">
            About Me
          </span>
          <h2 className="section-title mb-4">
            Crafting Digital
            <span className="text-primary-500"> Experiences</span>
          </h2>
          <p className="text-gray-400 text-base">
            I'm Oyin a developer passionate about creating immersive web experiences
            that combine beautiful design with cutting-edge technology.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {/* Bio */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Who Am I?
            </h3>
            <p className="text-gray-400 mb-5 leading-relaxed text-sm">
              With over 2+ years of experience in web development, I specialize in
              creating interactive 3D websites and applications that stand out.
              I believe in writing clean, maintainable code while pushing the
              boundaries of what's possible on the web.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-primary-500/10 flex items-center justify-center">
                  <Code2 size={16} className="text-primary-500" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Clean Code</p>
                  <p className="text-gray-500 text-xs">Best practices</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-primary-500/10 flex items-center justify-center">
                  <Zap size={16} className="text-primary-500" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Fast Performance</p>
                  <p className="text-gray-500 text-xs">Optimized apps</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-primary-500/10 flex items-center justify-center">
                  <Globe size={16} className="text-primary-500" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">3D Web</p>
                  <p className="text-gray-500 text-xs">Immersive experiences</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-primary-500/10 flex items-center justify-center">
                  <Layers size={16} className="text-primary-500" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Modern Stack</p>
                  <p className="text-gray-500 text-xs">Latest tech</p>
                </div>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">
              Skills & Expertise
            </h3>
            <div className="space-y-4">
              {skills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-300 text-sm">{skill.name}</span>
                    <span className="text-primary-500 text-sm">{skill.level}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-primary-600 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;