import { Assault, Medic, Recon, Robotics } from "./Icons";

const icons = {
  robo: <Robotics className="w-6 h-6" />,
  assault: <Assault className="w-6 h-6" />,
  medic: <Medic className="w-6 h-6" />,
  recon: <Recon className="w-6 h-6" />
};

const ClassIcon = ({ role }) => {
  return icons[role];
};

export default ClassIcon;
