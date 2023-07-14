import React, { useState, useEffect } from 'react';
import imagen from '../ositoperu.jpg';
import { URL_API } from "../helpers/Config";

const Dashboard = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch(`${URL_API}/dashboard`);
            const jsonData = await response.json();
            setData(jsonData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <div>
            <h1>Dashboard Page</h1>
            

            {data && (
                <div>
                    <h2>Pa Graficar</h2>
                    <p>Productos: {data.productos}</p>
                    <p>Usuarios: {data.usuarios}</p>
                    <p>Total Ventas Histórico: {data.totalVentasHistorico}</p>
                    <p>Total Compras Histórico: {data.totalComprasHistorico}</p>
                    <p>Total Ventas Mes: {data.totalVentasMes}</p>
                    <p>Total Compras Mes: {data.totalComprasMes}</p>
                    <p>Total Ventas Día: {data.totalVentasDia}</p>
                    <p>Total Compras Día: {data.totalComprasDia}</p>
                    {data.meses && data.meses.length > 0 && (
                        <div>
                            <h3>Grafico de ventas por Meses:</h3>
                            <ul>
                                {data.meses.map((item, index) => (
                                    <li key={index}>{item.Total} - {item.mes}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
            <img src={imagen} alt="Soy Osito Perú" />
        </div>
        
    );
}

export default Dashboard;
