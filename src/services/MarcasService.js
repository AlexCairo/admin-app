import {URL_API} from "../helpers/Config"
import axios from "axios";

export const listaMarcas = async () => {
    const result = await axios.get(`${URL_API}/marcas`);
    return result;
}