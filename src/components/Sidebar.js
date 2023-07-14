import { NavLink } from "react-router-dom";
import { FaBars, FaUsers, FaCashRegister, FaCartArrowDown, FaUser, FaBalanceScale } from "react-icons/fa";
import { BiSolidTrafficBarrier, BiSolidDashboard, BiSolidCategoryAlt, BiSearch } from "react-icons/bi";
import { MdInventory } from "react-icons/md"
import { BsFillBookmarkCheckFill, BsPersonRolodex } from "react-icons/bs";
import { HiRectangleStack } from "react-icons/hi2";
import { TbBottleFilled } from "react-icons/tb";
import { FcSalesPerformance } from "react-icons/fc";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SidebarMenu from "../components/SidebarMenu";
import { listaProductos } from "../services/ProductosService";
import "../components/Sidebar.css"
import Loader from "../components/Loader";

const routes = [
  {
    path: "/",
    name: "Dashboard",
    icon: <BiSolidDashboard />,
  },
  {
    path: "/ventas",
    name: "Ventas",
    icon: <FcSalesPerformance />,
  },
  {
    path: "/compras",
    name: "Compras",
    icon: <FaCartArrowDown />,
  },
  {
    path: "/productos",
    name: "Productos",
    icon: <HiRectangleStack />,
    subRoutes: [
      {
        path: "/productos/productos",
        name: "Productos ",
        icon: <TbBottleFilled />,
      },
      {
        path: "/productos/categorias",
        name: "Categorias",
        icon: <BiSolidCategoryAlt />,
      },
      {
        path: "/productos/marcas",
        name: "Marcas",
        icon: <BsFillBookmarkCheckFill />,
      },
      {
        path: "/productos/medidas",
        name: "Medidas",
        icon: <FaBalanceScale />,
      },
    ],
  },
  {
    path: "/inventarios",
    name: "Inventarios",
    icon: <MdInventory />,
  },
  {
    path: "/cajas",
    name: "Cajas",
    icon: <FaCashRegister />,
  },
  {
    name: "Usuarios",
    icon: <FaUsers />,
    exact: true,
    subRoutes: [
      {
        path: "/usuarios/usuarios",
        name: "Usuarios ",
        icon: <FaUser />,
      },
      {
        path: "/usuarios/roles",
        name: "Roles",
        icon: <BsPersonRolodex />,
      },
      {
        path: "/usuarios/permisos",
        name: "Permisos",
        icon: <BiSolidTrafficBarrier />,
      },
    ],
  },
];

const SideBar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [listaDeProductos, setListaDeProductos] = useState([]);

  const listadoDeProductos = async () => {
      const result = await listaProductos();
      setListaDeProductos(result.data);
  };

  useEffect(()=>{
    listadoDeProductos();
  },[]);

  const toggle = () => setIsOpen(!isOpen);
 
  const showAnimation = {
    hidden: {
      width: 0,
      opacity: 0,
      transition: {
        duration: 0.5,
      },
    },
    show: {
      opacity: 1,
      width: "auto",
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <>
      <div className="main-container">
        <motion.div
          animate={{
            width: isOpen ? "250px" : "60px",

            transition: {
              duration: 0.5,
              type: "spring",
              damping: 10,
            },
          }}
          className={`sidebar`}
        >
          <div className="top_section">
            <AnimatePresence>
              {isOpen && (
                <motion.h1
                  variants={showAnimation}
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  className="logo"
                >
                  Nicoll
                </motion.h1>
              )}
            </AnimatePresence>
            <div className="bars">
              <FaBars onClick={toggle} />
            </div>
          </div>
          <section className="routes">
            {routes.map((route, index) => {
              if (route.subRoutes) {
                return (
                  <SidebarMenu
                    toggle={toggle}
                    key={index}
                    setIsOpen={setIsOpen}
                    route={route}
                    showAnimation={showAnimation}
                    isOpen={isOpen}
                  />
                );
              }

              return (
                <NavLink
                  to={route.path}
                  key={index}
                  className="link"
                  onClick={toggle}
                  activeclassname="active"
                >
                  <div className="icon">{route.icon}</div>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        variants={showAnimation}
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                        className="link_text"
                      >
                        {route.name}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </NavLink>
              );
            })}
          </section>
        </motion.div>
        <main className="bg-[#E9F4F2] w-screen h-screen p-7">
          {listaDeProductos.length > 0 ? children : <><Loader /></>}
        </main>
      </div>
    </>
  );
};

export default SideBar;