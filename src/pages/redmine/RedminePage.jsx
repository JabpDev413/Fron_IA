import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./RedmineStyle.css";

/**Imports components */
import { DivComponent } from "../../components/DivComponent.jsx";
import { MessageInfo } from "../../helpers/MessageInfo.jsx";

/**Icones */
import { IoArrowBack, IoCheckmarkCircle } from "react-icons/io5";

/**Importando o serviço de API */
import { buscarSolicitacoesRedmine } from "./RedmineRepository.js";

export function RedminePage() {
  const navigate = useNavigate();
  const [solicitacoes, setSolicitacoes] = useState({
    chamados: [],
    total_chamados: 0,
  });

  /**
   * @param {{id:int, solicitante:string, status:string, total_dias:int, data:string}} chamado
   */

  async function navegarChat() {
    navigate("/chat");
  }

  useEffect(() => {
    const load = async () => {
      try {
        let solicitacoesResponse = await buscarSolicitacoesRedmine();
        setSolicitacoes(solicitacoesResponse);
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, []);

  function handleCheck(chamado) {
    toast.success(
      `Notificação enviada para o cliente sobre o fechamento da solicitação #${chamado.id}`,
    );
  }

  return (
    <>
      <MessageInfo />
      <IoArrowBack id="arrow-back" onClick={navegarChat} />
      <DivComponent className="div-red-cabecalho">
        {solicitacoes.chamados?.map((chamado) => (
          <DivComponent key={chamado.id} className="div-conatiner-item">
            <DivComponent className="div-id-data">
              <h3>{`# ${chamado.id}`}</h3>
              <p>{chamado.data}</p>
            </DivComponent>
            <p> {`Solicitante: ${chamado.solicitante}`} </p>

            <DivComponent className="div-status">
              <p>{`Total dias "${chamado.status}": ${chamado.total_dias}`}</p>
              <DivComponent
                className="div-check"
                onClick={() => handleCheck(chamado)}
              >
                <span className="texto-check">
                  Notificar ao cliente sobre fechamento da solicitação
                </span>
              </DivComponent>
            </DivComponent>
          </DivComponent>
        ))}
      </DivComponent>
    </>
  );
}
