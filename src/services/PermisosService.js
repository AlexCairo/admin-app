import {URL_API} from "../helpers/Config"
import axios from "axios";

export const listaPermisos = async () => {
    const result = await axios.get(`${URL_API}/permisos`);
    return result;
};
