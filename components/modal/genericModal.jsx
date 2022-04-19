import { Button, Col, Modal, Space } from "antd";

const GenericModal = ({
  setVisible,
  visible = false,
  width = "50%",
  title = "Ejemplo",
  content,
  actionButton,
  titleActionButton = "Aceptar",
}) => {
  return (
    <Modal
      visible={visible}
      footer={
        <Col>
          <Space>
            <Button
              size="large"
              htmlType="button"
              onClick={() => setVisible(false)}
              style={{ paddingLeft: 50, paddingRight: 50 }}
            >
              Cerrar
            </Button>

            <Button
              size="large"
              htmlType="button"
              onClick={actionButton}
              style={{ paddingLeft: 50, paddingRight: 50 }}
            >
              {titleActionButton}
            </Button>
          </Space>
        </Col>
      }
      width={width}
      centered={true}
      onCancel={() => setVisible(false)}
      title={title}
    >
      {content}
    </Modal>
  );
};

export default GenericModal;
