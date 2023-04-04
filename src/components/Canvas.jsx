import React from "react";
import { useOnDraw } from "./Hooks";

const Canvas = ({ width, height }) => {
  const setCanvasRef = useOnDraw(onDraw);

  // This function is executed when ever we move our mouse
  function onDraw(ctx, point, prevPoint) {
    //Fot line
    drawLine(prevPoint, point, ctx, "#000000", 5);
  }

  // function to draw line b/w two mouse triggering points
  function drawLine(start, end, ctx, color, width) {
    start = start ?? end;
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(start.x, start.y, 2, 0, 2 * Math.PI);
    ctx.fill();
  }

  return (
    <canvas
      width={width}
      height={height}
      style={canvasStyle}
      ref={setCanvasRef}
    />
  );
};

export default Canvas;

const canvasStyle = {
  border: "1px solid black",
};
