import { Button, Form, Input, message, Modal } from "antd";
import axios from "axios";
import { API_URL } from "../../config/config";

const modalDeleteBusiness = (props) => {
  // console.log("NODE-->> ", props);
  const closeDialog = () => {
    props.close(false);
  };

  const deleteBusiness = () => {
    axios
      .delete(API_URL + "/business/node/" + props.node + "/")
      .then(function (response) {
        message.success("Eliminado con exito.");
        closeDialog();
      })
      .catch(function (error) {
        message.error("Ocurrio un error, intenta de nuevo");
        closeDialog();
        console.log(error);
      });
  };

  return (
    <Modal
      title={`Eliminar ${props.name}`}
      visible={props.visible}
      footer={[
        <Button key="back" onClick={closeDialog}>
          Cancelar
        </Button>,
        <Button type="primary" key="submit" onClick={() => deleteBusiness()}>
          Si, Eliminar
        </Button>,
      ]}
    >
      <div className="float-label">
        <label>¿Está seguro de eliminar esta empresa?</label>
      </div>
    </Modal>
  );
};

export default modalDeleteBusiness;
