import {URL_API} from "../helpers/Config"
import axios from "axios";

export const listaRoles = async () => {
    const result = await axios.get(`${URL_API}/roles`);
    return result;
};
