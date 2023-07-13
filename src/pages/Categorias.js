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
  descripcion: "",
};

const NuevaCategoriaForm = ({ handleChange, handleSubmit }) => {
  const [nuevaCategoria, setNuevaCategoria] = useState(initValues);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevaCategoria((prevState) => ({ ...prevState, [name]: value }));
  };

  return (
    <form className="grid grid-cols-3 gap-6 bg-white p-4 rounded-xl">
      <h2 className="col-span-3 bg-[#131422] rounded-xl p-2 text-center font-medium text-3xl text-white">
        Nueva Categoría
      </h2>

      <div className="rounded-xl h-12">
        <Input
          onChange={handleInputChange}
          name="nombre"
          color="indigo"
          size="lg"
          label="Nombre"
          value={nuevaCategoria.nombre}
        />
      </div>
      <div className="rounded-xl h-12">
        <Input
          onChange={handleInputChange}
          name="descripcion"
          color="indigo"
          size="lg"
          label="Descripción"
          value={nuevaCategoria.descripcion}
        />
      </div>

      <Button
        color="green"
        onClick={() => handleSubmit(nuevaCategoria, "POST")}
        className="text-base w-36 flex justify-center gap-2 items-center"
      >
        Guardar
        <FaRegSave />
      </Button>
    </form>
  );
};

const EditarCategoriaForm = ({ categoriaSeleccionada, handleChange, handleSubmit }) => {
  return (
    <form className="grid grid-cols-3 gap-6 bg-white p-4 rounded-xl">
      <h2 className="col-span-3 bg-[#131422] rounded-xl p-2 text-center font-medium text-3xl text-white">
        Editar Categoría
      </h2>
      <div className="rounded-xl h-12">
        <Input
          onChange={handleChange}
          name="nombre"
          color="indigo"
          size="lg"
          label="Nombre"
          value={categoriaSeleccionada.nombre}
        />
      </div>
      <div className="rounded-xl h-12">
        <Input
          onChange={handleChange}
          name="descripcion"
          color="indigo"
          size="lg"
          label="Descripción"
          value={categoriaSeleccionada.descripcion}
        />
      </div>

      <Button
        color="green"
        onClick={() => handleSubmit(categoriaSeleccionada, "PUT")}
        className="text-base w-36 flex justify-center gap-2 items-center"
      >
        Guardar
        <FaRegSave />
      </Button>
    </form>
  );
};

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const handleOpen = () => {
    setCategoriaSeleccionada(null);
    setOpenModal((cur) => !cur);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nuevaCategoria = { ...categoriaSeleccionada, [name]: value };
    setCategoriaSeleccionada(nuevaCategoria);
  };

  const agregarCategoria = async (nuevaCategoria) => {
    try {
      console.log("Datos de la nueva categoría:", nuevaCategoria);
      const response = await axios.post(`${URL_API}/categorias`, nuevaCategoria);
      console.log("Respuesta del servidor:", response.data);
      listarCategorias();
    } catch (error) {
      console.error("Error al agregar la categoría:", error);
    }
  };

  const editarCategoria = async (categoriaEditada) => {
    try {
      console.log("Datos de la categoría editada:", categoriaEditada);
      const response = await axios.put(`${URL_API}/categorias/${categoriaEditada.id}`, categoriaEditada);
      console.log("Respuesta del servidor:", response.data);
      listarCategorias();
    } catch (error) {
      console.error("Error al editar la categoría:", error);
    }
  };

  const handleSubmit = (data, method) => {
    if (method === "PUT") {
      editarCategoria(data);
    } else {
      agregarCategoria(data);
    }
    handleOpen();
  };

  const handleDeleteCategoria = async (categoriaId) => {
    try {
      const response = await axios.delete(`${URL_API}/categorias/${categoriaId}`);
      console.log("Respuesta del servidor:", response.data);
      listarCategorias();
    } catch (error) {
      console.error("Error al eliminar la categoría:", error);
    }
  };

  const handleEdit = (categoria) => {
    setCategoriaSeleccionada(categoria);
    setOpenModal((cur) => !cur);
  };

  const listarCategorias = async () => {
    try {
      const response = await axios.get(`${URL_API}/categorias`);
      setCategorias(response.data);
    } catch (error) {
      console.error("Error al obtener los datos de la API:", error);
    }
  };

  useEffect(() => {
    listarCategorias();
  }, []);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = categorias.slice(indexOfFirstItem, indexOfLastItem);

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
        {categoriaSeleccionada === null ? (
          <NuevaCategoriaForm handleChange={handleChange} handleSubmit={handleSubmit} />
        ) : (
          <EditarCategoriaForm
            categoriaSeleccionada={categoriaSeleccionada}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
          />
        )}
      </Dialog>
      <div className="w-full bg-blank p-9 rounded-xl">
        <div>Esta info va en cuadritos como dashboard</div>
        <div>Cantidad Categorías: {categorias.length}</div>
      </div>
      <table className="table-auto rounded-xl col-span-3 bg-white w-full mt-4">
        <thead>
          <tr className="text-center [&>th]:p-2 bg-[#131422] text-white">
            <th>N°</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Acciones</th>
            <th className="rounded-e"></th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((categoria, index) => {
            return (
              <tr key={categoria.id} className="[&>td]:p-2">
                <td className="text-center">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td className="text-center">{categoria.nombre}</td>
                <td className="text-center">{categoria.descripcion}</td>
                <td className="flex justify-center">
                  <ButtonGroup variant="outlined" className="text-center [&>Button]:text-base">
                    <Button
                      onClick={() => handleEdit(categoria)}
                      className="border duration-300 border-green-300 text-green-300 hover:bg-green-300 hover:text-white"
                    >
                      <FiEdit2 />
                    </Button>
                    <Button
                      onClick={() => handleDeleteCategoria(categoria.id)}
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
        totalProducts={categorias.length}
        productsPerPage={itemsPerPage}
        setCurrentPage={paginate}
        currentPage={currentPage}
      />
    </section>
  );
};

export default Categorias;
