// src/App.js
import Vizzu from "vizzu";
import VizzuModule from 'vizzu/dist/cvizzu.wasm';
import { data } from "./demoData";

Vizzu.options({ wasmUrl: VizzuModule });

function App() {
  const chart = new Vizzu("myVizzu", { data });
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
  return <canvas id="myVizzu" style={{ width: "800px", height: "480px" }} />;
}

export default App;