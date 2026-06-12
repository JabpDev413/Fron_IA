import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export function App() {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const validarToken = async () => {
      !token ? navigate("/login") : navigate("/chat");
    };

    validarToken();
  }, []);

  return <></>;
}
