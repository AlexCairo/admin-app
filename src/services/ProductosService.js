import {URL_API} from "../helpers/Config"
import axios from "axios";

export const listaProductos = async () => {
    const result = await axios.get(`${URL_API}/productos`);
    return result;
};

export const agregarProductos = async (datos) => {
    const result = await axios.post(`${URL_API}/productos`,datos);
    return result;
};

export const eliminarProductos = async (id) => {
    const result = await axios.delete(`${URL_API}/productos/${id}`);
    return result;
};

export const editarProductos = async (datos) => {
    const result = await axios.put(`${URL_API}/productos/${datos.id}`,datos);
    return result;
}
