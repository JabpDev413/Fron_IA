import "../login/Login.css";
import minhaImagem from "../../assets/hsgcoop.png";
import { MessageInfo } from "../../helpers/MessageInfo.jsx";
import { ImageComponent } from "../../components/ImageComponent.jsx";
import { InputComponent } from "../../components/InputComponent.jsx";
import { ButtomComponent } from "../../components/ButtomComponent.jsx";
import { loginRepository } from "../login/LoginRepository.js";

import { FaRightToBracket } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export function Login() {
  const navigate = useNavigate();
  async function handleLogin(event) {
    event.preventDefault();
    try {
      const usuario = event.target.usuario.value;
      const senha = event.target.senha.value;

      const usuarioLogin = await loginRepository(usuario, senha);

      sessionStorage.setItem("token", usuarioLogin.token);
      sessionStorage.setItem("usuario", JSON.stringify(usuarioLogin));

      if (usuarioLogin.token.length > 0) {
        navigate("/chat");
      }
    } catch (error) {
      console.log("erro api: " + error.response);
      throw toast.error(
        error.response?.data?.message || "Error ao realizar login",
      );
    }
  }
  return (
    <>
      <MessageInfo />
      <div className="div-login">
        <div className="div-form-login">
          <ImageComponent minhaImagem={minhaImagem} className="image-form" />
          <form className="formulario-login" onSubmit={handleLogin}>
            <InputComponent
              className="input-login"
              placeholder="Usuário Redmine"
              name="usuario"
            />
            <br />
            <InputComponent
              className="input-login"
              placeholder="Senha Redmine"
              name="senha"
              type="password"
            />
            <br />
            <ButtomComponent className="buttom-login" type="submit">
              Entrar
              <FaRightToBracket />
            </ButtomComponent>
          </form>
        </div>
      </div>
    </>
  );
}
