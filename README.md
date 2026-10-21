# ✦ Siva Sujith Reddy — Luxury Interactive Portfolio

An award-winning, luxury interactive portfolio featuring an ultra-smooth, 60 FPS zero-ghosting, circular cursor-tracking character animation and refined aesthetic design.

![Portfolio Preview](public/frames/frame_00.webp)

---

## ✨ Key Features

- **60 FPS Zero-Ghosting Canvas Renderer**: Pre-extracted 64 WebP directional frames mapped dynamically to cursor angles via `Math.atan2(dy, dx)`. Renders exactly one crisp frame per render loop with no overlapping double-face artifacts.
- **Shortest-Path Angular Lerp**: Fast response factor (~0.26) providing instant, buttery-smooth cursor tracking (~35ms reaction time).
- **Direct Eye-Contact Deadzone**: When the cursor enters the character's facial region (~12% screen radius), smoothly locks into direct eye contact with the visitor.
- **Seamless Color Grading**: Mathematically harmonized palette (Warm Sand `#dfd2c1`, Rich Espresso `#2d2422`, Deep Pine `#1a2e35`, and Soft Ivory `#f4f0ec`).
- **Interactive UI & Motion**:
  - Floating frosted-glass navigation pill with `backdrop-filter: blur(20px)`.
  - Magnetic trailing cursor with scale interaction.
  - Smooth section transitions & scroll reveals powered by Framer Motion.
  - Integrated downloadable resume and responsive contact links.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Media Preprocessing**: Python (`OpenCV`, `NumPy`, `Pillow`)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or newer recommended)
- npm or yarn / pnpm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/<your-username>/<your-repo-name>.git
   cd <your-repo-name>
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Build for production:**
   ```bash
   npm run build
   ```
   The production-ready assets will be generated in `dist/`.

---

## 🌐 Deployment

This project is optimized for 1-click deployment on **[Vercel](https://vercel.com)** or **[Netlify](https://netlify.com)**:

1. Import your GitHub repository into Vercel or Netlify.
2. Build Command: `npm run build`
3. Output Directory: `dist`
4. Click **Deploy**!

---

## 📄 License

Created by **Siva Sujith Reddy Banda**. All rights reserved.
