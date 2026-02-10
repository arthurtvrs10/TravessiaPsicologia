"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";

type LogoItem = {
  name: string;
  src: string;
  width?: number;
  height?: number;
};

const CONVENIOS: LogoItem[] = [
  { name: "ANAFE Saúde", src: "/Convenios/anafe-saude.svg" },
  { name: "Câmara dos Deputados", src: "/Convenios/camara-deputados.svg" },
  { name: "Casa Embrapa", src: "/Convenios/casa-embrapa.svg" },
  { name: "Fascal", src: "/Convenios/fascal.svg" },
  { name: "PF Saúde", src: "/Convenios/pf-saude.svg" },
  { name: "Plan Assiste", src: "/Convenios/plan-assiste.svg" },
  { name: "PLAS JMU", src: "/Convenios/plas-jmu.svg" },
  { name: "Polícia Militar", src: "/Convenios/policia-militar.svg" },
  { name: "Pró-Saúde", src: "/Convenios/pro-saude.svg" },
  { name: "Pró-Social", src: "/Convenios/pro-social.svg" },
  { name: "SIS", src: "/Convenios/sis.svg" },
  { name: "STF Med", src: "/Convenios/stf-med.svg" },
  { name: "TRE Saúde", src: "/Convenios/tre-saude.svg" },
  { name: "TRT Saúde", src: "/Convenios/trt-saude.svg" },
  { name: "TST", src: "/Convenios/tst.svg" },
];

export default function ConveniosMarquee({
  speed = 35, // px/s
  height = 120,
}: {
  speed?: number;
  height?: number;
}) {
  const listRef = useRef<HTMLDivElement | null>(null);
  const [loopPx, setLoopPx] = useState(0);

  const logos = useMemo(() => CONVENIOS, []);

  const measure = () => {
    const el = listRef.current;
    if (!el) return;
    const w = el.scrollWidth;
    if (w > 0) setLoopPx(w);
  };

  // useLayoutEffect mede antes do paint (mais confiável pra layout)
  useLayoutEffect(() => {
    measure();

    // Re-mede no próximo frame (quando imagens/SVG já “assentaram”)
    const raf = requestAnimationFrame(measure);

    // Observa mudanças de tamanho (responsivo/zoom/reflow)
    const el = listRef.current;
    const ro = new ResizeObserver(() => measure());
    if (el) ro.observe(el);

    // Também re-mede quando a janela muda (zoom/resizes)
    const onResize = () => measure();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const duration = loopPx > 0 ? loopPx / speed : 20;

  return (
    <section
      className="w-full bg-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/40"
      aria-label="Convênios atendidos"
    >
      <div className="relative overflow-hidden border-y border-black/5">
        {/* Fade nas bordas */}
        <div className="pointer-events-none absolute inset-0 z-10">
          <div className="absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-white via-white/80 to-transparent" />
          <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-white via-white/80 to-transparent" />
        </div>

        <div className="relative" style={{ height }}>
          <div
            className="absolute left-0 top-0 flex h-full items-center gap-10 will-change-transform"
            style={{
              animation: loopPx ? `marqueePx ${duration}s linear infinite` : undefined,
              ["--loop-px" as any]: `${loopPx}px`,
            }}
          >
            {/* LISTA 1 (medida) */}
            <div ref={listRef} className="flex items-center gap-10 w-max">
              {logos.map((logo, idx) => (
                <div key={`a-${logo.name}-${idx}`} className="group flex items-center">
                  <div
                    className="opacity-60 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      animation: `logoFade 2.8s ease-in-out infinite`,
                      animationDelay: `${idx * 0.15}s`,
                    }}
                  >
                    {/* SVG: use <img> (mais estável pra marquee) */}
                    <img
                      src={logo.src}
                      alt={logo.name}
                      className="h-16 w-auto object-contain grayscale opacity-90 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100"
                      onLoad={measure}
                      draggable={false}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* LISTA 2 (cópia) */}
            <div className="flex items-center gap-10 w-max" aria-hidden="true">
              {logos.map((logo, idx) => (
                <div key={`b-${logo.name}-${idx}`} className="group flex items-center">
                  <div
                    className="opacity-60 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      animation: `logoFade 2.8s ease-in-out infinite`,
                      animationDelay: `${idx * 0.15}s`,
                    }}
                  >
                    <img
                      src={logo.src}
                      alt=""
                      className="h-16 w-auto object-contain grayscale opacity-90 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100"
                      draggable={false}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes marqueePx {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(var(--loop-px) * -1));
          }
        }

        @keyframes logoFade {
          0%,
          100% {
            opacity: 0.35;
            transform: translateY(0);
          }
          50% {
            opacity: 1;
            transform: translateY(-1px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .will-change-transform {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}
