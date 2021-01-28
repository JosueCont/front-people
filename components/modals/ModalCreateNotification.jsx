import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  Row,
  Col,
  Button,
  Typography,
  Form,
  Input,
  Modal,
  notification,
} from "antd";
import { injectIntl } from "react-intl";
import { FormattedMessage } from "react-intl";
import { useRouter } from "next/router";
import axiosApi from "../../libs/axiosApi";

const ModalCreateNotification = forwardRef((props, ref) => {
  const router = useRouter();
  const { Title } = Typography;
  const [form] = Form.useForm();

  /* const [loading, setLoading] = useState(false); */
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useImperativeHandle(ref, () => ({
    getAlert() {
      alert("getAlert from Child");
    },

    showModal() {
      setVisible(true);
    },
  }));

  const handleOk = (values) => {
    form.submit();
  };

  const onReset = () => {
    form.resetFields();
  };

  const submitForm = async (values) => {
    values["created_by"] = "d25d4447bbd5423bbf2d5603cf553b81";
    try {
      let response = await axiosApi.post(`/noticenter/notification/`, values);
      let data = response.data;
      onReset();
      setVisible(false);
      notification["success"]({
        message: "Notification Title",
        description:
          "This is the content of the notification. This is the content of the notification. This is the content of the notification.",
      });
      props.reloadData();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setVisible(false);
    onReset();
  };

  return (
    <Modal
      visible={visible}
      title="Title"
      footer={[
        <Button key="back" onClick={handleCancel}>
          Return
        </Button>,
        <Button
          key="submit"
          loading={loading}
          type="primary"
          onClick={handleOk}
        >
          Submit
        </Button>,
      ]}
    >
      <Form layout={"vertical"} form={form} onFinish={submitForm}>
        <Form.Item label="Titulo" name="title">
          <Input className={"formItemPayment"} />
        </Form.Item>
        <Form.Item label="Mensaje" name="message">
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default ModalCreateNotification;
