import React, { useState, useEffect } from "react";
import { Input, Button, Dialog, ButtonGroup } from "@material-tailwind/react";
import { BiExport } from "react-icons/bi";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import axios from "axios";
import { URL_API } from "../helpers/Config";
import { FaRegSave } from "react-icons/fa";
import Pagination from "../components/Pagination";
import Select from 'react-select';
import { RiShoppingCartLine } from "react-icons/ri";
import Loader from "../components/Loader";

const initValues = {
  tipoComprobante: 'FT',
  serieComprobante: '000',
  numeroComprobante: '000',
  nombreProveedor : 'Otros',
  motivo: null,
  carrito: [],
};

const NuevaCompraForm = ({ handleChange, handleSubmit, handleAgregarProducto, productos, handleOpen }) => {
  const [nuevaCompra, setNuevaCompra] = useState(initValues);
  const [productoSeleccionado, setProductoSeleccionado] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [precio, setPrecio] = useState("");
  const [total, setTotal] = useState(0);
  const [carrito, setCarrito] = useState([]);
  const [carritoActualizado, setCarritoActualizado] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevaCompra((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleAgregar = () => {
    const productoSeleccionadoObj = products.find((product) => product.value === Number(productoSeleccionado));

    if (productoSeleccionadoObj) {
      const nuevoProducto = {
        producto: {
          id: productoSeleccionadoObj.value,
          label: productoSeleccionadoObj.label,
        },
        cantidad: Number(cantidad),
        precio: Number(precio),
      };

      setCarritoActualizado((prevState) => [...prevState, nuevoProducto]);

      setProductoSeleccionado("");
      setCantidad("");
      setPrecio("");
    } else {
      console.error("El producto seleccionado no existe");
    }
  };

  const handleEliminarProducto = (index) => {
    setCarritoActualizado((prevState) => {
      const carritoActualizado = [...prevState];
      carritoActualizado.splice(index, 1);
      return carritoActualizado;
    });
  };

  useEffect(() => {
    if (productoSeleccionado) {
      const productoSeleccionadoObj = products.find((product) => product.value === Number(productoSeleccionado));
      setCantidad(productoSeleccionadoObj.stock.toString());
      setPrecio(productoSeleccionadoObj.precioCompra.toString());
    }
  }, [productoSeleccionado]);

  useEffect(() => {
    const sumatoria = carritoActualizado.reduce((total, item) => total + item.cantidad * item.precio, 0);
    setTotal(sumatoria);
  }, [carritoActualizado]);

  useEffect(() => {
    setNuevaCompra((prevState) => ({
      ...prevState,
      carrito: carritoActualizado,
    }));
  }, [carritoActualizado]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${URL_API}/productos/listarProductos`);
      const productList = response.data.map((product) => ({
        value: product.id,
        label: product.nombre,
        stock: product.stock,
        precioCompra: product.precioCompra,
      }));

      setProducts(productList);
      setSelectedProduct(productList[0]);
    } catch (error) {
      console.error('Error al obtener la lista de productos:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleProductChange = (selectedOption) => {
    setSelectedProduct(selectedOption);
    setProductoSeleccionado(selectedOption.value);
  };

  return (
    <form className="grid grid-cols-3 gap-6 bg-white p-4 rounded-xl">
      <h2 className="col-span-3 bg-[#131422] rounded-xl p-2 text-center font-medium text-3xl text-white">
        Nueva Compra
      </h2>

      <div className="rounded-xl h-12">
        <Input
          onChange={handleInputChange}
          name="tipoComprobante"
          color="indigo"
          size="lg"
          label="Tipo de Comprobante"
          value={nuevaCompra.tipoComprobante}
        />
      </div>
      <div className="rounded-xl h-12">
        <Input
          onChange={handleInputChange}
          name="serieComprobante"
          color="indigo"
          size="lg"
          label="Serie de Comprobante"
          value={nuevaCompra.serieComprobante}
        />
      </div>
      <div className="rounded-xl h-12">
        <Input
          onChange={handleInputChange}
          name="numeroComprobante"
          color="indigo"
          size="lg"
          label="N° de Comprobante"
          value={nuevaCompra.numeroComprobante}
        />
      </div>
      <div className="rounded-xl h-12">
        <Input
          onChange={handleInputChange}
          name="nombreProveedor"
          color="indigo"
          size="lg"
          label="Nombre del Proveedor"
          value={nuevaCompra.nombreProveedor}
        />
      </div>

      <div className="col-span-3">
        <h3 className="text-xl font-medium mb-2">Agregar Producto al Carrito</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Producto</label>
            <Select
              className="basic-single"
              classNamePrefix="select"
              value={selectedProduct}
              onChange={handleProductChange}
              options={products}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Cantidad</label>
            <input
              type="number"
              name="cantidad"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Precio Unitario</label>
            <input
              type="number"
              name="precio"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            />
          </div>

          <div className="col-span-3 mt-4">
            <button
              type="button"
              onClick={handleAgregar}
              className="text-base w-36 flex justify-center gap-2 items-center bg-green-500 text-white rounded-md px-4 py-2"
            >
              Agregar
            </button>
          </div>
        </div>
      </div>

      <div className="col-span-3">
        <h3 className="text-xl font-medium mb-2">Carrito de Compras</h3>
        <table className="w-full">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>SubTotales</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {carritoActualizado.map((item, index) => (
              <tr key={index}>
                <td>{item.producto.label}</td>
                <td>{item.cantidad.toFixed(2)}</td>
                <td>{item.precio.toFixed(2)}</td>
                <td>{(item.precio * item.cantidad).toFixed(2)}</td>
                <td>
                  <button onClick={() => handleEliminarProducto(index)} className="text-base bg-red-500 text-white rounded-md px-4 py-2">
                    X
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="col-span-3 mt-4">
        <h1>Total: {total.toFixed(2)}</h1>
      </div>

      <button
        type="button"
        onClick={() => handleSubmit(nuevaCompra, "POST")}
        className="text-base w-36 flex justify-center gap-2 items-center bg-green-500 text-white rounded-md px-4 py-2"
      >
        Guardar
        <FaRegSave />
      </button>
    </form>
  );
};

const EditarCompraForm = ({ compraSeleccionada, handleChange, handleSubmit, handleOpen }) => {
  return (
    <form className="grid grid-cols-3 gap-6 bg-white p-4 rounded-xl">
      <h2 className="col-span-3 bg-[#131422] rounded-xl p-2 text-center font-medium text-3xl text-white">
        Editar Compra
      </h2>
      <div className="rounded-xl h-12">
        <Input
          onChange={handleChange}
          name="tipoComprobante"
          color="indigo"
          size="lg"
          label="Tipo de Comprobante"
          value={compraSeleccionada.tipoComprobante}
        />
      </div>
      <div className="rounded-xl h-12">
        <Input
          onChange={handleChange}
          name="serieComprobante"
          color="indigo"
          size="lg"
          label="N° de Serie"
          value={compraSeleccionada.serieComprobante}
        />
      </div>
      <div className="rounded-xl h-12">
        <Input
          onChange={handleChange}
          name="numeroComprobante"
          color="indigo"
          size="lg"
          label="N° de Comprobante"
          value={compraSeleccionada.numeroComprobante}
        />
      </div>
      <div className="rounded-xl h-12">
        <Input
          onChange={handleChange}
          name="nombreProveedor"
          color="indigo"
          size="lg"
          label="Proveedor"
          value={compraSeleccionada.nombreProveedor}
        />
      </div>
      <div className="rounded-xl h-12">
        <Input
          onChange={handleChange}
          name="motivo"
          color="indigo"
          size="lg"
          label="Motivo"
          value={compraSeleccionada.motivo}
        />
      </div>

      <Button
        color="green"
        onClick={() => handleSubmit(compraSeleccionada, "PUT")}
        className="text-base w-36 flex justify-center gap-2 items-center"
      >
        Guardar
        <FaRegSave />
      </Button>

      <div className="col-span-3 mt-4">
        <h3 className="text-xl font-medium mb-2">Detalle de la Compra</h3>
        <table className="w-full">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>SubTotales</th>
            </tr>
          </thead>
          <tbody>
            {compraSeleccionada.carrito.map((item) => (
              <tr key={item.producto.id}>
                <td>{item.producto.label}</td>
                <td>{item.cantidad}</td>
                <td>{item.precio}</td>
                <td>{item.precio * item.cantidad}</td>
              </tr>
            ))}

            <tr key={1}>
              <td>Total</td>
              <td></td>
              <td></td>
              <td>{compraSeleccionada.montoTotal}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </form>
  );
};

const Compras = () => {
  const [compras, setCompras] = useState([]);
  const [compraSeleccionada, setCompraSeleccionada] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [productos, setProductos] = useState([]);

  const handleOpen = () => {
    setCompraSeleccionada(null);
    setOpenModal((cur) => !cur);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nuevaCompra = { ...compraSeleccionada, [name]: value };
    setCompraSeleccionada(nuevaCompra);
  };

  const agregarCompra = async (nuevaCompra) => {
    try {
      console.log("Datos de la nueva compra:", nuevaCompra);
      const response = await axios.post(`${URL_API}/compras`, nuevaCompra);
      console.log("Respuesta del servidor:", response.data);
      listarCompras();
    } catch (error) {
      console.error("Error al agregar la compra:", error);
    }
  };

  const editarCompra = async (compraEditada) => {
    try {
      console.log("Datos de la compra editada:", compraEditada);
      const response = await axios.put(`${URL_API}/compras/${compraEditada.id}`, compraEditada);
      console.log("Respuesta del servidor:", response.data);
      listarCompras();
    } catch (error) {
      console.error("Error al editar la compra:", error);
    }
  };

  const handleSubmit = (data, method) => {
    if (method === "PUT") {
      editarCompra(data);
    } else {
      agregarCompra(data);
    }
    handleOpen();
  };

  const handleDeleteCompra = async (compraId) => {
    try {
      const response = await axios.delete(`${URL_API}/compras/${compraId}`);
      console.log("Respuesta del servidor:", response.data);
      listarCompras();
    } catch (error) {
      console.error("Error al eliminar la compra:", error);
    }
  };

  const handleGenerarReporte = (compraId) => {
    const url = `${URL_API}/reportes/compras/${compraId}`;
    window.open(url, "_blank");
  };

  const handleEdit = (compra) => {
    setCompraSeleccionada(compra);
    setOpenModal((cur) => !cur);
  };

  const listarCompras = async () => {
    try {
      const response = await axios.get(`${URL_API}/compras`);
      setCompras(response.data);
    } catch (error) {
      console.error("Error al obtener los datos de la API:", error);
    }
  };

  const listarProductos = async () => {
    try {
      const response = await axios.get(`${URL_API}/productos/listarProductos`);
      setProductos(response.data);
    } catch (error) {
      console.error("Error al obtener los productos:", error);
    }
  };

  useEffect(() => {
    listarCompras();
    listarProductos();
  }, []);

  const handleAgregarProducto = (producto) => {
    const productoSeleccionadoObj = productos.find((p) => p.value === producto);
    const nuevoProducto = {
      producto: productoSeleccionadoObj,
      cantidad: Number(productoSeleccionadoObj.stock),
      precio: Number(productoSeleccionadoObj.precioCompra),
    };

    const carritoActualizado = [...compraSeleccionada.carrito, nuevoProducto];

    const sumatoria = carritoActualizado.reduce((total, item) => total + item.cantidad * item.precio, 0);

    const compraEditada = {
      ...compraSeleccionada,
      carrito: carritoActualizado,
      montoTotal: sumatoria,
    };

    setCompraSeleccionada(compraEditada);
  };

  const handleEliminarProducto = (index) => {
    const carritoActualizado = [...compraSeleccionada.carrito];
    carritoActualizado.splice(index, 1);

    const sumatoria = carritoActualizado.reduce((total, item) => total + item.cantidad * item.precio, 0);

    const compraEditada = {
      ...compraSeleccionada,
      carrito: carritoActualizado,
      montoTotal: sumatoria,
    };

    setCompraSeleccionada(compraEditada);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = compras.slice(indexOfFirstItem, indexOfLastItem);

  return ( compras.length > 0 ? (
    <section className="h-full">
      <div className="w-full bg-[#131422] p-4 rounded-xl flex justify-between">
        <Button onClick={handleOpen} className="rounded-full font-bold text-2xl">
          +
        </Button>

        <Button
          ripple="true"
          className="bg-white text-purple-500 duration-300 shadow-none hover:shadow-none hover:bg-purple-800 hover:text-white"
        >
          <BiExport className="text-2xl" />
        </Button>
      </div>
      <Dialog size="lg" open={openModal} handler={handleOpen} className="bg-transparent shadow-none">
        {compraSeleccionada === null ? (
          <NuevaCompraForm
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            handleAgregarProducto={handleAgregarProducto}
            productos={productos}
            handleOpen={handleOpen}
          />
        ) : (
          <EditarCompraForm
            compraSeleccionada={compraSeleccionada}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            handleOpen={handleOpen}
          />
        )}
      </Dialog>
      <div className="w-full mt-4 grid grid-cols-4">
        <div className="flex bg-white grid-row- justify-between items-center">
            <div className="bg-green-400 w-[40%] h-full grid place-content-center">
                <RiShoppingCartLine className="text-[8rem] text-white" />
            </div>
            <div className="text-center w-[60%]">
                <h2 className="text-xl text-gray-500 font-semibold">Compras</h2>
                <span className="text-[5rem] text-gray-500 font-semibold">{compras.length}</span>
            </div>
        </div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <table className="table-auto rounded-xl col-span-3 bg-white w-full mt-4">
        <thead>
          <tr className="text-center [&>th]:p-2 bg-[#131422] text-white">
            <th>N°</th>
            <th>Fecha</th>
            <th>Descripción</th>
            <th>Comprobante</th>
            <th>Proveedor</th>
            <th>Monto Total</th>
            <th>Acciones</th>
            <th className="rounded-e"></th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((compra, index) => {

            const fechaF = new Date(compra.created_at).toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            });


            return (
              <tr key={compra.id} className="[&>td]:p-2">
                <td className="text-center">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td className="text-center">{fechaF}</td>
                <td className="text-center">{compra.motivo}</td>
                <td className="text-center">{compra.tipoComprobante} {compra.serieComprobante} {compra.numeroComprobante}</td>
                <td className="text-center">{compra.nombreProveedor}</td>
                <td className="text-center">{compra.montoTotal.toFixed(2)}</td>

                <td className="flex justify-center">
                  <ButtonGroup variant="outlined" className="text-center [&>Button]:text-base">
                    <Button
                      onClick={() => handleEdit(compra)}
                      className="border duration-300 border-green-300 text-green-300 hover:bg-green-300 hover:text-white"
                    >
                      <FiEdit2 />
                    </Button>
                    <Button
                      onClick={() => handleDeleteCompra(compra.id)}
                      className="border duration-300 border-red-300 text-red-300 hover:bg-red-300 hover:text-white"
                    >
                      <FiTrash2 />
                    </Button>
                  </ButtonGroup>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Pagination
        totalProducts={compras.length}
        productsPerPage={itemsPerPage}
        setCurrentPage={paginate}
        currentPage={currentPage}
      />
    </section> ) : (<Loader />)
  );
};

export default Compras;
