import { useEffect, useRef } from "react";

export function useOnDraw(onDraw) {

  // Refs
  const canvasRef = useRef(null)
  const isDrawingRef = useRef(false)

  // To clean up all the addEventListeners
  const mouseMoveListenerRef = useRef(null);
  const mouseDownListenerRef = useRef(null);
  const mouseUpListenerRef = useRef(null);

  // to fill the gap between the mouse triggering points
  const prevPointRef = useRef(null)

  // windows dom nodes lives longer than instance of a componenet, so we need to remove the mousemove and mouseup event whenever component is unmounted
  // to unmount a componenet we use useEffect hook
  useEffect(() => {
    return () => {
      // if (mouseMoveListenerRef.current) { window.removeEventListener('mousemove', mouseMoveListenerRef.current) }
      // if (mouseUpListenerRef.current) { window.removeEventListener('mouseup', mouseUpListenerRef.current) }
    }
  }, [])

  function setCanvasRef(ref) {
    if (!ref) return;
    // if (canvasRef.current) { canvasRef.current.removeEventListener('mousedown', mouseDownListenerRef.current) }
    canvasRef.current = ref
    initMouseMoveListener();
    initMouseDownListener();
    initMouseUpListener();
  }

  function initMouseMoveListener() {
    const mouseMoveListener = (e) => {
      // to draw when the mouse is clicked
      if (isDrawingRef.current) {
        const point = computePointInCanvas(e.clientX, e.clientY) // to get cursor value wrt to canvas
        const ctx = canvasRef.current.getContext('2d')
        if (onDraw) onDraw(ctx, point, prevPointRef.current)
        prevPointRef.current = point
      }
    }
    mouseMoveListenerRef.current = mouseMoveListener // used later in removeEventListener
    window.addEventListener('mousemove', mouseMoveListener) //to get cursor value wrt to window 
  }

  // function to detect mouse left button press
  function initMouseDownListener() {
    if (!canvasRef.current) return
    // this function will be called whenever user press down left mouse button
    const listener = () => {
      isDrawingRef.current = true;
    }
    mouseDownListenerRef.current = listener
    canvasRef.current.addEventListener("mousedown", listener)
  }

  // function to detect mouse left button release
  function initMouseUpListener() {
    if (!canvasRef.current) return
    const listener = () => {
      isDrawingRef.current = false
      prevPointRef.current = null
    }
    mouseUpListenerRef.current = listener
    window.addEventListener('mouseup', listener)
  }

  // function to get mouse x and y wrt to canvas
  function computePointInCanvas(clientX, clientY) {
    if (canvasRef.current) {
      const boundingRect = canvasRef.current.getBoundingClientRect();
      return {
        x: clientX - boundingRect.left,
        y: clientY - boundingRect.top
      }
    } else {
      return null;
    }
  }

  return setCanvasRef
}