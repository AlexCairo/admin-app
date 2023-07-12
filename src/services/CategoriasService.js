import {URL_API} from "../helpers/Config"
import axios from "axios";

export const listaCategorias = async () => {
    const result = await axios.get(`${URL_API}/categorias`);
    return result;
};
