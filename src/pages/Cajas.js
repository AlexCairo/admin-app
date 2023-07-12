import React, { useState, useEffect } from "react";
import { eliminarCajas } from "../services/CajasService";
import { Input, Textarea, Select, Option, Button, Dialog, ButtonGroup } from "@material-tailwind/react";
import { BiExport } from "react-icons/bi";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { URL_API } from "../helpers/Config";

const Cajas = () => {
  const [cajas, setCajas] = useState([]);
  const [saldoInicial, setSaldoInicial] = useState(0);
  const [sumatoriaIngresos, setSumatoriaIngresos] = useState(0);
  const [sumatoriaGastos, setSumatoriaGastos] = useState(0);
  const [saldoTotal, setSaldoTotal] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedOption, setSelectedOption] = useState("mes");

  const handleOpen = () => setOpenModal((cur) => !cur);

  const handleDeleteCaja = async (id) => {
    try {
      await eliminarCajas(id);
      console.log("Caja eliminada");

      const updatedCajas = cajas.filter((caja) => caja.numero_correlativo !== id);
      setCajas(updatedCajas);
    } catch (error) {
      console.error("Error al eliminar la caja:", error);
    }
  };

  const handleOptionChange = (value) => {
    setSelectedOption(value);
  };

  useEffect(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1;
    const day = selectedDate.getDate();

    let url = `${URL_API}/cajas/${year}`;

    if (selectedOption === "mes") {
      url += `/${month}`;
    } else if (selectedOption === "dia") {
      url += `/${month}/${day}`;
    }

    axios
      .get(url)
      .then((response) => {
        const { reporte, saldoInicial, sumatoria_ingresos, sumatoria_gastos, saldoTotal } = response.data;
        setCajas(reporte);
        setSaldoInicial(saldoInicial);
        setSumatoriaIngresos(sumatoria_ingresos);
        setSumatoriaGastos(sumatoria_gastos);
        setSaldoTotal(saldoTotal);
      })
      .catch((error) => {
        console.error("Error al obtener los datos de la API:", error);
      });
  }, [selectedOption, selectedDate]);

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
          <Select
            label="Reportes"
            value={selectedOption}
            onChange={handleOptionChange}
            className="bg-white"
            size="lg"
          >
            <Option value="anual">Anual</Option>
            <Option value="mes">Mensual</Option>
            <Option value="dia">Diario</Option>
          </Select>
        </div>
        <Button
          ripple="true"
          className="bg-white text-purple-500 duration-300 shadow-none hover:shadow-none hover:bg-purple-800 hover:text-white"
        >
          <BiExport className="text-2xl" />
        </Button>
      </div>
      <Dialog size="lg" open={openModal} handler={handleOpen} className="bg-transparent shadow-none">
        <form className="grid grid-cols-3 gap-6 bg-white p-4 rounded-xl">
          <h2 className="col-span-3 text-center font-medium text-3xl text-[#131422]">Nuevo Producto</h2>
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
        <div>Saldo Inicial: S/ {saldoInicial.toFixed(2)}</div>
        <div>Total Ingresos: S/ {sumatoriaIngresos.toFixed(2)}</div>
        <div>Total Gastos: S/ {sumatoriaGastos.toFixed(2)}</div>
        <div>Saldo Final: S/ {saldoTotal.toFixed(2)}</div>
      </div>
      <table className="table-auto rounded-xl col-span-3 bg-white w-full mt-4">
        <thead>
          <tr className="text-center [&>th]:p-2 bg-[#131422] text-white">
            <th>N°</th>
            <th>Fecha</th>
            <th>Tipo</th>
            <th>Descripcion</th>
            <th>Monto</th>
            <th>Saldo</th>
            <th>Acciones</th>
            <th className="rounded-e"></th>
          </tr>
        </thead>
        <tbody>
          <tr className="[&>td]:p-2">
            <td className="text-center"></td>
            <td className="text-center"></td>
            <td className="text-center"></td>
            <td className="text-center">Por el saldo Inicial</td>
            <td className="text-center"></td>
            <td className="text-center">{saldoInicial.toFixed(2)}</td>
          </tr>
          {cajas.map((caja, index) => {
            const fechaF = new Date(caja.fecha).toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            });
            const montoF = caja.monto.toFixed(2);
            const saldoF = caja.saldo.toFixed(2);

            return (
              <tr key={caja.numero_correlativo} className="[&>td]:p-2">
                <td className="text-center">{index + 1}</td>
                <td className="text-center">{fechaF}</td>
                <td className="text-center">{caja.tipo}</td>
                <td className="text-center">{caja.motivo}</td>
                <td className="text-center">{montoF}</td>
                <td className="text-center">{saldoF}</td>
                <td className="flex justify-center">
                  <ButtonGroup variant="outlined" className="text-center [&>Button]:text-base">
                    <Button className="border duration-300 border-green-300 text-green-300 hover:bg-green-300 hover:text-white">
                      <FiEdit2 />
                    </Button>
                    <Button
                      onClick={() => handleDeleteCaja(caja.numero_correlativo)}
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

export default Cajas;
