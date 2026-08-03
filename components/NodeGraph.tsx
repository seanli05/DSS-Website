"use client";

import { useEffect, useState } from "react";
import Particles, { ParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Engine, ISourceOptions } from "@tsparticles/engine";

// Module-level so every NodeGraph instance shares the exact same reference,
// satisfying ParticlesProvider's singleton stability check.
const initParticles = async (engine: Engine) => {
  await loadSlim(engine);
};

interface NodeGraphProps {
  id?: string;
  className?: string;
  opacity?: number;
}

const PARTICLE_CONFIG: ISourceOptions = {
  fpsLimit: 30,
  particles: {
    // Link rendering is O(n²) pairwise distance checks per frame — more particles
    // is the "more links, denser web" lever (not link distance, which just makes
    // the same links longer without adding more of them).
    number: { value: 44, density: { enable: true, width: 800 } },
    color: { value: "#ffffff" },
    shape: { type: "circle" },
    opacity: { value: 0.6 },
    size: { value: 3 },
    links: {
      enable: true,
      distance: 150,
      color: "#ffffff",
      opacity: 0.4,
      width: 1,
    },
    move: { enable: true, speed: 1.5, outModes: { default: "bounce" } },
  },
  interactivity: {
    events: {
      onHover: { enable: true, mode: "repulse" },
    },
    modes: {
      repulse: { distance: 120, duration: 0.4 },
    },
  },
  // false is intentional: on a Retina/HiDPI screen this canvas covers the entire hero, so
  // detectRetina would quadruple (2x²) the pixels the GPU has to raster/composite every frame
  // for background decoration that doesn't need pixel-sharp edges. This was the dominant cost
  // in a real trace (GPU compositor thread was blocked ~80ms/frame — a 3-8fps hero).
  detectRetina: false,
  fullScreen: { enable: false },
  resize: { enable: false, delay: 0 },
  // Stop the animation loop (and its CPU cost) once the hero scrolls out of view.
  pauseOnOutsideViewport: true,
};

export default function NodeGraph({ id = "tsparticles", className = "", opacity = 0.12 }: NodeGraphProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Mount-detection: defaults to false for SSR/hydration, then enables
    // client-side only if the user hasn't requested reduced motion.
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShow(true);
    }
  }, []);

  if (!show) return null;

  return (
    <ParticlesProvider init={initParticles}>
      <Particles
        id={id}
        className={className}
        style={{ opacity }}
        options={PARTICLE_CONFIG}
      />
    </ParticlesProvider>
  );
}
