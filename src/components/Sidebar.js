import { NavLink } from "react-router-dom";
import { FaBars, FaUsers, FaCashRegister, FaCartArrowDown, FaUser, FaBalanceScale } from "react-icons/fa";
import { BiSolidTrafficBarrier, BiSolidDashboard, BiSolidCategoryAlt, BiSearch } from "react-icons/bi";
import { MdInventory } from "react-icons/md"
import { BsFillBookmarkCheckFill, BsPersonRolodex } from "react-icons/bs";
import { HiRectangleStack } from "react-icons/hi2";
import { TbBottleFilled } from "react-icons/tb";
import { FcSalesPerformance } from "react-icons/fc";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SidebarMenu from "../components/SidebarMenu";
import "../components/Sidebar.css"
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
    path: "/inventario",
    name: "Inventario",
    icon: <MdInventory />,
  },
  {
    path: "/cajas",
    name: "Caja",
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
  const toggle = () => setIsOpen(!isOpen);
  const inputAnimation = {
    hidden: {
      width: 0,
      padding: 0,
      transition: {
        duration: 0.2,
      },
    },
    show: {
      width: "230px",
      padding: "5px 15px",
      transition: {
        duration: 0.2,
      },
    },
  };

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
            width: isOpen ? "300px" : "50px",

            transition: {
              duration: 0.5,
              type: "spring",
              damping: 10,
            },
          }}
          className={`sidebar `}
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
          <div className="search">
            <div className="search_icon">
              <BiSearch />
            </div>
            <AnimatePresence>
              {isOpen && (
                <motion.input
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  variants={inputAnimation}
                  type="text"
                  placeholder="Search"
                />
              )}
            </AnimatePresence>
          </div>
          <section className="routes">
            {routes.map((route, index) => {
              if (route.subRoutes) {
                return (
                  <SidebarMenu
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
                  activeClassName="active"
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

        <main>{children}</main>
      </div>
    </>
  );
};

export default SideBar;