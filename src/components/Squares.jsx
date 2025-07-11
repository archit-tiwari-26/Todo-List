import { useRef, useEffect } from "react";

const Squares = ({
  direction = "diagonal",
  speed = 0.15,
  borderColor = "#31224f",
  squareSize = 40,
  hoverFillColor = "rgba(255, 255, 255, 0.07)", // subtle white glow
}) => {
  const canvasRef = useRef(null);
  const requestRef = useRef(null);
  const gridOffset = useRef({ x: 0, y: 0 });
  const hoveredSquareRef = useRef(null);
  const clickedSquaresRef = useRef([]); // To track click animations

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const drawGrid = () => {
      if (!ctx) return;

      ctx.fillStyle = "#0d081c";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize;
      const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize;

      const now = Date.now();
      clickedSquaresRef.current = clickedSquaresRef.current.filter((c) => now - c.timestamp < 300);

      for (let x = startX; x < canvas.width + squareSize; x += squareSize) {
        for (let y = startY; y < canvas.height + squareSize; y += squareSize) {
          const squareX = x - (gridOffset.current.x % squareSize);
          const squareY = y - (gridOffset.current.y % squareSize);

          // Hover effect with glow
          if (
            hoveredSquareRef.current &&
            Math.floor((x - startX) / squareSize) === hoveredSquareRef.current.x &&
            Math.floor((y - startY) / squareSize) === hoveredSquareRef.current.y
          ) {
            ctx.shadowColor = "rgba(255, 255, 255, 0.4)";
            ctx.shadowBlur = 10;
            ctx.fillStyle = hoverFillColor;
            ctx.fillRect(squareX, squareY, squareSize, squareSize);
            ctx.shadowBlur = 0;
          }

          // Click animation
          clickedSquaresRef.current.forEach((clicked) => {
            if (
              Math.floor((x - startX) / squareSize) === clicked.x &&
              Math.floor((y - startY) / squareSize) === clicked.y
            ) {
              const elapsed = now - clicked.timestamp;
              const alpha = 1 - elapsed / 300;
              ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.2})`;
              ctx.fillRect(squareX, squareY, squareSize, squareSize);
            }
          });

          ctx.strokeStyle = borderColor;
          ctx.lineWidth = 1;
          ctx.strokeRect(squareX, squareY, squareSize, squareSize);
        }
      }
    };

    const updateAnimation = () => {
      const effectiveSpeed = Math.max(speed, 0.05);

      if (direction === "diagonal") {
        gridOffset.current.x = (gridOffset.current.x - effectiveSpeed + squareSize) % squareSize;
        gridOffset.current.y = (gridOffset.current.y - effectiveSpeed + squareSize) % squareSize;
      }

      drawGrid();
      requestRef.current = requestAnimationFrame(updateAnimation);
    };

    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize;
      const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize;

      const hoveredX = Math.floor((mouseX + gridOffset.current.x - startX) / squareSize);
      const hoveredY = Math.floor((mouseY + gridOffset.current.y - startY) / squareSize);

      hoveredSquareRef.current = { x: hoveredX, y: hoveredY };
    };

    const handleMouseLeave = () => {
      hoveredSquareRef.current = null;
    };

    const handleClick = (event) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize;
      const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize;

      const clickedX = Math.floor((mouseX + gridOffset.current.x - startX) / squareSize);
      const clickedY = Math.floor((mouseY + gridOffset.current.y - startY) / squareSize);

      clickedSquaresRef.current.push({ x: clickedX, y: clickedY, timestamp: Date.now() });
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener("click", handleClick);
    requestRef.current = requestAnimationFrame(updateAnimation);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener("click", handleClick);
    };
  }, [direction, speed, borderColor, hoverFillColor, squareSize]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full fixed top-0 left-0 z-[-1] pointer-events-none rounded-xl text-white"
      style={{ background: "#0d081c", color: "white" }}
    />
  );
};

export default Squares;
