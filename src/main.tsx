import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import NotFound from './pages/NotFound.tsx'
import './index.css'
import './i18n'

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);
