import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "CEO, TechStart",
    content: "Amazing work! The 3D experience created for our landing page exceeded all expectations.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Product Manager",
    content: "Professional, creative, and delivered ahead of schedule. Highly recommended!",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Creative Director",
    content: "The attention to detail and technical expertise is outstanding. Will work with again.",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="bg-dark-card">
      <div className="section-container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-primary-500 text-sm tracking-widest uppercase mb-3 block">
            Testimonials
          </span>
          <h2 className="section-title mb-4">
            What People
            <span className="text-primary-500"> Say</span>
          </h2>
          <p className="text-gray-400 text-base">
            Don't just take my word for it - hear from my clients
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              className="p-5 rounded-xl bg-dark-bg border border-gray-800"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={15} className="fill-primary-500 text-primary-500" />
                ))}
              </div>
              <p className="text-gray-300 text-sm mb-4 italic leading-relaxed">"{testimonial.content}"</p>
              <div>
                <p className="text-white font-semibold text-sm">{testimonial.name}</p>
                <p className="text-gray-500 text-xs">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;