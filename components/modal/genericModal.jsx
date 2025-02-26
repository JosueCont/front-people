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
  closeButton = "Cancelar",
  maskClosable = true,
  viewActionButtonCancell = true,
  disabledSave = false,
}) => {
  return (
    <Modal
      maskClosable={maskClosable}
      visible={visible}
      footer={
        <Col>
          <Space>
            {viewActionButtonCancell && (
              <Button
                size="large"
                htmlType="button"
                onClick={() => setVisible(false)}
                style={{ paddingLeft: 50, paddingRight: 50 }}
              >
                {closeButton}
              </Button>
            )}

            {viewActionButton && (
              <Button
                size="large"
                htmlType="button"
                onClick={actionButton}
                style={{ paddingLeft: 50, paddingRight: 50 }}
                disabled={disabledSave}
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
