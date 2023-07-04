// src/App.js
import Vizzu from "vizzu";
import VizzuModule from "vizzu/dist/cvizzu.wasm";
import { data } from "./demoData";
import { useRef, useEffect } from "react";

Vizzu.options({ wasmUrl: VizzuModule });

function App() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const chart = new Vizzu(canvasRef.current, { data });
    chart.initializing.then((chart) =>
      chart.animate({
        config: {
          channels: {
            y: { set: ["Popularity"] },
            x: { set: ["Genres"] },
          },
        },
      })
    );
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="myVizzu"
      style={{ width: "800px", height: "480px" }}
    />
  );
}

export default App;
