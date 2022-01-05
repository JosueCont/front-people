import React, { useState } from "react";
import {
  Tabs,
  Tooltip,
  Typography,
  Form,
  Row,
  Col,
  Button,
  Table,
  Spin,
  Input,
} from "antd";
import { GoldOutlined } from "@ant-design/icons";
import { userCompanyName } from "../../libs/auth";
import MassiveImportDepartments from "../business/MassiveImportDepartments";
import { ruleRequired } from "../../utils/rules";
/* import MassiveImportJobs from ".../components/MassiveImportJobs"; */

const Departaments = ({ permissions, onFinishForm, ...props }) => {
  let nodePeople = userCompanyName();
  const { Title } = Typography;
  const { TabPane } = Tabs;

  const [edit, setEdit] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    form.resetFields();
    setEdit(false);
  };

  const columns = [
    {
      title: "Empresa",
      render: (item) => {
        return <>{item.node.name}</>;
      },
    },
    {
      title: "Nombre",
      dataIndex: "name",
      key: "key",
    },
    {
      title: "Descripción",
      dataIndex: "description",
    },
    {
      title: "Código",
      dataIndex: "code",
    },
    {
      title: "Acciones",
      render: (item) => {
        return (
          <div>
            <Row gutter={16}>
              {permissions.edit_department && (
                <Col className="gutter-row" offset={1}>
                  <EditOutlined onClick={() => editRegister(item, "dep")} />
                </Col>
              )}
              {permissions.delete_department && (
                <Col className="gutter-row" offset={1}>
                  <DeleteOutlined
                    onClick={() => {
                      setDeleteRegister({
                        id: item.id,
                        url: "/business/department/",
                      });
                    }}
                  />
                </Col>
              )}
            </Row>
          </div>
        );
      },
    },
  ];

  return (
    <>
      {edit ? <Title style={{ fontSize: "20px" }}>Editar</Title> : <></>}
      {permissions.create_department && (
        <Tabs tabPosition={"top"}>
          <TabPane
            tab="Individual"
            key="tab_1_1"
            style={{ paddingTop: "15px" }}
          >
            <Form
              layout={"vertical"}
              form={form}
              onFinish={(values) =>
                onFinishForm(values, `/business/department/?node=${nodeId}`)
              }
            >
              <Row>
                <Col lg={6} xs={22} offset={1}>
                  <Form.Item label="Empresa" rules={[ruleRequired]}>
                    <Input readOnly value={nodePeople} />
                  </Form.Item>
                </Col>
                <Col lg={6} xs={22} offset={1}>
                  <Form.Item name="name" label="Nombre" rules={[ruleRequired]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col lg={6} xs={22} offset={1}>
                  <Form.Item
                    name="description"
                    label="Descripción"
                    rules={[ruleRequired]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col lg={6} xs={22} offset={1}>
                  <Form.Item name="code" label="Código">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row justify={"end"} gutter={20} style={{ marginBottom: 20 }}>
                <Col>
                  <Button onClick={resetForm}>Cancelar</Button>
                </Col>
                <Col>
                  <Button type="primary" htmlType="submit">
                    Guardar
                  </Button>
                </Col>
              </Row>
            </Form>
          </TabPane>
          <TabPane
            tab="Carga masiva"
            key="tab_1_2"
            style={{ paddingTop: "15px" }}
          >
            <MassiveImportDepartments
              nodePeople={nodePeople}
              setLoadingTable={setLoading}
            />
          </TabPane>
        </Tabs>
      )}
      <Spin tip="Cargando..." spinning={loading}>
        <Table
          columns={columns}
          dataSource={props.cat_departments}
          locale={{
            emptyText: loading
              ? "Cargando..."
              : "No se encontraron resultados.",
          }}
        />
      </Spin>
    </>
  );
};

export default Departaments;
