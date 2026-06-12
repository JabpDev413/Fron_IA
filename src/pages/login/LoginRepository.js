import restClientAxios from "../../services/AxiosClient.js";

export async function loginRepository(usuario, senha) {
  try {
    const response = await restClientAxios.post("/auth", {
      usuario,
      senha,
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao realizar login: ", error.response.data.message);
    throw error;
  }
}
