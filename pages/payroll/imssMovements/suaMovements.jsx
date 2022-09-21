import { Button, Col, Form, Input, Row, Select, Spin, Tooltip } from "antd";
import { useState } from "react";
import { API_URL_TENANT } from "../../../config/config";
import { SuaMovementsType } from "../../../utils/constant";
import { downLoadFileBlob, getDomain } from "../../../utils/functions";
import { ruleRequired } from "../../../utils/rules";
import SelectPatronalRegistration from "../../../components/selects/SelectPatronalRegistration";
import { SearchOutlined, SyncOutlined } from "@material-ui/icons";
import SelectBranchNode from "../../../components/selects/SelectBranchNode";

const SuaMovements = ({ node }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [patronalSelected, setPatronalSelected] = useState(null);

  const formFinish = (value) => {
    console.log(value);
  };

  const dowloadFile = () => {
    downLoadFileBlob(
      `${getDomain(API_URL_TENANT)}/payroll/sua-movements`,
      "SuaMove.txt",
      "POST",
      {
        type: 1,
        patronal_id: "6e7bbe13e35a465089188a2b6f58a280",
        list: [
          "da04fc20f0884fd0b6211a5fd006a4dd",
          "ca9abe25680b451ca9603176732e2b6d",
        ],
      }
    );
  };

  const resetFilter = () => {
    form.resetFields();
  };
  return (
    <>
      <Spin tip="Cargando..." spinning={loading}>
        <Form
          layout={"vertical"}
          form={form}
          onFinish={formFinish}
          size="large"
        >
          <Row gutter={30} style={{ marginBottom: 20 }}>
            {/* <Col lg={6} xs={22}>
              <Form.Item
                name="type"
                label="Tipo de movimiento "
                rules={[ruleRequired]}
              >
                <Select
                  placeholder="Tipo de movimiento"
                  options={SuaMovementsType}
                  allowClear
                />
              </Form.Item>
            </Col> */}
            <Col lg={3} xs={22}>
              <SelectPatronalRegistration
                currentNode={node}
                onChange={(value) => setPatronalSelected(value)}
              />
            </Col>
            <Col lg={3} xs={22}>
              <SelectBranchNode patronal_id={patronalSelected} />
            </Col>
            <Col lg={3} xs={22}>
              <Form.Item name="name" label={"Nombre"}>
                <Input allowClear={true} placeholder="Nombre(s)" />
              </Form.Item>
            </Col>
            <Col lg={3} xs={22}>
              <Form.Item name="flast_name" label={"Apellido"}>
                <Input allowClear={true} placeholder="Apellido(s)" />
              </Form.Item>
            </Col>
            <Col lg={3} xs={22}>
              <Form.Item name="code" label={"Núm. empleado"}>
                <Input allowClear={true} placeholder="Núm. empleado" />
              </Form.Item>
            </Col>
            <Col lg={3} xs={22}>
              <Form.Item name="code" label="NSS">
                <Input
                  allowClear={true}
                  placeholder="Numero de seguro social"
                />
              </Form.Item>
            </Col>
            <Col className="button-filter-person" style={{ display: "flex" }}>
              <Button
                className="btn-filter"
                htmlType="submit"
                style={{ marginTop: "50px", marginLeft: 10 }}
              >
                <SearchOutlined />
              </Button>
            </Col>
            <Col className="button-filter-person" style={{ display: "flex" }}>
              <Button
                className="btn-filter"
                onClick={() => resetFilter()}
                style={{ marginTop: "50px", marginLeft: 10 }}
              >
                <SyncOutlined />
              </Button>
            </Col>
          </Row>
        </Form>
      </Spin>
    </>
  );
};

export default SuaMovements;
