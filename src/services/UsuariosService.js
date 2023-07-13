import {URL_API} from "../helpers/Config"
import axios from "axios";

export const listaUsuarios = async () => {
    const result = await axios.get(`${URL_API}/users`);
    return result;
};
