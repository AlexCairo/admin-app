import {URL_API} from "../helpers/Config"
import axios from "axios";

export const eliminarCajas = async (id) => {
    const result = await axios.delete(`${URL_API}/cajas/${id}`);
    return result;
};