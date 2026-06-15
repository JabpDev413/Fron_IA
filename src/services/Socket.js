let socket = null;
const urlSocket = "wss://api-ia-1-ax16.onrender.com";
const urlSocketLocal = "ws://172.16.251.22:9191";

export function conectarWebSocket({ onMessage, onOpen, onClose, onError }) {
  const token = sessionStorage.getItem("token");
  socket = new WebSocket(`wss://${urlSocket}/api/messages?token=${token}`);

  socket.onopen = () => {
    console.log("WebSocket conectado");

    if (onOpen) {
      onOpen();
    }
  };

  socket.onmessage = (event) => {
    try {
      const body = JSON.parse(event.data);
      console.log("RAW WS:", event.data);
      console.log("RAW body:", body);
      if (onMessage) {
        onMessage(body);
      }
    } catch {
      if (onMessage) {
        onMessage(event.data);
      }
    }
  };

  socket.onclose = () => {
    console.log("WebSocket desconectado");
    setTimeout(() => {
      conectarWebSocket({
        onOpen,
        onMessage,
        onClose,
        onError,
      });
    }, 2000);

    // if (onClose) {
    //   onClose();
    // }
  };

  socket.onerror = (error) => {
    console.log("Erro WebSocket: ", error);

    if (onError) {
      onError(error);
    }
  };
}

export function enviarMessagem(data) {
  if (!socket) return;

  socket.send(JSON.stringify(data));
}

export function desconectarWebSocket() {
  if (!socket) return;

  socket.close();
}
