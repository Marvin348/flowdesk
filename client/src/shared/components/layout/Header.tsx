import { Menu } from "lucide-react";
import logoBlack from "@/assets/logo-black.svg";

type HeaderProps = {
  onOpen: () => void;
};
const Header = ({ onOpen }: HeaderProps) => {
  return (
    <div className="flex items-center gap-4">
      <button className="lg:hidden" onClick={onOpen}>
        <Menu />
      </button>
      <div className="">
        <img src={logoBlack} alt="FlowDesk" className="w-44" />
      </div>
    </div>
  );
};
export default Header;
