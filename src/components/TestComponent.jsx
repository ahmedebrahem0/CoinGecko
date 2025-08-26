import React from "react";

const TestComponent = () => {
  return (
    <div className="p-8 space-y-4">
      <h1 className="text-3xl font-bold text-gradient">Test Component</h1>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">CSS Variables Test</h2>
        <p>This component tests if CSS variables are working correctly.</p>
      </div>

      <div className="flex gap-4">
        <button className="btn-primary">Primary Button</button>
        <button className="btn-secondary">Secondary Button</button>
      </div>

      <input
        type="text"
        placeholder="Test input field"
        className="input-field w-full max-w-md"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card hover-lift">
          <h3 className="font-semibold mb-2">Hover Lift Effect</h3>
          <p>This card should lift on hover</p>
        </div>

        <div className="card hover-scale">
          <h3 className="font-semibold mb-2">Hover Scale Effect</h3>
          <p>This card should scale on hover</p>
        </div>

        <div className="card hover-glow">
          <h3 className="font-semibold mb-2">Hover Glow Effect</h3>
          <p>This card should glow on hover</p>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        <div className="animate-pulse bg-blue-500 w-8 h-8 rounded-full"></div>
        <div className="animate-bounce bg-green-500 w-8 h-8 rounded-full"></div>
      </div>
    </div>
  );
};

export default TestComponent;






