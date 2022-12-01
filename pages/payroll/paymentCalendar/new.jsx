import React from "react";
import MainLayout from "../../../layout/MainLayout";
import { Row, Col } from "antd";
import { useRouter } from "next/router";
import FormPaymentCalendar from "../../../components/payroll/forms/FormPaymentCalendar";
import { connect } from "react-redux";

const NewPaymentCalendar = ({ ...props }) => {
  const route = useRouter();
  return (
    <>
      <MainLayout currentKey={["paymentCalendar"]} defaultOpenKeys={["managementRH","payroll"]}>
        <div
          className="container-border-radius"
          style={{ width: "100%", backgroundColor: "white", padding: "2%" }}
        >
          <Row justify={"space-between"} className={"formFilter"}>
            <Col span={24}>
              <FormPaymentCalendar
                title={"Crear"}
                nodeId={props.currentNode && props.currentNode.id}
              />
            </Col>
          </Row>
        </div>
      </MainLayout>
    </>
  );
};

const mapState = (state) => {
  return {
    currentNode: state.userStore.current_node,
  };
};

export default connect(mapState)(NewPaymentCalendar);
