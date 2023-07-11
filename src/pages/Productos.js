import { useState, useEffect } from "react";
import { listaProductos } from "../services/ProductosService";
import { TbBottle } from "react-icons/tb"

const Productos = () => {
    const [productos, setProductos] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [productosPorPagina] = useState(10);
    const [buscarProducto, setBuscarProducto] = useState("");

    const listarProductos = async() => {
        const result = await listaProductos();
        setProductos(result.data);
    };

    useEffect(()=>{
        listarProductos();
    },[])

    return(
        <section className="h-full">
            <div className="grid md:grid-cols-3 gap-4 [&>div]:rounded-xl">
                <div className="h-56 flex justify-center">
                    <TbBottle className="h-full w-auto block bg-red-400 text-gray-300"/>
                    <div className="bg-white w-[60%] text-center flex flex-col items-center justify-center">
                        <div className="text-3xl">
                            <span>Total de Productos</span>
                        </div>
                        <div className="text-9xl text-gray-800">
                            <span>{Productos.length}</span>  
                        </div>
                    </div>
                </div>
                <div className="bg-green-200 col-span-2 h-56">Box 2</div>
                <div className="bg-yellow-200 h-56">Box 3</div>
                <div className="bg-orange-200 h-56">Box 4</div>
                <div className="bg-violet-200 h-56">Box 5</div>
            </div>
            <table className="table-auto rounded-xl col-span-3 bg-white w-full mt-4">
                <thead>
                    <tr className="text-center [&>th]:p-2 bg-[#131422] text-white">
                        <th className="rounded-s">Nombre</th>
                        <th>Categoria</th>
                        <th>Marca</th>
                        <th>Medida</th>
                        <th>Cantidad</th>
                        <th className="rounded-e">Precio</th>
                    </tr>
                </thead>
                <tbody>
                    {productos.map((producto) => (
                        <tr key={producto.id} className="[&>td]:p-4">
                            <td>{producto.nombre}</td>
                            <td className="text-center">{producto.categoria.nombre}</td>
                            <td className="text-center">{producto.marca.nombre}</td>
                            <td className="text-center">{producto.medida.nombre}</td>
                            <td className="text-center">{producto.stock}</td>
                            <td className="text-center">{producto.precioVenta}</td>                            
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