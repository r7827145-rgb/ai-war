import { useEffect, useRef, useState } from "react";

const TOTAL_FRAMES = 120;
const FPS = 15;
const FRAME_INTERVAL = 1000 / FPS;

/**
 * Plays a sequence of JPG frames as a looping background "video" on a canvas.
 * Frames served from /hero-frames/001.jpg … 120.jpg
 */
export function HeroVideo({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loaded, setLoaded] = useState(false);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  useEffect(() => {
    let cancelled = false;
    const images: HTMLImageElement[] = [];
    let count = 0;

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = `/hero-frames/${String(i).padStart(3, "0")}.jpg`;
      img.onload = () => {
        count++;
        if (count === TOTAL_FRAMES && !cancelled) {
          imagesRef.current = images;
          setLoaded(true);
        }
      };
      images.push(img);
    }

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const images = imagesRef.current;
    let frame = 0;
    let animId: number;
    let lastTime = 0;

    // Size canvas to first frame
    const first = images[0];
    canvas.width = first.naturalWidth;
    canvas.height = first.naturalHeight;

    const tick = (time: number) => {
      if (time - lastTime >= FRAME_INTERVAL) {
        ctx.drawImage(images[frame], 0, 0);
        frame = (frame + 1) % images.length;
        lastTime = time;
      }
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(animId);
  }, [loaded]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block",
        opacity: loaded ? 1 : 0,
        transition: "opacity 0.6s ease",
      }}
    />
  );
}
