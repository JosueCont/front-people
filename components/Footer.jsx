import { Layout } from "antd";
import { DingtalkOutlined } from "@ant-design/icons";

const { Footer } = Layout;

export default function FooterCustom() {
  return (
    <>
      <Footer
        style={{
          textAlign: "center",
          zIndex: 1,
          bottom: 0,
          width: "100%",
        }}
      ></Footer>
    </>
  );
}
