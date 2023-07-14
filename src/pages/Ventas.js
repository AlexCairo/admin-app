import React, { useState, useEffect } from "react";
import { Input, Button, Dialog, ButtonGroup } from "@material-tailwind/react";
import { BiExport } from "react-icons/bi";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import axios from "axios";
import { URL_API } from "../helpers/Config";
import { FaRegSave } from "react-icons/fa";
import Pagination from "../components/Pagination";
import Select from 'react-select';

const initValues = {
  tipoDocumento: 'DNI',
  numeroDocumento: '00000000',
  nombreCliente: 'Público en General',
  montoPagoCliente: 0,
  motivo: null,
  carrito: [],
};

const NuevaVentaForm = ({ handleChange, handleSubmit, handleAgregarProducto, productos, handleOpen }) => {
  const [nuevaVenta, setNuevaVenta] = useState(initValues);
  const [productoSeleccionado, setProductoSeleccionado] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [precio, setPrecio] = useState("");
  const [medida, setMedida] = useState("");
  const [total, setTotal] = useState(0);
  const [carrito, setCarrito] = useState([]);
  const [carritoActualizado, setCarritoActualizado] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevaVenta((prevState) => ({ ...prevState, [name]: value }));
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
  
      if (productoSeleccionadoObj) {
        setCantidad(productoSeleccionadoObj.stock.toString());
        setPrecio(productoSeleccionadoObj.precioVenta.toString());
      }
    }
  }, [productoSeleccionado]);

  useEffect(() => {
    const sumatoria = carritoActualizado.reduce((total, item) => total + item.cantidad * item.precio, 0);
    setTotal(sumatoria);
  }, [carritoActualizado]);

  useEffect(() => {
    setNuevaVenta((prevState) => ({
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
        precioVenta: product.precioVenta,
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
  
    const productoSeleccionadoObj = products.find((product) => product.value === Number(selectedOption.value));
  
    if (productoSeleccionadoObj) {
      if (productoSeleccionadoObj.stock !== undefined && productoSeleccionadoObj.precioVenta !== undefined) {
        setCantidad(productoSeleccionadoObj.stock.toString());
        setPrecio(productoSeleccionadoObj.precioVenta.toString());
      }
    }
  };

  return (
    <form className="grid grid-cols-3 gap-6 bg-white p-4 rounded-xl">
      <h2 className="col-span-3 bg-[#131422] rounded-xl p-2 text-center font-medium text-3xl text-white">
        Nueva Venta
      </h2>

      <div className="rounded-xl h-12">
        <Input
          onChange={handleInputChange}
          name="tipoDocumento"
          color="indigo"
          size="lg"
          label="Tipo de Documento"
          value={nuevaVenta.tipoDocumento}
        />
      </div>
      <div className="rounded-xl h-12">
        <Input
          onChange={handleInputChange}
          name="numeroDocumento"
          color="indigo"
          size="lg"
          label="Número de Documento"
          value={nuevaVenta.numeroDocumento}
        />
      </div>
      <div className="rounded-xl h-12">
        <Input
          onChange={handleInputChange}
          name="nombreCliente"
          color="indigo"
          size="lg"
          label="Nombre del Cliente"
          value={nuevaVenta.nombreCliente}
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
        <h3 className="text-xl font-medium mb-2">Carrito de Ventas</h3>
        <table className="w-full">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>Subtotales</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {carritoActualizado.map((item, index) => (
              <tr key={index}>
                <td>{item.producto.label}</td>
                <td>{item.cantidad.toFixed(2)}</td>
                <td>{item.precio.toFixed(2)}</td>
                <td>{(item.cantidad * item.precio).toFixed(2)}</td>
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
        <h3>Total: {total.toFixed(2)}</h3>
      </div>

      <button
        type="button"
        onClick={() => handleSubmit(nuevaVenta, "POST")}
        className="text-base w-36 flex justify-center gap-2 items-center bg-green-500 text-white rounded-md px-4 py-2"
      >
        Guardar
        <FaRegSave />
      </button>
    </form>
  );
};

const EditarVentaForm = ({ ventaSeleccionada, handleChange, handleSubmit, handleOpen }) => {
  return (
    <form className="grid grid-cols-3 gap-6 bg-white p-4 rounded-xl">
      <h2 className="col-span-3 bg-[#131422] rounded-xl p-2 text-center font-medium text-3xl text-white">
        Editar Venta
      </h2>
      <div className="rounded-xl h-12">
        <Input
          onChange={handleChange}
          name="tipoDocumento"
          color="indigo"
          size="lg"
          label="Tipo de Documento"
          value={ventaSeleccionada.tipoDocumento}
        />
      </div>
      <div className="rounded-xl h-12">
        <Input
          onChange={handleChange}
          name="numeroDocumento"
          color="indigo"
          size="lg"
          label="Número de Documento"
          value={ventaSeleccionada.numeroDocumento}
        />
      </div>
      <div className="rounded-xl h-12">
        <Input
          onChange={handleChange}
          name="nombreCliente"
          color="indigo"
          size="lg"
          label="Nombre del Cliente"
          value={ventaSeleccionada.nombreCliente}
        />
      </div>
      <div className="rounded-xl h-12">
        <Input
          onChange={handleChange}
          name="motivo"
          color="indigo"
          size="lg"
          label="Motivo"
          value={ventaSeleccionada.motivo}
        />
      </div>

      <Button
        color="green"
        onClick={() => handleSubmit(ventaSeleccionada, "PUT")}
        className="text-base w-36 flex justify-center gap-2 items-center"
      >
        Guardar
        <FaRegSave />
      </Button>

      <div className="col-span-3 mt-4">
        <h3 className="text-xl font-medium mb-2">Detalle de la Venta</h3>
        <table className="w-full">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio</th>
            </tr>
          </thead>
          <tbody>
            {ventaSeleccionada.venta_inventarios.map((item) => (
              <tr key={item.id}>
                <td>{item.inventario.producto.nombre}</td>
                <td>{item.cantidad.toFixed(2)}</td>
                <td>{item.precio.toFixed(2)}</td>
              </tr>
            ))}

            <tr key={1}>
              <td>Total</td>
              <td></td>
              <td>{ventaSeleccionada.montoPagoCliente.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </form>
  );
};

const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [productos, setProductos] = useState([]);

  const handleOpen = () => {
    setVentaSeleccionada(null);
    setOpenModal((cur) => !cur);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nuevaVenta = { ...ventaSeleccionada, [name]: value };
    setVentaSeleccionada(nuevaVenta);
  };

  const agregarVenta = async (nuevaVenta) => {
    try {
      console.log("Datos de la nueva venta:", nuevaVenta);
      const response = await axios.post(`${URL_API}/ventas`, nuevaVenta);
      console.log("Respuesta del servidor:", response.data);
      listarVentas();
    } catch (error) {
      console.error("Error al agregar la venta:", error);
    }
  };

  const editarVenta = async (ventaEditada) => {
    try {
      console.log("Datos de la venta editada:", ventaEditada);
      const response = await axios.put(`${URL_API}/ventas/${ventaEditada.id}`, ventaEditada);
      console.log("Respuesta del servidor:", response.data);
      listarVentas();
    } catch (error) {
      console.error("Error al editar la venta:", error);
    }
  };

  const handleSubmit = (data, method) => {
    if (method === "PUT") {
      editarVenta(data);
    } else {
      agregarVenta(data);
    }
    handleOpen();
  };

  const handleDeleteVenta = async (ventaId) => {
    try {
      const response = await axios.delete(`${URL_API}/ventas/${ventaId}`);
      console.log("Respuesta del servidor:", response.data);
      listarVentas();
    } catch (error) {
      console.error("Error al eliminar la venta:", error);
    }
  };

  const handleGenerarReporte = (ventaId) => {
    const url = `${URL_API}/reportes/ventas/${ventaId}`;
    window.open(url, "_blank");
  };

  const handleEdit = (venta) => {
    setVentaSeleccionada(venta);
    setOpenModal((cur) => !cur);
  };

  const listarVentas = async () => {
    try {
      const response = await axios.get(`${URL_API}/ventas`);
      setVentas(response.data);
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
    listarVentas();
    listarProductos();
  }, []);

  const handleAgregarProducto = (producto) => {
    const productoSeleccionadoObj = productos.find((p) => p.value === producto);
    const nuevoProducto = {
      producto: productoSeleccionadoObj,
      cantidad: Number(productoSeleccionadoObj.stock),
      precio: Number(productoSeleccionadoObj.precioVenta),
    };
  
    const carritoActualizado = [...ventaSeleccionada.carrito, nuevoProducto];
  
    const sumatoria = carritoActualizado.reduce((total, item) => total + item.cantidad * item.precio, 0);
  
    const ventaEditada = {
      ...ventaSeleccionada,
      carrito: carritoActualizado,
      montoPagoCliente: sumatoria,
    };
  
    setVentaSeleccionada(ventaEditada);
  };
  

  const handleEliminarProducto = (index) => {
    const carritoActualizado = [...ventaSeleccionada.carrito];
    carritoActualizado.splice(index, 1);

    const sumatoria = carritoActualizado.reduce((total, item) => total + item.cantidad * item.precio, 0);

    const ventaEditada = {
      ...ventaSeleccionada,
      carrito: carritoActualizado,
      montoPagoCliente: sumatoria,
    };

    setVentaSeleccionada(ventaEditada);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = ventas.slice(indexOfFirstItem, indexOfLastItem);

  return (
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
        {ventaSeleccionada === null ? (
          <NuevaVentaForm
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            handleAgregarProducto={handleAgregarProducto}
            productos={productos}
            handleOpen={handleOpen}
          />
        ) : (
          <EditarVentaForm
            ventaSeleccionada={ventaSeleccionada}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            handleOpen={handleOpen}
          />
        )}
      </Dialog>
      <div className="w-full bg-blank p-9 rounded-xl">
        <div>Esta info va en cuadritos como dashboard</div>
        <div>Cantidad Ventas: {ventas.length}</div>
      </div>
      <table className="table-auto rounded-xl col-span-3 bg-white w-full mt-4">
        <thead>
          <tr className="text-center [&>th]:p-2 bg-[#131422] text-white">
            <th>N°</th>
            <th>Fecha</th>
            <th>Motivo</th>
            <th>Documento</th>
            <th>Nombre del Cliente</th>
            <th>Monto Total</th>
            <th>Acciones</th>
            <th className="rounded-e"></th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((venta, index) => {

            const fechaF = new Date(venta.created_at).toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            });


            return (
              <tr key={venta.id} className="[&>td]:p-2">
                <td className="text-center">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td className="text-center">{fechaF}</td>
                <td className="text-center">{venta.motivo}</td>
                <td className="text-center">{venta.tipoDocumento} {venta.numeroDocumento}</td>
                <td className="text-center">{venta.nombreCliente}</td>
                <td className="text-center">{venta.montoPagoCliente.toFixed(2)}</td>

                <td className="flex justify-center">
                  <ButtonGroup variant="outlined" className="text-center [&>Button]:text-base">
                    <Button
                      onClick={() => handleGenerarReporte(venta.id)}
                      className="border duration-300 border-purple-300 text-purple-300 hover:bg-purple-300 hover:text-white"
                    >
                      PDF
                    </Button>
                    <Button
                      onClick={() => handleEdit(venta)}
                      className="border duration-300 border-green-300 text-green-300 hover:bg-green-300 hover:text-white"
                    >
                      <FiEdit2 />
                    </Button>
                    <Button
                      onClick={() => handleDeleteVenta(venta.id)}
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
        itemsPerPage={itemsPerPage}
        totalItems={ventas.length}
        paginate={paginate}
        currentPage={currentPage}
      />
    </section>
  );
};

export default Ventas;
