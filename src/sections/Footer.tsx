import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-dark-bg border-t border-gray-800 py-12">
      <div className="section-container text-center">
        <div className="mb-8">
          <span className="text-3xl font-bold text-primary-500">OYIN.DEV</span>
        </div>
        
        <div className="flex justify-center gap-6 mb-8">
          <a href="#work" className="text-gray-400 hover:text-primary-500 transition-colors">Work</a>
          <a href="#about" className="text-gray-400 hover:text-primary-500 transition-colors">About</a>
          <a href="#contact" className="text-gray-400 hover:text-primary-500 transition-colors">Contact</a>
        </div>
        
        <p className="text-gray-500 text-sm flex items-center justify-center gap-1">
          Made with <Heart size={14} className="text-red-500 fill-red-500" /> by Oyin
        </p>
      </div>
    </footer>
  );
}

export default Footer;
