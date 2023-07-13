import React, { useState, useEffect } from "react";
import { listaProductos, agregarProductos, eliminarProductos } from "../services/ProductosService";
import { listaMarcas } from "../services/MarcasService"; 
import { listaMedidas } from "../services/MedidasService";
import { listaCategorias } from "../services/CategoriasService";
import { Input, Textarea, Button, Dialog, ButtonGroup } from "@material-tailwind/react";
import { BiExport } from "react-icons/bi"
import { FaRegSave } from "react-icons/fa"
import { FiEdit2, FiTrash2 } from "react-icons/fi"
import Pagination from "../components/Pagination";

const initValues = {
    id : 0,
    nombre : "",
    descripcion : "",
    marca_id : 0,
    medida_id : 0,
    categoria_id : 0,
    precioVenta : 0,
}

const Productos = () => {
    const [productos, setProductos] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [marcas, setMarcas] = useState([]);
    const [medidas, setMedidas] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [productsPerPage, setProductsPerPage] = useState(6);
    const [currentPage, setCurrentPage] = useState(1);
    const [nuevoProducto, setNuevoProducto] = useState(initValues);

    const lastProductIndex = currentPage * productsPerPage;
    const firstPostIndex = lastProductIndex - productsPerPage;
    const currentProducts = productos.slice(firstPostIndex, lastProductIndex);

    const handleOpen = () => setOpenModal((cur) => !cur);

    const listarProductos = async() => {
        const result = await listaProductos();
        setProductos(result.data);
    };
    const handleDeleteProduct = async(id) => {
        await eliminarProductos(id);
        const nLista = productos.filter(elem => elem.id !== id);
        setProductos(nLista);
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        const nDatos = { ...nuevoProducto, [name]: value };
        setNuevoProducto(nDatos);
    }
    const handleSubmit = async(e) => {
        nuevoProducto.categoria_id = parseInt(nuevoProducto.categoria_id);
        nuevoProducto.marca_id = parseInt(nuevoProducto.marca_id);
        nuevoProducto.medida_id = parseInt(nuevoProducto.medida_id);
        nuevoProducto.precioVenta = parseFloat(nuevoProducto.precioVenta);
        await agregarProductos(nuevoProducto);
        listarProductos();
        handleOpen();
    };
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
                    <Button ripple={true} className="bg-white text-purple-500 duration-300 shadow-none hover:shadow-none hover:bg-purple-800 hover:text-white"><BiExport className="text-2xl" /></Button>
                </div>
                <Dialog size="lg" open={openModal} handler={handleOpen} className="bg-transparent shadow-none">
                    <form className="grid grid-cols-3 gap-6 bg-white p-4 rounded-xl">
                        <h2 className="col-span-3 bg-[#131422] rounded-xl p-2 text-center font-medium text-3xl text-white">Nuevo Producto</h2>
                        <div className="rounded-xl h-12">
                            <Input onChange={handleChange} size="lg" color="indigo" label="Nombre" name="nombre" />
                        </div>
                        <div className="rounded-xl h-12 row-span-2">
                            <Textarea onChange={handleChange} name="descripcion" color="indigo" size="lg" label="Descripción" />
                        </div>
                        <div className="h-12 text-center rounded-md p-3 bg-gray-100">
                            <label>Medidas</label>
                            <select name="medida_id" className="border border-gray-400 ml-4 w-52 rounded-md text-center" onChange={handleChange}>
                                {medidas.map((medida)=>(
                                    <option value={medida.id} key={medida.id}>{medida.nombre}</option>
                                ))}
                            </select>
                        </div>
                        <div className="h-12 text-center rounded-md p-3 bg-gray-100">
                            <label>Marca</label>
                            <select name="marca_id" className="border border-gray-400 ml-4 w-52 rounded-md text-center" onChange={handleChange}>
                                {marcas.map((marca)=>(
                                    <option value={marca.id} key={marca.id}>{marca.nombre}</option>
                                ))}
                            </select>
                        </div>
                        <div className="rounded-xl h-12">
                            <Input disabled color="indigo" size="lg" label="Imagen" />
                        </div>
                        <div className="rounded-xl h-12">
                            <Input onChange={handleChange} name="precioVenta" color="indigo" size="lg" label="Precio de Venta" />
                        </div>
                        <div className="h-12 text-center rounded-md p-3 bg-gray-100">
                            <label>Categoria</label>
                            <select name="categoria_id" className="border border-gray-400 ml-4 w-52 rounded-md text-center" onChange={handleChange}>
                                {categorias.map((categoria)=>(
                                    <option value={categoria.id} key={categoria.id}>{categoria.nombre}</option>
                                ))}
                            </select>
                        </div>
                        <div className="grid place-content-center">
                            <Button color="green" onClick={handleSubmit} className="text-base w-36 flex justify-center gap-2 items-center">Guardar<FaRegSave/></Button>
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
                    {currentProducts.map((producto) => (
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
            <Pagination 
                totalProducts={productos.length} 
                productsPerPage={productsPerPage}
                setCurrentPage={setCurrentPage} 
                currentPage={currentPage} 
            />
        </section>
    )
}

export default Productos;