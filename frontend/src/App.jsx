import React, { useState } from "react";
import "./App.css";

function App() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [result, setResult] = useState(null);

  const handleAdd = () => {
    if (window.add) {
      setResult(window.add(Number(a), Number(b)));
    } else {
      setResult("WASM not loaded");
    }
  };

  return (
    <div style={{ padding: 32 }}>
      <h1>React + TinyGo WASM Example</h1>
      <input
        type="number"
        value={a}
        onChange={(e) => setA(e.target.value)}
      />
      <span> + </span>
      <input
        type="number"
        value={b}
        onChange={(e) => setB(e.target.value)}
      />
      <button onClick={handleAdd}>Add (via WASM)</button>
      <div style={{ marginTop: 16 }}>
        Result: {result !== null ? result : "-"}
      </div>
    </div>
  );
}

export default App;
