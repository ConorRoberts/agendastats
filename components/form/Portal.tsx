import ReactDOM from "react-dom";

const Portal = ({ children }: any) => {
  return ReactDOM.createPortal(children, document.getElementById("app"));
};

export default Portal;
