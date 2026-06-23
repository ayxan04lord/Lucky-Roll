import confetti from 'canvas-confetti';

export function fireConfetti() {
  confetti({
    particleCount: 120,
    spread: 80,
    origin: { y: 0.6 },
    colors: ['#e94560', '#f5a623', '#7ed321', '#4a90e2', '#bd10e0'],
  });
}
