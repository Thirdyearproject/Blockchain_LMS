import { NavLink, useLocation } from "react-router-dom";

const SidebarLink = ({ link, isOpen, setIsOpen }) => {
  const Icon = link.icon;
  const location = useLocation();

  const matchRoute = (route) => location.pathname.includes(route);

  return (
    <div onClick={() => setIsOpen(false)}>
      <NavLink
        to={link.path}
        className={`transition-all duration-100 ease-in-out relative rounded-full px-3 py-3 flex items-center gap-4 text-sm font-medium ${
          matchRoute(link.path) ? "bg-blue-100 text-[#1ea9f2]" : ""
        }`}
      >
        <div className="flex items-center gap-5">
          {Icon && (
            <Icon
              className={`text-2xl ${
                matchRoute(link.path) ? "text-[#1ea9f2]" : "text-[#a0afb4]"
              }`}
            />
          )}
          {isOpen && (
            <p
              className={`font-semibold ${
                matchRoute(link.path) ? "text-[#46a7db]" : "text-black"
              }`}
            >
              {link.name}
            </p>
          )}
        </div>
      </NavLink>
    </div>
  );
};

export default SidebarLink;
