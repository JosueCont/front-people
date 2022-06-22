import { Button, Col, Modal, Space } from "antd";

const GenericModal = ({
  setVisible,
  visible = false,
  width = "50%",
  title = "Ejemplo",
  children,
  actionButton,
  titleActionButton = "Aceptar",
  viewActionButton = true,
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
              Cancelar
            </Button>

            {viewActionButton && (
              <Button
                size="large"
                htmlType="button"
                onClick={actionButton}
                style={{ paddingLeft: 50, paddingRight: 50 }}
              >
                {titleActionButton}
              </Button>
            )}
          </Space>
        </Col>
      }
      width={width}
      centered={true}
      onCancel={() => setVisible(false)}
      title={title}
    >
      {children}
    </Modal>
  );
};

export default GenericModal;
