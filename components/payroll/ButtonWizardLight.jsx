import {useState} from "react";
import {connect} from "react-redux";
import {withAuthSync} from "../../libs/auth";
import {DownloadOutlined, InfoCircleOutlined} from "@ant-design/icons";
import {Button, Modal, Steps, Row, Col} from "antd";



const ButtonWizardLight=()=>{

    const [isModalOpen, setIsModalOpen] = useState(false);
    const description  = "hola"

    const showModal = () => {
        setIsModalOpen(true);
    };


    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

      return (
          <>
              <Button type="primary" onClick={showModal}>
                  Open Modal
              </Button>
              <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                  <p>Some contents...</p>
                  <p>Some contents...</p>
                  <p>Some contents...</p>
              </Modal>
          </>

      )
}


export default ButtonWizardLight;
