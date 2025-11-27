import React, { useEffect, useRef } from 'react';

interface Bat {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  wingAngle: number;
  flapSpeed: number;
  scared: boolean;
  chaosTimer: number;
}

const FlyingBats: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const batsRef = useRef<Bat[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const initBats = () => {
      const batCount = window.innerWidth < 768 ? 15 : 40;
      const newBats: Bat[] = [];
      
      for (let i = 0; i < batCount; i++) {
        const scale = Math.random();
        // Massive bats: 80px to 250px wingspan
        const size = 80 + (scale * 170); 
        
        newBats.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 3,
          size: size,
          wingAngle: Math.random() * Math.PI * 2,
          flapSpeed: 0.03 + Math.random() * 0.08, // Slower flap for larger bats
          scared: false,
          chaosTimer: Math.random() * 100
        });
      }
      batsRef.current = newBats;
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (batsRef.current.length === 0) {
        initBats();
      }
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const drawBat = (bat: Bat) => {
      if (!ctx) return;

      // Opacity based on distance (size)
      // Large bats are darker and clearer, small ones fade into back
      const opacity = bat.scared ? 0.8 : 0.4 + (bat.size / 300);
      ctx.fillStyle = `rgba(15, 5, 5, ${opacity})`;
      
      ctx.save();
      ctx.translate(bat.x, bat.y);
      
      // Rotate slightly based on velocity for realism
      const angle = Math.atan2(bat.vy, bat.vx);
      // Smooth rotation dampening
      ctx.rotate(angle + Math.PI / 2); 

      ctx.beginPath();
      
      const wingSpan = bat.size;
      const wingHeight = Math.sin(bat.wingAngle) * (bat.size * 0.4);

      // Head
      ctx.arc(0, -bat.size * 0.1, bat.size * 0.08, 0, Math.PI * 2);
      
      // Ears (sharp)
      ctx.moveTo(-bat.size * 0.05, -bat.size * 0.15);
      ctx.lineTo(-bat.size * 0.08, -bat.size * 0.25);
      ctx.lineTo(0, -bat.size * 0.18);
      ctx.lineTo(bat.size * 0.08, -bat.size * 0.25);
      ctx.lineTo(bat.size * 0.05, -bat.size * 0.15);

      // Left Wing (Jagged, Gothic)
      ctx.moveTo(0, 0); // Shoulder
      // Top edge of wing
      ctx.quadraticCurveTo(
        -wingSpan * 0.5, -bat.size * 0.3 - wingHeight, // Control
        -wingSpan, -bat.size * 0.1 + wingHeight // Tip
      );
      // Scalloped bottom edge
      ctx.lineTo(-wingSpan * 0.7, bat.size * 0.2 + wingHeight);
      ctx.quadraticCurveTo(
        -wingSpan * 0.5, bat.size * 0.1 + wingHeight,
        -wingSpan * 0.4, bat.size * 0.3 + wingHeight
      );
      ctx.quadraticCurveTo(
        -wingSpan * 0.2, bat.size * 0.1 + wingHeight,
        0, bat.size * 0.4
      );

      // Right Wing (Mirror)
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(
        wingSpan * 0.5, -bat.size * 0.3 - wingHeight,
        wingSpan, -bat.size * 0.1 + wingHeight
      );
      ctx.lineTo(wingSpan * 0.7, bat.size * 0.2 + wingHeight);
      ctx.quadraticCurveTo(
        wingSpan * 0.5, bat.size * 0.1 + wingHeight,
        wingSpan * 0.4, bat.size * 0.3 + wingHeight
      );
      ctx.quadraticCurveTo(
        wingSpan * 0.2, bat.size * 0.1 + wingHeight,
        0, bat.size * 0.4
      );

      ctx.fill();
      
      // Glowing Eyes (if large enough)
      if (bat.size > 80) {
        ctx.fillStyle = 'rgba(220, 20, 20, 0.8)'; // Red eyes
        ctx.beginPath();
        ctx.arc(-bat.size * 0.03, -bat.size * 0.12, bat.size * 0.015, 0, Math.PI * 2);
        ctx.arc(bat.size * 0.03, -bat.size * 0.12, bat.size * 0.015, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    };

    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      batsRef.current.forEach(bat => {
        // Chaotic Movement Logic
        bat.chaosTimer++;
        if (!bat.scared && bat.chaosTimer > 50 + Math.random() * 100) {
           // Change direction randomly
           bat.vx += (Math.random() - 0.5) * 2;
           bat.vy += (Math.random() - 0.5) * 2;
           // Cap normal speed
           const speed = Math.sqrt(bat.vx*bat.vx + bat.vy*bat.vy);
           if (speed > 5) {
             bat.vx = (bat.vx / speed) * 5;
             bat.vy = (bat.vy / speed) * 5;
           }
           bat.chaosTimer = 0;
        }

        bat.x += bat.vx;
        bat.y += bat.vy;
        bat.wingAngle += bat.flapSpeed;

        if (bat.scared) {
            // Friction/Decay for scared speed
            bat.vx *= 0.98;
            bat.vy *= 0.98;
            bat.flapSpeed = 0.5; // Flap frantically
            
            // Resume normal after slowing down
            if (Math.abs(bat.vx) < 2 && Math.abs(bat.vy) < 2) {
                bat.scared = false;
                bat.flapSpeed = 0.03 + Math.random() * 0.08;
            }
        }

        // Boundary wrap
        const buffer = bat.size;
        if (bat.x < -buffer) bat.x = canvas.width + buffer;
        if (bat.x > canvas.width + buffer) bat.x = -buffer;
        if (bat.y < -buffer) bat.y = canvas.height + buffer;
        if (bat.y > canvas.height + buffer) bat.y = -buffer;

        drawBat(bat);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Global click handler to scare bats
    const handleGlobalClick = (e: MouseEvent) => {
        const mx = e.clientX;
        const my = e.clientY;

        batsRef.current.forEach(bat => {
            const dx = bat.x - mx;
            const dy = bat.y - my;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            // Hitbox is slightly larger than the bat for easier clicking
            if (dist < bat.size * 1.5) {
                bat.scared = true;
                // Explode away from cursor
                const angle = Math.atan2(dy, dx);
                const force = 15 + Math.random() * 10;
                bat.vx = Math.cos(angle) * force;
                bat.vy = Math.sin(angle) * force;
            }
        });
    };

    window.addEventListener('mousedown', handleGlobalClick);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousedown', handleGlobalClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-20"
    />
  );
};

export default FlyingBats;