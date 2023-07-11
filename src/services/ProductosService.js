import {URL_API} from "../helpers/Config"
import axios from "axios";

export const listaProductos = async () => {
    const result = await axios.get(`${URL_API}/productos`);
    return result;
};
