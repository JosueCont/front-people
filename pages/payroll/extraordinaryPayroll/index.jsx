import { Breadcrumb } from "antd";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import MainLayout from "../../../layout/MainLayout";
import { withAuthSync } from "../../../libs/auth";

const ExtraordinaryPayroll = ({ ...props }) => {
  const route = useRouter();

  return (
    <MainLayout currentKey={["persons"]} defaultOpenKeys={["people"]}>
      <Breadcrumb>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => route.push({ pathname: "/home/persons/" })}
        >
          Inicio
        </Breadcrumb.Item>
        <Breadcrumb.Item>Nominas extraordinarias</Breadcrumb.Item>
      </Breadcrumb>
      <div className="container" style={{ width: "100%" }}></div>
    </MainLayout>
  );
};

const mapState = (state) => {
  return {
    currentNode: state.userStore.current_node,
  };
};

export default connect(mapState)(withAuthSync(ExtraordinaryPayroll));
