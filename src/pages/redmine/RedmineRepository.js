import restClientAxios from "../../services/AxiosClient.js";

export async function buscarSolicitacoesRedmine() {
  try {
    const response = await restClientAxios.get("/n8n/redmine/solicitacoes");
    return response.data;
  } catch (error) {
    console.error(error.response.data);
    throw error.response.data;
  }
}
