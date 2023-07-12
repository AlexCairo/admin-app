//Pages
import Ventas from "../src/pages/Ventas"
import Dashboard from "../src/pages/Dashboard"
import Compras from "../src/pages/Compras"
import Productos from "../src/pages/Productos"
import Inventarios from "../src/pages/Inventarios"
import Cajas from "../src/pages/Cajas";
import Usuarios from "../src/pages/Usuarios";
import Categorias from "../src/pages/Categorias"
import Marcas from "../src/pages/Marcas"
import Medidas from "../src/pages/Medidas"
import Roles from "../src/pages/Roles"
import Permisos from "../src/pages/Permisos"

//Components
import Sidebar from "./components/Sidebar"

import { Route, BrowserRouter as Router, Routes } from "react-router-dom";


function App() {
  return (
    <Router>
      <Sidebar>
        <Routes>
          <Route path="/" element = {<Dashboard/>} />
          <Route path="/ventas" element = {<Ventas/>} />
          <Route path="/compras" element = {<Compras/>} />
          <Route path="/productos/productos" element = {<Productos/>} />
          <Route path="/productos/categorias" element = {<Categorias/>} />
          <Route path="/productos/marcas" element = {<Marcas/>} />
          <Route path="/productos/medidas" element = {<Medidas/>} />
          <Route path="/inventarios" element = {<Inventarios/>} />
          <Route path="/cajas" element = {<Cajas/>} />
          <Route path="/usuarios/usuarios" element = {<Usuarios/>} />
          <Route path="/usuarios/roles" element = {<Roles/>} />
          <Route path="/usuarios/permisos" element = {<Permisos/>} />
          <Route path="*" element = {<h1>Error 404</h1>} />
        </Routes>
      </Sidebar>
    </Router>
  );
}

export default App;
