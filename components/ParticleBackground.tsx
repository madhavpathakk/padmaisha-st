"use client";
import { useEffect } from "react";
import Particles from "@tsparticles/react";
import { initParticlesEngine } from "@tsparticles/react";

export default function ParticleBackground() {
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      // You can add custom shapes or presets here if needed
    });
  }, []);

  return (
    <Particles
      id="tsparticles"
      options={{
        fullScreen: { enable: false },
        background: { color: { value: "#f9fafb" } },
        particles: {
          number: { value: 40, density: { enable: true } },
          color: { value: ["#a7c7e7", "#f7cac9", "#ffe5b4", "#b2dfdb"] },
          opacity: { value: 0.3 },
          size: { value: 3 },
          move: { direction: "none", enable: true, outModes: { default: "out" }, speed: 0.6 },
          links: { enable: false },
        },
        detectRetina: true,
      }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
