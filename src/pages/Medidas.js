import React, { useState, useEffect } from "react";
import { Input, Button, Dialog, ButtonGroup } from "@material-tailwind/react";
import { BiExport } from "react-icons/bi";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import axios from "axios";
import { URL_API } from "../helpers/Config";
import { FaBalanceScale, FaRegSave } from "react-icons/fa";
import Pagination from "../components/Pagination";
import Loader from "../components/Loader";

const initValues = {
  codigo: "",
  nombre: "",
};

const NuevaMedidaForm = ({ handleChange, handleSubmit }) => {
  const [nuevaMedida, setNuevaMedida] = useState(initValues);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevaMedida((prevState) => ({ ...prevState, [name]: value }));
  };

  return (
    <form className="grid grid-cols-3 gap-6 bg-white p-4 rounded-xl">
      <h2 className="col-span-3 bg-[#131422] rounded-xl p-2 text-center font-medium text-3xl text-white">
        Nueva Medida
      </h2>

      <div className="rounded-xl h-12">
        <Input
          onChange={handleInputChange}
          name="codigo"
          color="indigo"
          size="lg"
          label="Código"
          value={nuevaMedida.codigo}
        />
      </div>
      <div className="rounded-xl h-12">
        <Input
          onChange={handleInputChange}
          name="nombre"
          color="indigo"
          size="lg"
          label="Nombre"
          value={nuevaMedida.nombre}
        />
      </div>

      <Button
        color="green"
        onClick={() => handleSubmit(nuevaMedida, "POST")}
        className="text-base w-36 flex justify-center gap-2 items-center"
      >
        Guardar
        <FaRegSave />
      </Button>
    </form>
  );
};

const EditarMedidaForm = ({ medidaSeleccionada, handleChange, handleSubmit }) => {
  return (
    <form className="grid grid-cols-3 gap-6 bg-white p-4 rounded-xl">
      <h2 className="col-span-3 bg-[#131422] rounded-xl p-2 text-center font-medium text-3xl text-white">
        Editar Medida
      </h2>
      <div className="rounded-xl h-12">
        <Input
          onChange={handleChange}
          name="codigo"
          color="indigo"
          size="lg"
          label="Código"
          value={medidaSeleccionada.codigo}
        />
      </div>
      <div className="rounded-xl h-12">
        <Input
          onChange={handleChange}
          name="nombre"
          color="indigo"
          size="lg"
          label="Nombre"
          value={medidaSeleccionada.nombre}
        />
      </div>

      <Button
        color="green"
        onClick={() => handleSubmit(medidaSeleccionada, "PUT")}
        className="text-base w-36 flex justify-center gap-2 items-center"
      >
        Guardar
        <FaRegSave />
      </Button>
    </form>
  );
};

const Medidas = () => {
  const [medidas, setMedidas] = useState([]);
  const [medidaSeleccionada, setMedidaSeleccionada] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const handleOpen = () => {
    setMedidaSeleccionada(null);
    setOpenModal((cur) => !cur);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nuevaMedida = { ...medidaSeleccionada, [name]: value };
    setMedidaSeleccionada(nuevaMedida);
  };

  const agregarMedida = async (nuevaMedida) => {
    try {
      console.log("Datos de la nueva medida:", nuevaMedida);
      const response = await axios.post(`${URL_API}/medidas`, nuevaMedida);
      console.log("Respuesta del servidor:", response.data);
      listarMedidas();
    } catch (error) {
      console.error("Error al agregar la medida:", error);
    }
  };

  const editarMedida = async (medidaEditada) => {
    try {
      console.log("Datos de la medida editada:", medidaEditada);
      const response = await axios.put(`${URL_API}/medidas/${medidaEditada.id}`, medidaEditada);
      console.log("Respuesta del servidor:", response.data);
      listarMedidas();
    } catch (error) {
      console.error("Error al editar la medida:", error);
    }
  };

  const handleSubmit = (data, method) => {
    if (method === "PUT") {
      editarMedida(data);
    } else {
      agregarMedida(data);
    }
    handleOpen();
  };

  const handleDeleteMedida = async (medidaId) => {
    try {
      const response = await axios.delete(`${URL_API}/medidas/${medidaId}`);
      console.log("Respuesta del servidor:", response.data);
      listarMedidas();
    } catch (error) {
      console.error("Error al eliminar la medida:", error);
    }
  };

  const handleEdit = (medida) => {
    setMedidaSeleccionada(medida);
    setOpenModal((cur) => !cur);
  };

  const listarMedidas = async () => {
    try {
      const response = await axios.get(`${URL_API}/medidas`);
      setMedidas(response.data);
    } catch (error) {
      console.error("Error al obtener los datos de la API:", error);
    }
  };

  useEffect(() => {
    listarMedidas();
  }, []);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = medidas.slice(indexOfFirstItem, indexOfLastItem);

  return ( medidas.length > 0 ? (
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
        {medidaSeleccionada === null ? (
          <NuevaMedidaForm handleChange={handleChange} handleSubmit={handleSubmit} />
        ) : (
          <EditarMedidaForm
            medidaSeleccionada={medidaSeleccionada}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
          />
        )}
      </Dialog>
      <div className="w-full mt-4 grid grid-cols-4">
        <div className="flex bg-white grid-row- justify-between items-center">
            <div className="bg-green-400 w-[40%] h-full grid place-content-center">
                <FaBalanceScale className="text-[8rem] text-white" />
            </div>
            <div className="text-center w-[60%]">
                <h2 className="text-xl text-gray-500 font-semibold">Medidas</h2>
                <span className="text-[5rem] text-gray-500 font-semibold">{medidas.length}</span>
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
            <th>Código</th>
            <th>Nombre</th>
            <th>Acciones</th>
            <th className="rounded-e"></th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((medida, index) => {
            return (
              <tr key={medida.id} className="[&>td]:p-2">
                <td className="text-center">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td className="text-center">{medida.codigo}</td>
                <td className="text-center">{medida.nombre}</td>
                <td className="flex justify-center">
                  <ButtonGroup variant="outlined" className="text-center [&>Button]:text-base">
                    <Button
                      onClick={() => handleEdit(medida)}
                      className="border duration-300 border-green-300 text-green-300 hover:bg-green-300 hover:text-white"
                    >
                      <FiEdit2 />
                    </Button>
                    <Button
                      onClick={() => handleDeleteMedida(medida.id)}
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
        totalProducts={medidas.length}
        productsPerPage={itemsPerPage}
        setCurrentPage={paginate}
        currentPage={currentPage}
      />
    </section> ) : (<Loader />)
  );
};

export default Medidas;
