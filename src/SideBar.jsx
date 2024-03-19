import React,{ useState, useEffect } from "react";
import "boxicons";
import "./SideBar.css";
import { useNavigate } from "react-router-dom";

const SideBar = ({index, hovered, setHovered}) => {
  const useMediaQuery = (query) => {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
      const media = window.matchMedia(query);
      if (media.matches !== matches) {
        setMatches(media.matches);
      }
      const listener = () => setMatches(media.matches);
      window.addEventListener("resize", listener);
      return () => window.removeEventListener("resize", listener);
    }, [matches, query]);

    return matches;
  };
  const navigate = useNavigate();

  let menuItems = [
    {
      name: "Home",
      iconName: "home",
      type: "solid",
      onClick: () => navigate("/"),
    },
    {
      name: "Invoices",
      iconName: "copy",
      type: "solid",
      onClick: () => navigate("/invoices"),
    },
    {
      name: "Inventory",
      iconName: "cart-alt",
      type: "solid",
      onClick: () => navigate("/inventory"),
    },
    {
      name: "Books",
      iconName: "book",
      type: "solid",
      onClick: () => navigate("/books"),
    },
    {
      name: "Customers",
      iconName: "group",
      type: "solid",
      onClick: () => navigate("/customers"),
    },
    {
      name: "Products",
      iconName: "package",
      type: "solid",
      onClick: () => navigate("/products"),
    },
  ];
  const [active, setActive] = useState(index);
  const [animate, setAnimate] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const changeSmall = useMediaQuery("(max-height: 550px)");
  let delay = 1;
  useEffect(() => {
    setAnimate(true);
    let timer = setTimeout(() => setAnimate(false), delay * 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [active, delay]);

  return (
    <div className={`sidebar expanded`} onMouseEnter={() => setExpanded(true)} onMouseLeave={() => setExpanded(false)}>
      {menuItems.map((item, index) => {
        return (
          <div
            className={`boxicon-container expanded-boxicon-container `}
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => {
                setActive(index);
                item.onClick();
            }}
            key={index}
          >
            <box-icon
              class={`boxicon
                      ${active === index && "active"}
                      `}
              size={"sm"}
              name={item.iconName}
              type={item.type}
              color={
                hovered === index || active === index ? "white" : item.color
              }
              animation={active === index && animate ? "tada" : ""}
            ></box-icon>
            <p
              className={`description show-description 
            ${hovered === index && "color-text"}
            ${active === index && "active-description"}`}
            >
              {item.name}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default SideBar;
