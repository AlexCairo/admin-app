import React, { useState, useEffect } from "react";
import { Input, Textarea, Select, Option, Button, Dialog } from "@material-tailwind/react";
import { BiExport } from "react-icons/bi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { URL_API } from "../helpers/Config";

const Inventarios = () => {
  const [inventarios, setInventarios] = useState([]);
  const [saldoInicial, setSaldoInicial] = useState(0);
  const [costoInicial, setCostoInicial] = useState(0);
  const [cantidadInicial, setCantidadInicial] = useState(0);
  const [cantidadFinal, setCantidadFinal] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedOption, setSelectedOption] = useState("mes");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [productoData, setProductoData] = useState(null);

  const handleOpen = () => setOpenModal((cur) => !cur);

  const handleOptionChange = (value) => {
    setSelectedOption(value);
  };

  const fetchProductos = async () => {
    try {
      const response = await axios.get(`${URL_API}/productos/listarProductos`);
      const productos = response.data;
      if (productos.length > 0) {
        setSelectedProduct(productos[0]);
        setSearchTerm(productos[0].nombre);
      }
      setSearchResults(productos);
    } catch (error) {
      console.error("Error al obtener los productos:", error);
    }
  };

  const fetchSearchResults = async (term) => {
    try {
      const response = await axios.get(`${URL_API}/productos/listarProductos`);
      const filteredResults = response.data.filter((result) =>
        result.nombre.toLowerCase().includes(term.toLowerCase())
      );
      setSearchResults(filteredResults);
    } catch (error) {
      console.error("Error al realizar la búsqueda:", error);
    }
  };

  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);

    // Realiza la búsqueda en el API utilizando el término de búsqueda
    if (term.trim() === "") {
      // Mostrar todos los productos cuando el campo de búsqueda está vacío
      setSearchResults(searchResults);
    } else {
      fetchSearchResults(term);
    }

    setShowResults(true);
  };

  const handleProductChange = (product) => {
    setSelectedProduct(product);
    setSearchTerm(product.nombre);
    setShowResults(false);
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth() + 1;
      const day = selectedDate.getDate();

      let url = `${URL_API}/kardex/${selectedProduct.id}/${year}`;

      if (selectedOption === "mes") {
        url += `/${month}`;
      } else if (selectedOption === "dia") {
        url += `/${month}/${day}`;
      }

      axios
        .get(url)
        .then((response) => {
          setInventarios(response.data.detalleInventario);
          setCostoInicial(response.data.costoInicial);
          setCantidadInicial(response.data.cantidadInicial);
          setCantidadFinal(response.data.cantidadFinal);
        })
        .catch((error) => {
          console.error("Error al obtener los datos de la API:", error);
        });
    }
  }, [selectedProduct, selectedOption, selectedDate]);

  useEffect(() => {
    const fetchProductoData = async () => {
      if (selectedProduct) {
        try {
          const response = await axios.get(`${URL_API}/productos/${selectedProduct.id}`);
          const productoData = response.data;

          setProductoData(productoData);
        } catch (error) {
          console.error("Error al obtener los datos del producto:", error);
        }
      }
    };

    fetchProductoData();
  }, [selectedProduct]);

  const DateInput = React.forwardRef(({ value, onClick }, ref) => (
    <button className="example-custom-input" onClick={onClick} ref={ref}>
      {value}
    </button>
  ));

  const handleSearchFocus = (event) => {
    event.target.select();
  };

  const handlePdfClick = () => {
    const { id, nombre } = selectedProduct;
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1;

    const pdfUrl = `${URL_API}/reportes/kardex/${id}/${year}/${month}`;

    window.open(pdfUrl, "_blank");
  };

  return (
    <section className="h-full">
      <div className="w-full bg-[#131422] p-4 rounded-xl flex justify-between">
        <Button onClick={handleOpen} className="rounded-full font-bold text-2xl">
          +
        </Button>
        <div className="relative bg-white">
          Busque el Producto:
          <Input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            onFocus={handleSearchFocus}
            placeholder="Buscar"
            className="border border-gray-300 rounded-md px-4 py-2 mb-4 bg-white"
          />
          {showResults && searchTerm.length > 0 && searchResults.length > 0 && (
            <ul className="absolute z-10 bg-white border border-gray-300 rounded-md mt-2 w-full">
              {searchResults.map((result) => (
                <li
                  key={result.id}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleProductChange(result)}
                >
                  {result.nombre}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex items-center bg-white">
          <span className="mr-2">Fecha:</span>
          <div className="rounded-xl h-12">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              customInput={<DateInput />}
              dateFormat="dd/MM/yyyy"
            />
          </div>
        </div>
        <div className="rounded-xl h-12">
          <Select label="Reportes" value={selectedOption} onChange={handleOptionChange} className="bg-white" size="lg">
            <Option value="anual">Anual</Option>
            <Option value="mes">Mensual</Option>
            <Option value="dia">Diario</Option>
          </Select>
        </div>
        <Button onClick={handlePdfClick}>PDF</Button>
        <Button
          ripple="true"
          className="bg-white text-purple-500 duration-300 shadow-none hover:shadow-none hover:bg-purple-800 hover:text-white"
        >
          <BiExport className="text-2xl" />
        </Button>
      </div>
      <Dialog size="lg" open={openModal} handler={handleOpen} className="bg-transparent shadow-none">
        <form className="grid grid-cols-3 gap-6 bg-white p-4 rounded-xl">
          <h2 className="col-span-3 text-center font-medium text-3xl text-[#131422]">Ajuste de Inventario</h2>
          <div className="rounded-xl h-12">
            <Input
              color="indigo"
              size="lg"
              label="Nombre"
              value={selectedProduct ? selectedProduct.nombre : ""}
              readOnly
            />
          </div>
          <div className="rounded-xl h-12 row-span-2">
            <Textarea color="indigo" size="lg" label="Descripción" />
          </div>
        </form>
      </Dialog>
      {selectedProduct && (
        <div className="w-full bg-blank p-9 rounded-xl">
          <div>Producto: {selectedProduct.nombre}</div>
          <div>Categoría: {productoData?.categoria?.nombre}</div>
          <div>Marca: {productoData?.marca?.nombre}</div>
          <div>Medida: {productoData?.medida?.nombre}</div>
          <div>Stock: {productoData?.stock?.toFixed(2)}</div>
          <div>Costo Unitario: {productoData?.precioCompra?.toFixed(2)}</div>
          <div>Precio de Venta: {productoData?.precioVenta?.toFixed(2)}</div>
        </div>
      )}
      {selectedProduct && (
        <table className="table-auto rounded-xl col-span-3 bg-white w-full mt-4">
          <thead>
            <tr className="text-center [&>th]:p-2 bg-[#131422] text-white">
              <th>N°</th>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Descripción</th>
              <th>Costo Unitario</th>
              <th>Entrada</th>
              <th>Salida</th>
              <th>Disponible</th>
              <th className="rounded-e"></th>
            </tr>
          </thead>
          <tbody>
            <tr className="[&>td]:p-2">
              <td className="text-center"></td>
              <td className="text-center"></td>
              <td className="text-center"></td>
              <td className="text-center">Por el saldo anterior</td>
              <td className="text-center">{costoInicial.toFixed(2)}</td>
              <td className="text-center"></td>
              <td className="text-center"></td>
              <td className="text-center">{cantidadInicial.toFixed(2)}</td>
              <td className="flex justify-center"></td>
            </tr>
            {inventarios.map((inventario, index) => {
              const fechaF = new Date(inventario.fecha).toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              });
              const entradaF = inventario.entrada.toFixed(2);
              const salidaF = inventario.salida.toFixed(2);
              const costoUnitarioF = inventario.costoUnitario.toFixed(2);
              const saldoF = inventario.saldo.toFixed(2);

              return (
                <tr key={index + 2} className="[&>td]:p-2">
                  <td className="text-center">{index + 1}</td>
                  <td className="text-center">{fechaF}</td>
                  <td className="text-center">{inventario.tipoMovimiento}</td>
                  <td className="text-center">{inventario.motivo}</td>
                  <td className="text-center">{costoUnitarioF}</td>
                  <td className="text-center">{entradaF}</td>
                  <td className="text-center">{salidaF}</td>
                  <td className="text-center">{saldoF}</td>
                  <td className="flex justify-center"></td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td className="text-center"></td>
              <td className="text-center"></td>
              <td className="text-center"></td>
              <td className="text-center">Total Disponible</td>
              <td className="text-center"></td>
              <td className="text-center"></td>
              <td className="text-center"></td>
              <td className="text-center">{cantidadFinal.toFixed(2)}</td>
              <td className="flex justify-center"></td>
            </tr>
          </tfoot>
        </table>
      )}
    </section>
  );
};

export default Inventarios;
