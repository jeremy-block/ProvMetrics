// src/App.js
import Vizzu from "vizzu";
import VizzuModule from "vizzu/dist/cvizzu.wasm";
import { data } from "./demoData";
import { useRef, useEffect, useState } from "react";

// Set the WebAssembly module URL for Vizzu
Vizzu.options({ wasmUrl: VizzuModule });

function App() {
  const canvasRef = useRef(null); // Reference to the canvas element for rendering the chart
  const chartRef = useRef(null); // Reference to the Vizzu chart instance
  const [xDimensionState, setXDimensionState] = useState(); // State to hold the selected X dimension

  // Extract dimensions from the data series
  const dimensions = data.series
    .filter((s) => s.type === "dimension")
    .map((s) => s.name);

  // Trigger chart animation when X dimension state changes
  useEffect(() => {
    if (!chartRef.current) return; // If chart instance doesn't exist, return
    chartRef.current.animate({
      config: { channels: { x: { set: [xDimensionState] } } },
    });
  }, [xDimensionState]);

  // Create and initialize the chart instance
  useEffect(() => {
    if (chartRef.current) return; // If chart instance already exists, return (for Hot Module Replacement)
    chartRef.current = new Vizzu(canvasRef.current, { data });
    chartRef.current.initializing.then((chart) =>
      chart.animate({
        config: {
          channels: {
            y: { set: ["Popularity"] }, // Set the Y channel to "Popularity"
            x: { set: ["Genres"] }, // Set the X channel to "Genres"
          },
        },
      })
    );
  }, []);

  return (
    <div id="wrapper">
      <canvas ref={canvasRef} style={{ width: "800px", height: "480px" }} />{" "}
      {/* Canvas element for rendering the chart */}
      <div id="breakdownChooser">
        <h2>Break it down by</h2>
        {dimensions.map((dim) => {
          return (
            <button
              onClick={() => {
                setXDimensionState(dim); // Update the X dimension state on button click
              }}
              key={dim}
            >
              {dim}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default App;
