import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Login } from "./pages/login/Login.jsx";
import { Chat } from "./pages/chat/chat.jsx";
import { RedminePage } from "./pages/redmine/RedminePage.jsx";
import { App } from "./pages/app/App.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<Login />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/redmine" element={<RedminePage />} />
    </Routes>
  </BrowserRouter>,
);
