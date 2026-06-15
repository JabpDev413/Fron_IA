import "./chat.css";

import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

/**Imports Icones */
import { FaCode } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { IoChatbubbleOutline } from "react-icons/io5";
import { IoTrashOutline } from "react-icons/io5";
import { FaBars } from "react-icons/fa6";
import { IoSend } from "react-icons/io5";
import { BsThreeDotsVertical } from "react-icons/bs";

import ReactMarkdown from "react-markdown";

/**Imports components */
import { DivComponent } from "../../components/DivComponent.jsx";
import { ButtomComponent } from "../../components/ButtomComponent.jsx";
import { MessageInfo } from "../../helpers/MessageInfo.jsx";

/**Repositorio */
import {
  novaConversa,
  buscarConversas,
  buscarMensagensConversa,
} from "../chat/ChatRepository.js";
import {
  conectarWebSocket,
  enviarMessagem,
  desconectarWebSocket,
} from "../../services/Socket.js";

export function Chat() {
  const [selecionado, setSelecionado] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  let [message, setMessage] = useState({ mensagens: [] });
  const [conversaSelecionada, setConversaSelecionada] = useState({});
  const [input, setInput] = useState("");
  const [online, setOnline] = useState(false);
  const [loadingMensagem, setLoadingMensagem] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);

  let [conversas, setConversas] = useState([]);

  const endRef = useRef(null);

  const usuario = JSON.parse(sessionStorage.getItem("usuario"));

  const navigate = useNavigate();

  async function navegarRedmine() {
    navigate("/redmine");
  }

  /**
   * @param {{conversaId:int, usuaId:int, titulo:string, data:string, hora:string, messagens:[]}} conversa
   * @param {{msgId:int, msgTipo:string, msgConteudo:string, data:string, hora:string}} messagens
   */

  async function isSelecionado(conversa) {
    setInput("");
    if (conversa.conversaId === selecionado) {
      setSelecionado(null);
      setConversaSelecionada({
        conversaId: null,
        titulo: "Selecione uma conversa",
        messagens: [],
      });
      return;
    }
    let msgs = await buscarMensagensConversa(conversa.conversaId);

    setSelecionado(conversa.conversaId);
    setMessage(msgs);

    setConversas((prev) =>
      prev.map((c) =>
        c.conversaId === conversa.conversaId ? { ...c, messagens: msgs } : c,
      ),
    );
    setConversaSelecionada({
      ...conversa,
      messagens: msgs,
    });
  }

  function excluirConversa(id) {
    setConversas((prev) =>
      prev.filter((conversa) => conversa.conversaId !== id),
    );
  }

  async function criarConversa() {
    const nova = await novaConversa();

    setConversas((prev) => [nova, ...prev]);

    setSelecionado(nova.conversaId);
  }

  useEffect(() => {
    const load = async () => {
      try {
        let conver = await buscarConversas();
        setConversas(conver);
      } catch (err) {
        console.error(err);
      }
    };

    conectarWebSocket({
      onOpen: () => {
        console.error("Conectado");
      },

      onMessage: (conversa) => {
        if (conversa.conteudo === "Conectado") {
          setOnline(true);
          return;
        }

        setLoadingMensagem(true);

        console.log(
          "Mensagem chega: ",
          conversa.mensagens || conversa.conteudo,
        );

        const nova = conversa.messagens?.[0];

        setConversas((prev) =>
          prev.map((c) =>
            c.conversaId === conversa.conversaId
              ? {
                  ...c,
                  messagens: [...(c.messagens || []), nova],
                }
              : c,
          ),
        );
      },

      onClose: () => {
        setOnline(true);

        console.log("Socket fechado");
      },

      onError: (error) => {
        setOnline(true);
        console.log(error);
      },
    });

    load();

    return () => {
      setOnline(true);
      desconectarWebSocket();
    };
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [conversas, conversaSelecionada]);

  const handleSend = () => {
    if (!input.trim()) return;
    if (!conversaSelecionada.conversaId) {
      toast.error("Selecione uma conversa para enviar a mensagem.");
      return;
    }

    setLoadingMensagem(true);

    enviarMessagem({
      conversaId: conversaSelecionada.conversaId,
      tipo: "IA",
      conteudo: input,
    });

    const agora = new Date();

    const novaMensagem = {
      msgTipo: "USER",
      msgConteudo: input,

      data: agora.toLocaleDateString("pt-BR"),

      hora: agora.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),

      timestamp: Date.now(),
    };

    setConversas((prev) =>
      prev.map((conversa) => {
        if (conversa.conversaId === conversaSelecionada.conversaId) {
          return {
            ...conversa,

            messagens: [...(conversa.messagens || []), novaMensagem],
          };
        }

        return conversa;
      }),
    );
    setInput("");
  };

  // menu opcoes
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuAberto(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <MessageInfo />
      <DivComponent className="div-chat-page">
        {/**area menu */}
        <DivComponent className={`div-menu ${menuOpen ? "open" : ""}`}>
          <DivComponent className="div-titulo">
            <div id="div-ico">
              <FaCode className="ico-code" />
            </div>
            <DivComponent className="div-cabecalho">
              <h2 id="h2-titulo">
                Agente de IA
                <i
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    display: "inline-block",
                    marginLeft: "10px",
                    backgroundColor: online ? "#22c55e" : "#9ca3af",
                  }}
                ></i>
                <p
                  style={{
                    fontSize: "12px",
                    color: online ? "#22c55e" : "#9ca3af",
                    display: "inline-block",
                    paddingLeft: "5px",
                  }}
                >
                  {online ? "Online" : "Offline"}
                </p>
              </h2>
              <h3 id="h3-titulo">suporte e desenvolvimento</h3>
            </DivComponent>
          </DivComponent>
          <br />
          <ButtomComponent className="btn-nova-conv" onClick={criarConversa}>
            <FaPlus />
            Nova conversa
          </ButtomComponent>
          <br />
          <br />
          <h3 id="h3-conversas">Conversas</h3>
          {conversas.map((conversa) => (
            <DivComponent
              key={conversa.conversaId}
              className={`div-conversas ${selecionado === conversa.conversaId ? "active" : ""}`}
              onClick={() => isSelecionado(conversa)}
            >
              <IoChatbubbleOutline id="ico-msg" />

              <DivComponent className="div-p">
                <p id="p-titulo">{conversa.titulo}</p>
                <p id="p-dt-hr">
                  {conversa.data} - {conversa.hora}
                </p>
              </DivComponent>
              <IoTrashOutline
                id="ico-lixeira"
                onClick={(e) => {
                  e.stopPropagation();
                  excluirConversa(conversa.id);
                }}
              />
            </DivComponent>
          ))}

          <DivComponent className="div-foot">
            <p id="p-versao">V 1.0</p>
          </DivComponent>
        </DivComponent>

        <DivComponent className="div-chat">
          {/** area header chat */}
          <DivComponent
            className="div-chat-header"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <FaBars
              className="ico-menu-mobile"
              onClick={() => setMenuOpen(!menuOpen)}
            />
            <h2 id="h2-header-chat">{conversaSelecionada.titulo}</h2>
            <div ref={menuRef} style={{ position: "relative" }}>
              <BsThreeDotsVertical
                className={`${usuario.rol === "ADMIN" ? "btn-opcoes" : "btn-opcoes-disabled"}`}
                onClick={() => setMenuAberto(!menuAberto)}
              />

              {menuAberto && (
                <div className="menu-popup">
                  <div className="btn-redmine" onClick={navegarRedmine}>
                    Solicitações redmine mais 30 dias
                  </div>
                </div>
              )}
            </div>
          </DivComponent>
          {/** area chat content */}
          <DivComponent className="div-chat-content">
            {conversas
              .find((c) => c.conversaId === conversaSelecionada.conversaId)
              ?.messagens?.map((msg, index) => (
                <div
                  key={index}
                  className={`div-msg ${msg.msgTipo === "USER" ? "msg-user" : "msg-ia"}`}
                >
                  {msg.msgTipo === "USER" ? (
                    // Mensagem simples do usuário
                    msg.msgConteudo
                  ) : (
                    // Renderiza o Markdown da IA lindamente em tópicos e negritos
                    <ReactMarkdown>{msg.msgConteudo}</ReactMarkdown>
                  )}

                  {loadingMensagem && (
                    <div className="typing">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  )}
                </div>
              ))}
            <div ref={endRef}></div>
          </DivComponent>
          {/** area chat msg */}
          <DivComponent className="div-input-msg">
            <DivComponent className="input-wrapper">
              <textarea
                value={input}
                className={`${selecionado === null ? "input-msg-disabled" : "input-msg"}`}
                placeholder="Digite algo para começar"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();

                    handleSend();
                  }
                }}
                onChange={(e) => setInput(e.target.value)}
              />
              <ButtomComponent
                className={`${selecionado === null ? "btn-enviar-disabled" : "btn-enviar"}`}
                onClick={() => handleSend()}
              >
                <IoSend />
              </ButtomComponent>
            </DivComponent>
          </DivComponent>
        </DivComponent>
      </DivComponent>
    </>
  );
}
