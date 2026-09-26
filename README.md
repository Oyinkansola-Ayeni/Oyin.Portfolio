# OYIN.DEV Portfolio

A stunning, production-ready developer portfolio featuring advanced 3D capabilities with Three.js, smooth GSAP animations, and immersive user experiences.

![Portfolio Preview](https://via.placeholder.com/1200x600?text=ALEX.VISION+Portfolio)

## ✨ Features

### 3D & WebGL
- **Interactive Icosahedron Hero** - Floating 3D shape that reacts to mouse movement and scroll position
- **Custom Shader Material** - Color transitions from cyan → purple → pink based on scroll
- **Particle Background** - Subtle 3D particles that follow cursor with connection lines
- **3D Tilt Cards** - Project cards with realistic 3D tilt effect on hover

### Animations
- **GSAP ScrollTrigger** - Staggered fade-in animations for all sections
- **Smooth Scroll** - Lenis smooth scrolling with buttery 60fps experience
- **Typing Effect** - Animated text cycling through phrases
- **Count-up Counters** - Animated statistics in the About section
- **Floating Icons** - Service cards with gentle floating animations

### UI/UX
- **Glassmorphism Design** - Modern frosted glass effects throughout
- **Custom Cursor** - Minimal circle cursor that expands on interactive elements
- **Dark/Light Theme** - Full theme toggle with localStorage persistence
- **Responsive Design** - Optimized for all device sizes
- **Mobile Performance** - Automatic quality reduction on low-power devices

### Technical
- **TypeScript** - Full type safety
- **Vite** - Fast development and optimized builds
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Pre-built accessible components
- **EmailJS Ready** - Contact form integration prepared

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Oyinkansola-Ayeni/Oyin.Portfolio.git
   cd oyinMainPortfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/
│   ├── three/           # Three.js 3D components
│   │   ├── IcosahedronScene.tsx    # Hero 3D icosahedron
│   │   ├── ParticleBackground.tsx  # Background particles
│   │   └── TiltCard3D.tsx          # 3D tilt project cards
│   └── ui-custom/       # Custom UI components
│       ├── CustomCursor.tsx        # Custom cursor
│       ├── LoadingScreen.tsx       # Loading animation
│       └── Navigation.tsx          # Glassmorphism nav
├── sections/            # Page sections
│   ├── Hero.tsx         # Hero with 3D background
│   ├── About.tsx        # About with skills & stats
│   ├── Projects.tsx     # Projects with 3D cards
│   ├── Services.tsx     # Services with floating icons
│   ├── Testimonials.tsx # Testimonial carousel
│   ├── Contact.tsx      # Contact form
│   └── Footer.tsx       # Footer with CTA
├── hooks/               # Custom React hooks
│   ├── useSmoothScroll.ts     # Lenis smooth scroll
│   ├── useScrollAnimation.ts  # GSAP scroll animations
│   ├── useTheme.ts            # Dark/light theme
│   ├── useMousePosition.ts    # Mouse tracking
│   └── useDeviceCapabilities.ts # Device detection
├── utils/               # Utility functions
│   └── helpers.ts       # Helper functions
├── types/               # TypeScript types
│   └── index.ts         # Shared types
├── App.tsx              # Main app component
└── index.css            # Global styles
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# EmailJS Configuration (for contact form)
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

### EmailJS Setup

1. Sign up at [EmailJS](https://www.emailjs.com/)
2. Create an email service (Gmail, Outlook, etc.)
3. Create an email template with variables:
   - `{{from_name}}` - Sender's name
   - `{{from_email}}` - Sender's email
   - `{{message}}` - Message content
4. Get your public key from the dashboard
5. Update the Contact component with your credentials

### Customization

#### Personal Information
Edit the following files to customize:

- `src/sections/Hero.tsx` - Name, tagline, social links
- `src/sections/About.tsx` - Bio, skills, stats
- `src/sections/Projects.tsx` - Project cards
- `src/sections/Services.tsx` - Services offered
- `src/sections/Testimonials.tsx` - Client testimonials
- `src/sections/Contact.tsx` - Contact information
- `src/sections/Footer.tsx` - Footer links

#### Colors & Theme
Edit `tailwind.config.js`:

```javascript
colors: {
  neon: {
    cyan: "#00f0ff",      // Primary accent
    purple: "#a855f7",    // Secondary accent
    pink: "#ff0080",      // Tertiary accent
  },
  // ...
}
```

#### 3D Settings
Edit `src/components/three/IcosahedronScene.tsx`:

```typescript
const COLORS = {
  start: new THREE.Color('#00f0ff'),  // Scroll start color
  middle: new THREE.Color('#a855f7'), // Scroll middle color
  end: new THREE.Color('#ff0080'),    // Scroll end color
};
```

## 🎨 Three.js Implementation Notes

### IcosahedronScene
The hero 3D scene uses a custom shader material for:
- **Vertex displacement** - Subtle wave animation on the mesh
- **Fresnel effect** - Edge glow for depth
- **Color transitions** - Smooth gradient shifts based on scroll progress
- **Mouse parallax** - Rotation follows cursor position

### ParticleBackground
Background particles feature:
- **Connection lines** - Particles connect when close
- **Mouse repulsion** - Gentle push away from cursor
- **Floating motion** - Continuous subtle movement
- **Performance optimization** - Reduced count on mobile

### TiltCard3D
Project cards use CSS 3D transforms:
- **Perspective** - 1000px for realistic depth
- **RotateX/Y** - Based on mouse position relative to card center
- **Glare effect** - Dynamic highlight following cursor
- **Glow border** - Animated gradient on hover

## 📱 Mobile Optimization

The portfolio automatically detects device capabilities and adjusts:

- **3D Complexity** - Reduced geometry detail on mobile
- **Particle Count** - Fewer particles for battery saving
- **Custom Cursor** - Disabled on touch devices
- **Animations** - Respects `prefers-reduced-motion`
- **Canvas Resolution** - Lower DPR on low-power devices

## 🚀 Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Or connect GitHub repository** for automatic deployments

### Netlify

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy `dist` folder** to Netlify

### GitHub Pages

1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add to package.json**
   ```json
   {
     "scripts": {
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Build and deploy**
   ```bash
   npm run build
   npm run deploy
   ```

## 🔧 Performance Tips

### Optimization Checklist

- [ ] Use `React.memo` for expensive components
- [ ] Lazy load below-fold sections
- [ ] Optimize images with WebP format
- [ ] Enable gzip compression on server
- [ ] Use CDN for static assets
- [ ] Implement proper cache headers

### Three.js Specific

- Dispose geometries/materials when unmounting
- Use `useFrame` sparingly - batch updates
- Reduce shadow quality on mobile
- Use texture compression (KTX2)
- Limit active lights to 3-4

## 🐛 Troubleshooting

### Common Issues

**3D not rendering**
- Check WebGL support: https://get.webgl.org/
- Verify Three.js version compatibility

**Scroll animations not working**
- Ensure GSAP ScrollTrigger is registered
- Check for conflicting CSS `overflow` properties

**Custom cursor visible on mobile**
- The cursor auto-hides on touch devices
- Check `useDeviceCapabilities` hook

**Build errors**
- Clear `node_modules` and reinstall
- Check TypeScript version compatibility

## 📚 Resources

### Documentation
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [Three.js](https://threejs.org/docs/)
- [GSAP](https://greensock.com/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)

### Learning
- [Three.js Journey](https://threejs-journey.com/) - Excellent 3D course
- [GSAP Learning Center](https://greensock.com/learning/)

## 📝 License

MIT License - feel free to use this portfolio as a template for your own projects!

## 🙏 Credits

- 3D Models & Effects - Three.js Community
- UI Components - shadcn/ui
- Icons - Lucide React
- Fonts - Google Fonts (Inter, Plus Jakarta Sans)

---

**Built with ❤️ by Alex**

If you found this portfolio helpful, please consider giving it a ⭐ on GitHub!
