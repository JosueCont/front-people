import React, { useState } from "react";
import { Button, Form, Input, message, Modal } from "antd";
import axios from "axios";
import { API_URL } from "../../config/config";

const modalDeleteBusiness = (props) => {
    const [loading,setLoading]=useState(false)
  const closeDialog = () => {
    props.close(false);
  };

  const deleteBusiness = () => {
      setLoading(true)
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
      }).finally(()=> setLoading(false));
  };

  return (
    <Modal
      title={`Eliminar ${props.name}`}
      visible={props.visible}
      footer={[
        <Button key="back" disabled={loading} onClick={closeDialog}>
          Cancelar
        </Button>,
        <Button type="primary"  loading={loading} key="submit" onClick={() => deleteBusiness()}>
          Si, Eliminar
        </Button>,
      ]}
    >
      ¿Está seguro de eliminar esta empresa?
    </Modal>
  );
};

export default modalDeleteBusiness;
