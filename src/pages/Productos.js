import React, { useState, useEffect } from "react";
import { listaProductos, agregarProductos, eliminarProductos } from "../services/ProductosService";
import { listaMarcas } from "../services/MarcasService"; 
import { listaMedidas } from "../services/MedidasService";
import { listaCategorias } from "../services/CategoriasService";
import { Input, Textarea, Select, Option, Button, Dialog, ButtonGroup } from "@material-tailwind/react";
import { BiExport } from "react-icons/bi"
import { FiEdit2, FiTrash2 } from "react-icons/fi"

const Productos = () => {
    const [productos, setProductos] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [marcas, setMarcas] = useState([]);
    const [medidas, setMedidas] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [productosPorPagina] = useState(5);
    const [buscarProducto, setBuscarProducto] = useState("");

    const handleOpen = () => setOpenModal((cur) => !cur);

    const listarProductos = async() => {
        const result = await listaProductos();
        setProductos(result.data);
    };
    const handleDeleteProduct = async(id) => {
        await eliminarProductos(id);
        const nLista = productos.filter(elem => elem.id !== id);
        setProductos(nLista);
    }
    const listarMedidas = async() => {
        const result = await listaMedidas();
        setMedidas(result.data);
    };
    const listarMarcas = async() => {
        const result = await listaMarcas();
        setMarcas(result.data);
    };
    const listarCategorias = async() => {
        const result = await listaCategorias();
        setCategorias(result.data);
    }

    useEffect(()=>{
        listarProductos();
        listarMarcas();
        listarMedidas();
        listarCategorias();
    },[])

    return(
        <section className="h-full">
            <React.Fragment>
                <div className="w-full bg-[#131422] p-4 rounded-xl flex justify-between">
                    <Button onClick={handleOpen} className="rounded-full font-bold text-2xl">+</Button>
                    <Button ripple="true" className="bg-white text-purple-500 duration-300 shadow-none hover:shadow-none hover:bg-purple-800 hover:text-white"><BiExport className="text-2xl" /></Button>
                </div>
                <Dialog size="lg" open={openModal} handler={handleOpen} className="bg-transparent shadow-none">
                    <form className="grid grid-cols-3 gap-6 bg-white p-4 rounded-xl">
                        <h2 className="col-span-3 text-center font-medium text-3xl text-[#131422]">Nuevo Producto</h2>
                        <div className="rounded-xl h-12">
                            <Input color="indigo" size="lg" label="Nombre" />
                        </div>
                        <div className="rounded-xl h-12 row-span-2">
                            <Textarea color="indigo" size="lg" label="Descripción" />
                        </div>
                        <div className="rounded-xl h-12">
                            <Select label="Medidas">
                                {medidas.map((medida)=>(
                                    <Option key={medida.id}>{medida.nombre}</Option>
                                ))}
                            </Select>
                        </div>
                        <div className="rounded-xl h-12">
                            <Select label="Marca">
                                {marcas.map((marca)=>(
                                    <Option key={marca.id}>{marca.nombre}</Option>
                                ))}
                            </Select>
                        </div>
                        <div className="rounded-xl h-12">
                            <Input disabled color="indigo" size="lg" label="Imagen" />
                        </div>
                        <div className="rounded-xl h-12">
                            <Input color="indigo" size="lg" label="Precio de Venta" />
                        </div>
                        <div className="rounded-xl h-12">
                            <Select label="Categorías">
                                {categorias.map((categoria)=>(
                                    <Option key={categoria.id}>{categoria.nombre}</Option>
                                ))}
                            </Select>
                        </div>
                    </form>
                </Dialog>
            </React.Fragment>
            <table className="table-auto rounded-xl col-span-3 bg-white w-full mt-4">
                <thead>
                    <tr className="text-center [&>th]:p-2 bg-[#131422] text-white">
                        <th className="rounded-s">Nombre</th>
                        <th>Categoria</th>
                        <th>Marca</th>
                        <th>Medida</th>
                        <th>Cantidad</th>
                        <th>Precio</th>
                        <th className="rounded-e"></th>
                    </tr>
                </thead>
                <tbody>
                    {productos.map((producto) => (
                        <tr key={producto.id} className="[&>td]:p-2">
                            <td>{producto.nombre}</td>
                            <td className="text-center">{producto.categoria.nombre}</td>
                            <td className="text-center">{producto.marca.nombre}</td>
                            <td className="text-center">{producto.medida.nombre}</td>
                            <td className="text-center">{producto.stock}</td>
                            <td className="text-center">S/{producto.precioVenta}</td> 
                            <td className="flex justify-center">
                                <ButtonGroup variant="outlined" className="text-center [&>Button]:text-base">
                                    <Button className="border duration-300 border-green-300 text-green-300 hover:bg-green-300 hover:text-white"><FiEdit2/></Button>
                                    <Button onClick={()=>handleDeleteProduct(producto.id)} className="border duration-300 border-red-300  text-red-300 hover:bg-red-300 hover:text-white"><FiTrash2/></Button>                                
                                </ButtonGroup>      
                            </td>                        
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>

            </div>
        </section>
    )
}

export default Productos;