import { useEffect, useState } from "react";
import { obtenerDashboard } from "../services/Dashboard";
import { TbBottle } from "react-icons/tb";
import { BsFillBagCheckFill } from "react-icons/bs";
import { RiShoppingCartLine } from "react-icons/ri";
import Loader from "../components/Loader";


const Dashboard = () => {

    const [dashboard, setDashboard] = useState([]);

    const getDashboard = async() => {
        const result = await obtenerDashboard();
        setDashboard(result.data);
    };

    useEffect(()=>{
        getDashboard();
    },[])

    return( dashboard.productos ? (
        <section className="grid grid-cols-4 gap-4">
            <div className="flex bg-white grid-row- justify-between items-center">
                <div className="bg-red-400 w-[40%] h-full grid place-content-center">
                    <TbBottle className="text-[8rem] text-white" />
                </div>
                <div className="text-center w-[60%]">
                    <h2 className="text-xl text-gray-500 font-semibold">Productos</h2>
                    <span className="text-[5rem] text-gray-500 font-semibold">{dashboard.productos}</span>
                </div>
            </div>
            <div className="flex bg-white grid-row- justify-between items-center">
                <div className="bg-green-400 w-[40%] h-full grid place-content-center">
                    <BsFillBagCheckFill className="text-[8rem] text-white" />
                </div>
                <div className="text-center w-[60%]">
                    <h2 className="text-xl text-gray-500 font-semibold">Total de Ventas Histórico</h2>
                    <span className="text-[5rem] text-gray-500 font-semibold">{`S/${Math.trunc(dashboard.totalVentasHistorico)}`}</span>
                </div>
            </div>
            <div className="flex bg-white grid-row- justify-between items-center col-span-2">
                <div className="bg-orange-400 w-[30%] h-full grid place-content-center">
                    <RiShoppingCartLine className="text-[8rem] text-white" />
                </div>
                <div className="text-center w-[70%]">
                    <h2 className="text-xl text-gray-500 font-semibold">Total de Compras Histórico</h2>
                    <span className="text-[5rem] text-gray-500 font-semibold">{`S/${Math.trunc(dashboard.totalComprasHistorico)}`}</span>
                </div>
            </div>
            <div className="flex bg-white grid-row- justify-between items-center">
                <div className="bg-purple-400 w-[40%] h-full grid place-content-center">
                    <RiShoppingCartLine className="text-[8rem] text-white" />
                </div>
                <div className="text-center w-[60%]">
                    <h2 className="text-xl text-gray-500 font-semibold">Total de Ventas del Mes</h2>
                    <span className="text-[5rem] text-gray-500 font-semibold">{`S/${Math.trunc(dashboard.totalVentasMes)}`}</span>
                </div>
            </div>
            <div className="flex bg-white grid-row- justify-between items-center col-span-2">
                <div className="bg-pink-400 w-[30%] h-full grid place-content-center">
                    <RiShoppingCartLine className="text-[8rem] text-white" />
                </div>
                <div className="text-center w-[70%]">
                    <h2 className="text-xl text-gray-500 font-semibold">Total de Compras del Mes</h2>
                    <span className="text-[5rem] text-gray-500 font-semibold">{`S/${Math.trunc(dashboard.totalComprasMes)}`}</span>
                </div>
            </div>
            <div className="flex bg-white grid-row- justify-between items-center">
                <div className="bg-blue-400 w-[40%] h-full grid place-content-center">
                    <RiShoppingCartLine className="text-[8rem] text-white" />
                </div>
                <div className="text-center w-[60%]">
                    <h2 className="text-xl text-gray-500 font-semibold">Total de Ventas del día</h2>
                    <span className="text-[5rem] text-gray-500 font-semibold">{`S/${Math.trunc(dashboard.totalVentasDia)}`}</span>
                </div>
            </div>
            <div className="flex bg-white grid-row- justify-around items-center">
                <div className="bg-blue-gray-400 w-[40%] h-full grid place-content-center">
                    <RiShoppingCartLine className="text-[8rem] text-white" />
                </div>
                <div className="text-center w-[60%]">
                    <h2 className="text-xl text-gray-500 font-semibold">Total de Compras del día</h2>
                    <span className="text-[5rem] text-gray-500 font-semibold">{`S/${Math.trunc(dashboard.totalComprasDia)}`}</span>
                </div>
            </div>
            {/* <div className="">
                <div className="">
                    <RiShoppingCartLine className="text-[8rem] text-white" />
                </div>
                <div className="">
                    <h2 className="text-xl text-gray-500 font-semiboldl de Compras del Mes</h2>
                    <span className="text-[5rem] text-gray-500 font-semibold">{`S/${Math.trunc(dashboard.totalVentasDia)}`}</span>
                </div>
            </div> */}
        </section>) : (<Loader/>)
    )
}

export default Dashboard;