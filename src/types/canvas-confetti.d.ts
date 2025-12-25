declare module "canvas-confetti" {
  interface ConfettiOptions {
    particleCount?: number;
    angle?: number;
    spread?: number;
    startVelocity?: number;
    decay?: number;
    gravity?: number;
    drift?: number;
    ticks?: number;
    origin?: {
      x?: number;
      y?: number;
    };
    colors?: string[];
    shapes?: ("square" | "circle")[];
    scalar?: number;
    zIndex?: number;
    disableForReducedMotion?: boolean;
  }

  interface CreateOptions {
    resize?: boolean;
    useWorker?: boolean;
  }

  type ConfettiFunction = (options?: ConfettiOptions) => Promise<null>;

  const confetti: ConfettiFunction & {
    create(
      canvas: HTMLCanvasElement,
      options?: CreateOptions
    ): ConfettiFunction;
    reset(): void;
  };

  export default confetti;
}
