import restClientAxios from "../../services/AxiosClient.js";

export async function novaConversa() {
  try {
    const response = await restClientAxios.post("/conversa/nova");
    return response.data;
  } catch (error) {
    console.error(error.response.data);
    throw error.response.data;
  }
}

export async function buscarConversas() {
  try {
    const response = await restClientAxios.get("/conversa/buscar");
    return response.data;
  } catch (error) {
    console.error(error.response.data);
    throw error.response.data;
  }
}

export async function buscarMensagensConversa(conversaId) {
  try {
    const response = await restClientAxios.get(`/conversa/${conversaId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}
