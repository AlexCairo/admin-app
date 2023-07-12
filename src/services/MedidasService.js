import {URL_API} from "../helpers/Config"
import axios from "axios";

export const listaMedidas = async () => {
    const result = await axios.get(`${URL_API}/medidas`);
    return result;
};
