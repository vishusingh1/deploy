import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css';

// broken
import "./design/design.css";
import BuiltWithBrokenAtom from './utils/BuiltWithBroken.tsx';


// BRO-CODE.MAIN.TSX START
// BRO-CODE.MAIN.TSX END


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <BuiltWithBrokenAtom />
  </React.StrictMode>,
)
