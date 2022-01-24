import React, { useState } from "react";
import {
  Tabs,
  Typography,
  Form,
  Row,
  Col,
  Button,
  Table,
  Spin,
  Input,
} from "antd";
import { userCompanyName } from "../../libs/auth";
import MassiveImportJobs from "../MassiveImportJobs";
import { ruleRequired } from "../../utils/rules";
import { connect } from "react-redux";

const TabJobs = ({ permissions, onFinishForm, ...props }) => {
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

  const colJob = [
    {
      title: "Empresa",
      render: (item) => {
        return <>{userCompanyName()}</>;
      },
    },
    {
      title: "Nombre",
      render: (item) => {
        return <>{item.name}</>;
      },
      key: "key",
    },
    {
      title: "Código",
      render: (item) => {
        return <>{item.code}</>;
      },
    },
    {
      title: "Acciones",
      render: (item) => {
        return (
          <div>
            <Row gutter={16}>
              {permissions.edit && (
                <Col className="gutter-row" offset={1}>
                  <EditOutlined onClick={() => editRegister(item, "job")} />
                </Col>
              )}
              {permissions.delete && (
                <Col className="gutter-row" offset={1}>
                  <DeleteOutlined
                    onClick={() => {
                      setDeleteRegister({
                        id: item.id,
                        url: "/person/job/",
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
      {permissions.create && (
        <Tabs tabPosition={"top"}>
          <TabPane
            tab="Individual"
            key="tab_2_1"
            style={{ paddingTop: "15px" }}
          >
            <Form
              layout={"vertical"}
              form={form}
              onFinish={(values) =>
                onFinishForm(values, `/person/job/?node=${nodeId}`)
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
                  <Form.Item name="code" label="Código" rules={[ruleRequired]}>
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
            key="tab_2_2"
            style={{ paddingTop: "15px" }}
          >
            <MassiveImportJobs
              nodePeople={nodePeople}
              setLoading={setLoading}
            />
          </TabPane>
        </Tabs>
      )}{" "}
      <Spin tip="Cargando..." spinning={loading}>
        <Table
          columns={colJob}
          dataSource={props.cat_job}
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

const mapState = (state) => {
  return {
    cat_job: state.catalogStore.cat_job,
  };
};

export default connect(mapState)(TabJobs);
