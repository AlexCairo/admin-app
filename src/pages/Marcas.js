import React, { useState, useEffect } from "react";
import { Input, Button, Dialog, ButtonGroup } from "@material-tailwind/react";
import { BiExport } from "react-icons/bi";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import axios from "axios";
import { URL_API } from "../helpers/Config";
import { FaRegSave } from "react-icons/fa";
import Pagination from "../components/Pagination";

const initValues = {
  nombre: "",
};

const NuevaMarcaForm = ({ handleChange, handleSubmit }) => {
  const [nuevaMarca, setNuevaMarca] = useState(initValues);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevaMarca((prevState) => ({ ...prevState, [name]: value }));
  };

  return (
    <form className="grid grid-cols-3 gap-6 bg-white p-4 rounded-xl">
      <h2 className="col-span-3 bg-[#131422] rounded-xl p-2 text-center font-medium text-3xl text-white">
        Nueva Marca
      </h2>

      <div className="rounded-xl h-12">
        <Input
          onChange={handleInputChange}
          name="nombre"
          color="indigo"
          size="lg"
          label="Nombre"
          value={nuevaMarca.nombre}
        />
      </div>

      <Button
        color="green"
        onClick={() => handleSubmit(nuevaMarca, "POST")}
        className="text-base w-36 flex justify-center gap-2 items-center"
      >
        Guardar
        <FaRegSave />
      </Button>
    </form>
  );
};

const EditarMarcaForm = ({ marcaSeleccionada, handleChange, handleSubmit }) => {
  return (
    <form className="grid grid-cols-3 gap-6 bg-white p-4 rounded-xl">
      <h2 className="col-span-3 bg-[#131422] rounded-xl p-2 text-center font-medium text-3xl text-white">
        Editar Marca
      </h2>
      <div className="rounded-xl h-12">
        <Input
          onChange={handleChange}
          name="nombre"
          color="indigo"
          size="lg"
          label="Nombre"
          value={marcaSeleccionada.nombre}
        />
      </div>

      <Button
        color="green"
        onClick={() => handleSubmit(marcaSeleccionada, "PUT")}
        className="text-base w-36 flex justify-center gap-2 items-center"
      >
        Guardar
        <FaRegSave />
      </Button>
    </form>
  );
};

const Marcas = () => {
  const [marcas, setMarcas] = useState([]);
  const [marcaSeleccionada, setMarcaSeleccionada] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const handleOpen = () => {
    setMarcaSeleccionada(null);
    setOpenModal((cur) => !cur);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nuevaMarca = { ...marcaSeleccionada, [name]: value };
    setMarcaSeleccionada(nuevaMarca);
  };

  const agregarMarca = async (nuevaMarca) => {
    try {
      console.log("Datos de la nueva marca:", nuevaMarca);
      const response = await axios.post(`${URL_API}/marcas`, nuevaMarca);
      console.log("Respuesta del servidor:", response.data);
      listarMarcas();
    } catch (error) {
      console.error("Error al agregar la marca:", error);
    }
  };

  const editarMarca = async (marcaEditada) => {
    try {
      console.log("Datos de la marca editada:", marcaEditada);
      const response = await axios.put(`${URL_API}/marcas/${marcaEditada.id}`, marcaEditada);
      console.log("Respuesta del servidor:", response.data);
      listarMarcas();
    } catch (error) {
      console.error("Error al editar la marca:", error);
    }
  };

  const handleSubmit = (data, method) => {
    if (method === "PUT") {
      editarMarca(data);
    } else {
      agregarMarca(data);
    }
    handleOpen();
  };

  const handleDeleteMarca = async (marcaId) => {
    try {
      const response = await axios.delete(`${URL_API}/marcas/${marcaId}`);
      console.log("Respuesta del servidor:", response.data);
      listarMarcas();
    } catch (error) {
      console.error("Error al eliminar la marca:", error);
    }
  };

  const handleEdit = (marca) => {
    setMarcaSeleccionada(marca);
    setOpenModal((cur) => !cur);
  };

  const listarMarcas = async () => {
    try {
      const response = await axios.get(`${URL_API}/marcas`);
      setMarcas(response.data);
    } catch (error) {
      console.error("Error al obtener los datos de la API:", error);
    }
  };

  useEffect(() => {
    listarMarcas();
  }, []);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = marcas.slice(indexOfFirstItem, indexOfLastItem);

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
        {marcaSeleccionada === null ? (
          <NuevaMarcaForm handleChange={handleChange} handleSubmit={handleSubmit} />
        ) : (
          <EditarMarcaForm
            marcaSeleccionada={marcaSeleccionada}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
          />
        )}
      </Dialog>
      <div className="w-full bg-blank p-9 rounded-xl">
        <div>Esta info va en cuadritos como dashboard</div>
        <div>Cantidad Marcas: {marcas.length}</div>
      </div>
      <table className="table-auto rounded-xl col-span-3 bg-white w-full mt-4">
        <thead>
          <tr className="text-center [&>th]:p-2 bg-[#131422] text-white">
            <th>N°</th>
            <th>Nombre</th>
            <th>Acciones</th>
            <th className="rounded-e"></th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((marca, index) => {
            return (
              <tr key={marca.id} className="[&>td]:p-2">
                <td className="text-center">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td className="text-center">{marca.nombre}</td>
                <td className="flex justify-center">
                  <ButtonGroup variant="outlined" className="text-center [&>Button]:text-base">
                    <Button
                      onClick={() => handleEdit(marca)}
                      className="border duration-300 border-green-300 text-green-300 hover:bg-green-300 hover:text-white"
                    >
                      <FiEdit2 />
                    </Button>
                    <Button
                      onClick={() => handleDeleteMarca(marca.id)}
                      className="border duration-300 bor:bg-grd-300  text-red-300 hover:bg-red-300 hover:text-white"
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
        totalProducts={marcas.length}
        productsPerPage={itemsPerPage}
        setCurrentPage={paginate}
        currentPage={currentPage}
      />
    </section>
  );
};

export default Marcas;
