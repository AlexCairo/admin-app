import React, { useState, useEffect } from "react";
import { eliminarCajas } from "../services/CajasService";
import { Input, Textarea, Select, Option, Button, Dialog, ButtonGroup } from "@material-tailwind/react";
import { BiExport } from "react-icons/bi";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { URL_API } from "../helpers/Config";

const Permisos = () => {
  const [permisos, setPermisos] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const handleOpen = () => setOpenModal((cur) => !cur);


  useEffect(() => {
    let url = `${URL_API}/permisos`;

    axios
      .get(url)
      .then((response) => {
        setPermisos(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los datos de la API:", error);
      });
  }, []);

  const DateInput = React.forwardRef(({ value, onClick }, ref) => (
    <button className="example-custom-input" onClick={onClick} ref={ref}>
      {value}
    </button>
  ));

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
        <form className="grid grid-cols-3 gap-6 bg-white p-4 rounded-xl">
          <h2 className="col-span-3 text-center font-medium text-3xl text-[#131422]">Nuevo Usuario</h2>
          <div className="rounded-xl h-12">
            <Input color="indigo" size="lg" label="Nombre" />
          </div>
          <div className="rounded-xl h-12 row-span-2">
            <Textarea color="indigo" size="lg" label="Descripción" />
          </div>
        </form>
      </Dialog>
      <div className="w-full bg-blank p-9 rounded-xl">
        <div>Esta info va en cuadritos como dashboard</div>
        <div>Cantidad Permisos: {permisos.length}</div>
      </div>
      <table className="table-auto rounded-xl col-span-3 bg-white w-full mt-4">
        <thead>
          <tr className="text-center [&>th]:p-2 bg-[#131422] text-white">
            <th>N°</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Estado</th>
            <th>Acciones</th>
            <th className="rounded-e"></th>
          </tr>
        </thead>
        <tbody>
          {permisos.map((permiso, index) => {
            return (
              <tr key={permiso.id} className="[&>td]:p-2">
                <td className="text-center">{index + 1}</td>
                <td className="text-center">{permiso.nombre}</td>
                <td className="text-center">{permiso.descripcion}</td>
                <td className="text-center">{permiso.estado}</td>
                <td className="flex justify-center">
                  <ButtonGroup variant="outlined" className="text-center [&>Button]:text-base">
                    <Button className="border duration-300 border-green-300 text-green-300 hover:bg-green-300 hover:text-white">
                      <FiEdit2 />
                    </Button>
                    <Button
                      /* onClick={() => handleDeleteCaja(caja.numero_correlativo)} */
                      className="border duration-300 border-red-300  text-red-300 hover:bg-red-300 hover:text-white"
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

export default Permisos;
