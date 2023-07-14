import {URL_API} from "../helpers/Config"
import axios from "axios";

export const obtenerDashboard = async () => {
    const result = await axios.get(`${URL_API}/dashboard`);
    return result;
};
