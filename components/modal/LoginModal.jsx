import { Modal, Layout } from "antd";
import LoginForm from "../LoginForm";

const LoginModal = ({
  title = "",
  setPerson,
  visible = false,
  setModal,
  setKhonnectId = false,
  ...props
}) => {
  return (
    <Layout>
      <Modal
        maskClosable={false}
        title={title}
        centered
        visible={visible}
        onCancel={() => setModal(false)}
        footer={null}
        width={"30%"}
      >
        <LoginForm recoveryPsw={false} setKhonnectId={setKhonnectId} />
      </Modal>
    </Layout>
  );
};

export default LoginModal;
