import axios from "axios";
import { useNavigate } from "react-router-dom";

// export function ImageBaseURL() {
//   return "http://172.16.251.22:9090/api/uploads";
// }

export const ImageBaseUrl = "http://172.16.251.22:9191/api/uploads";

const urlRender = "https://apiia-gcpapikey.up.railway.app/api";
const urlLocal = "http://172.16.251.22:9191/api";

const restClientAxios = axios.create({
  baseURL: urlRender,
});

restClientAxios.interceptors.request.use((config) => {
  let token = sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

restClientAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    const navigate = useNavigate();
    if (
      (error.response && error.response.status === 401) ||
      (error.response && error.response.status === 403)
    ) {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("usuario");
      navigate("/login");
    }
    return Promise.reject(error);
  },
);

export default restClientAxios;
