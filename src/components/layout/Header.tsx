import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

type HeaderProps = {
  onOpen: () => void;
};
const Header = ({ onOpen }: HeaderProps) => {
  return (
    <div className="flex items-center">
      <div>
        <Button className="lg:hidden" onClick={onOpen}>
          <Menu />
        </Button>
        <h2 className="font-bold text-2xl">FlowDesk</h2>
      </div>
    </div>
  );
};
export default Header;
