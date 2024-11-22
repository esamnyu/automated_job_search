import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

console.log('main.jsx is starting execution');

const rootElement = document.getElementById('root');
console.log('Root element found:', rootElement);

if (!rootElement) {
  throw new Error('Root element not found! Check your index.html');
}

// Create root before any rendering attempt
const root = ReactDOM.createRoot(rootElement);

// Add error boundary around the render
try {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('App rendered successfully');
} catch (error) {
  console.error('Error during render:', error);
  
  // Attempt to render error message to DOM
  rootElement.innerHTML = `
    <div style="color: red; padding: 20px;">
      <h1>Error Starting App</h1>
      <pre>${error.message}</pre>
    </div>
  `;
}