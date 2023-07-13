import React, { useState, useEffect } from "react";
import { Input, Button, Dialog, ButtonGroup } from "@material-tailwind/react";
import { BiExport } from "react-icons/bi";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import axios from "axios";
import { URL_API } from "../helpers/Config";
import { FaRegSave } from "react-icons/fa";

const initValues = {
  dni: "",
  nombre: "",
  celular: "",
  role_id: 1,
  password: "",
  estado: 1,
};

const NuevoUsuarioForm = ({ handleChange, handleSubmit, roles }) => {
  const [nuevoUsuario, setNuevoUsuario] = useState(initValues);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState(nuevoUsuario.estado);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoUsuario((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleEstadoChange = (e) => {
    const value = parseInt(e.target.value);
    setEstadoSeleccionado(value);
    setNuevoUsuario((prevState) => ({ ...prevState, estado: value }));
  };

  return (
    <form className="grid grid-cols-3 gap-6 bg-white p-4 rounded-xl">
      <h2 className="col-span-3 bg-[#131422] rounded-xl p-2 text-center font-medium text-3xl text-white">
        Nuevo Usuario
      </h2>

      <div className="rounded-xl h-12">
        <Input
          onChange={handleInputChange}
          name="dni"
          color="indigo"
          size="lg"
          label="Número de Dni"
          value={nuevoUsuario.dni}
        />
      </div>
      <div className="rounded-xl h-12">
        <Input
          onChange={handleInputChange}
          name="nombre"
          color="indigo"
          size="lg"
          label="Nombre"
          value={nuevoUsuario.nombre}
        />
      </div>
      <div className="rounded-xl h-12">
        <Input
          onChange={handleInputChange}
          name="celular"
          color="indigo"
          size="lg"
          label="Celular"
          value={nuevoUsuario.celular}
        />
      </div>
      <div className="rounded-xl h-12">
        <Input
          onChange={handleInputChange}
          name="password"
          color="indigo"
          size="lg"
          label="Contraseña"
          value={nuevoUsuario.password}
        />
      </div>


      <div className="h-12 text-center rounded-md p-3 bg-gray-100">
        <label>Rol</label>
        <select
          name="role_id"
          className="border border-gray-400 ml-4 w-52 rounded-md text-center"
          onChange={handleInputChange}
          value={nuevoUsuario.role_id}
        >
          {roles.map((rol) => (
            <option value={rol.id} key={rol.id}>
              {rol.nombre}
            </option>
          ))}
        </select>
      </div>
      <Button
        color="green"
        onClick={() => handleSubmit(nuevoUsuario, "POST")}
        className="text-base w-36 flex justify-center gap-2 items-center"
      >
        Guardar
        <FaRegSave />
      </Button>
    </form>
  );
};

const EditarUsuarioForm = ({ usuarioSeleccionado, handleChange, handleSubmit, roles }) => {
  const [estadoSeleccionado, setEstadoSeleccionado] = useState(usuarioSeleccionado.estado);

  const handleEstadoChange = (e) => {
    const value = parseInt(e.target.value);
    setEstadoSeleccionado(value);
    handleChange(e);
  };

  return (
    <form className="grid grid-cols-3 gap-6 bg-white p-4 rounded-xl">
      <h2 className="col-span-3 bg-[#131422] rounded-xl p-2 text-center font-medium text-3xl text-white">
        Editar Usuario
      </h2>
      <div className="rounded-xl h-12">
        <Input
          onChange={handleChange}
          name="dni"
          color="indigo"
          size="lg"
          label="Número de DNI"
          value={usuarioSeleccionado.dni}
        />
      </div>
      <div className="rounded-xl h-12">
        <Input
          onChange={handleChange}
          name="nombre"
          color="indigo"
          size="lg"
          label="Nombre"
          value={usuarioSeleccionado.nombre}
        />
      </div>
      <div className="rounded-xl h-12">
        <Input
          onChange={handleChange}
          name="celular"
          color="indigo"
          size="lg"
          label="Celular"
          value={usuarioSeleccionado.celular}
        />
      </div>
      <div className="rounded-xl h-12">
        <Input
          onChange={handleChange}
          name="password"
          color="indigo"
          size="lg"
          label="Contraseña"
          value={usuarioSeleccionado.password}
        />
      </div>

      <div className="h-12 text-center rounded-md p-3 bg-gray-100">
        <label>Rol</label>
        <select
          name="role_id"
          className="border border-gray-400 ml-4 w-52 rounded-md text-center"
          onChange={handleChange}
          value={usuarioSeleccionado.role_id}
        >
          {roles.map((rol) => (
            <option value={rol.id} key={rol.id}>
              {rol.nombre}
            </option>
          ))}
        </select>
      </div>
      <div className="h-12 text-center rounded-md p-3 bg-gray-100">
        <label>Estado</label>
        <select
          name="estado"
          className="border border-gray-400 ml-4 w-52 rounded-md text-center"
          onChange={handleEstadoChange}
          value={estadoSeleccionado}
        >
          <option value={1}>Activado</option>
          <option value={0}>Desactivado</option>
        </select>
      </div>
      <Button
        color="green"
        onClick={() => handleSubmit(usuarioSeleccionado, "PUT")}
        className="text-base w-36 flex justify-center gap-2 items-center"
      >
        Guardar
        <FaRegSave />
      </Button>
    </form>
  );
};

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const handleOpen = () => {
    setUsuarioSeleccionado(null);
    setOpenModal((cur) => !cur);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nDatos = { ...usuarioSeleccionado, [name]: name === "estado" ? parseInt(value) : value };
    setUsuarioSeleccionado(nDatos);
  };

  const agregarUsuario = async (nuevoUsuario) => {
    try {
      console.log("Datos del nuevo usuario:", nuevoUsuario);
      const response = await axios.post(`${URL_API}/users`, nuevoUsuario);
      console.log("Respuesta del servidor:", response.data);
      listarUsuarios();
    } catch (error) {
      console.error("Error al agregar el usuario:", error);
    }
  };

  const editarUsuario = async (usuarioEditado) => {
    try {
      console.log("Datos del usuario editado:", usuarioEditado);
      const response = await axios.put(`${URL_API}/users/${usuarioEditado.id}`, usuarioEditado);
      console.log("Respuesta del servidor:", response.data);
      listarUsuarios();
    } catch (error) {
      console.error("Error al editar el usuario:", error);
    }
  };

  const handleSubmit = (data, method) => {
    if (method === "PUT") {
      editarUsuario(data);
    } else {
      agregarUsuario(data);
    }
    handleOpen();
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await axios.delete(`${URL_API}/users/${userId}`);
      console.log("Respuesta del servidor:", response.data);
      listarUsuarios();
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
    }
  };

  const handleEdit = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setOpenModal((cur) => !cur);
  };

  const listarUsuarios = () => {
    let url = `${URL_API}/users`;

    axios
      .get(url)
      .then((response) => {
        setUsuarios(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los datos de la API:", error);
      });
  };

  useEffect(() => {
    listarUsuarios();
  }, []);

  useEffect(() => {
    let url = `${URL_API}/roles`;

    axios
      .get(url)
      .then((response) => {
        setRoles(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los datos de la API:", error);
      });
  }, []);

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
        {usuarioSeleccionado === null ? (
          <NuevoUsuarioForm handleChange={handleChange} handleSubmit={handleSubmit} roles={roles} />
        ) : (
          <EditarUsuarioForm
            usuarioSeleccionado={usuarioSeleccionado}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            roles={roles}
          />
        )}
      </Dialog>
      <div className="w-full bg-blank p-9 rounded-xl">
        <div>Esta info va en cuadritos como dashboard</div>
        <div>Cantidad Usuarios: {usuarios.length}</div>
      </div>
      <table className="table-auto rounded-xl col-span-3 bg-white w-full mt-4">
        <thead>
          <tr className="text-center [&>th]:p-2 bg-[#131422] text-white">
            <th>N°</th>
            <th>DNI</th>
            <th>Nombre</th>
            <th>Rol</th>
            <th>Celular</th>
            <th>Estado</th>
            <th>Acciones</th>
            <th className="rounded-e"></th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario, index) => {
            return (
              <tr key={usuario.id} className="[&>td]:p-2">
                <td className="text-center">{index + 1}</td>
                <td className="text-center">{usuario.dni}</td>
                <td className="text-center">{usuario.nombre}</td>
                <td className="text-center">{usuario.nombreRol}</td>
                <td className="text-center">{usuario.celular}</td>
                <td className="text-center">{usuario.estado}</td>
                <td className="flex justify-center">
                  <ButtonGroup variant="outlined" className="text-center [&>Button]:text-base">
                    <Button
                      onClick={() => handleEdit(usuario)}
                      className="border duration-300 border-green-300 text-green-300 hover:bg-green-300 hover:text-white"
                    >
                      <FiEdit2 />
                    </Button>
                    <Button
                      onClick={() => handleDeleteUser(usuario.id)}
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
    </section>
  );
};

export default Usuarios;
