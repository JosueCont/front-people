import React, { useEffect, useState } from "react";
import MainLayout from "../../../../layout/MainInter";
import {
  Row,
  Col,
  Table,
  Breadcrumb,
  Button,
  Form,
  Input,
  Select,
  Tooltip,
  ConfigProvider
} from "antd";
import { useRouter } from "next/router";
import Axios from "axios";
import { API_URL } from "../../../../config/config";

import SelectCollaborator from "../../../../components/selects/SelectCollaborator";
import SelectBank from "../../../../components/selects/SelectBank";

import { SearchOutlined, EyeOutlined, SyncOutlined } from "@ant-design/icons";
import { withAuthSync } from "../../../../libs/auth";
import { connect } from "react-redux";
import { verifyMenuNewForTenant } from "../../../../utils/functions"
import esES from "antd/lib/locale/es_ES";

const BankAccounts = ({ permissions, ...props }) => {
  const { Column } = Table;
  const route = useRouter();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);

  const [backsAccountsList, setBanksAccountsList] = useState([]);

  const optionStatus = [
    { value: 1, label: "Pendiente", key: "opt_1" },
    { value: 2, label: "Aprobado", key: "opt_2" },
    { value: 3, label: "Rechazado", key: "opt_3" },
  ];

  const optionType = [
    { value: 1, label: "Verificación", key: "opt_1" },
    { value: 2, label: "Actualización", key: "opt_2" },
  ];

  const columns = [
    {
      title: "Colaborador",
      dataIndex: "person",
      key: "person",
      render: (person) => {
        return person.first_name + " " + person.flast_name;
      },
    },
    ,
    {
      title: "Número de cuenta",
      dataIndex: "new_account_number",
      key: "new_account_number",
    },
    {
      title: "Banco",
      dataIndex: "new_bank",
      key: "new_bank",
      render: (new_bank) => {
        return new_bank.name;
      },
    },
    {
      title: "Tipo",
      dataIndex: "type",
      key: "type",
      render: (type) => {
        return type == 1 ? "Verificación" : "Actualización";
      },
    },
    {
      title: "Estatus",
      dataIndex: "request_status",
      key: "request_status",
      render: (request_status) => {
        return request_status == 1
          ? "Pendiente"
          : request_status == 2
          ? "Aprobado"
          : "Rechazado";
      },
    },
    {
      title: "Acciones",
      key: "actions",
      render: (row) => {
        return (
          <EyeOutlined
            className="icon_actions"
            key={"goDetails_" + row.id}
            onClick={() => GotoDetails(row)}
          />
        );
      },
    },
  ];

  const getBanksAccountRequest = async (
    collaborator = null,
    account_number = null,
    bank = null,
    type = null,
    status = null
  ) => {
    setLoading(true);
    try {
      let url = `/person/bank-account-request/?person__job__department__node__id=${props.currentNode.id}&`;
      if (collaborator) {
        url += `person__id=${collaborator}&`;
      }
      if (account_number) {
        url += `new_account_number=${account_number}&`;
      }
      if (bank) {
        url += `new_bank=${bank}&`;
      }
      if (type) {
        url += `type=${type}&`;
      }
      if (status) {
        url += `request_status=${status}&`;
      }

      let response = await Axios.get(API_URL + url);
      let data = response.data.results;
      data = data.map((item) => {
        item.key = item.id;
        return item;
      });

      setBanksAccountsList(data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const GotoDetails = (data) => {
    route.push("bank_accounts/" + data.id + "/details");
  };

  const filter = async (values) => {
    setBanksAccountsList([]);

    getBanksAccountRequest(
      values.collaborator,
      values.account_number,
      values.bank,
      values.type,
      values.status
    );
  };

  useEffect(() => {
    if (props.currentNode) getBanksAccountRequest();
  }, [props.currentNode]);

  const resetFilter = () => {
    form.resetFields();
    getBanksAccountRequest();
  };

  return (
    <MainLayout currentKey={["bank_accounts"]} defaultOpenKeys={["managementRH","concierge","requests"]}>
      <Breadcrumb className={"mainBreadcrumb"}>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => route.push({ pathname: "/home/persons/" })}
        >
          Inicio
        </Breadcrumb.Item>
        {verifyMenuNewForTenant() &&
          <>
            <Breadcrumb.Item>Administración de RH</Breadcrumb.Item>
            <Breadcrumb.Item>Concierge</Breadcrumb.Item>
          </>
        }
        <Breadcrumb.Item>Solicitudes</Breadcrumb.Item>
        <Breadcrumb.Item>Cuentas bancarias</Breadcrumb.Item>
      </Breadcrumb>
      <div className="container" style={{ width: "100%" }}>
        {permissions.view ? (
          <>
            <div className="top-container-border-radius">
              <Row justify="space-between" style={{ paddingBottom: 20 }}>
                <Col>
                  <Form
                    form={form}
                    name="filter"
                    onFinish={filter}
                    layout="vertical"
                    key="formFilter"
                    className={"formFilter"}
                  >
                    <Row gutter={[24, 8]}>
                      <Col>
                        <SelectCollaborator
                          name={"collaborator"}
                          style={{ width: 150 }}
                        />
                      </Col>
                      <Col>
                        <Form.Item
                          key="account_number_filter"
                          name="account_number"
                          label="Número de cuenta"
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col>
                        <SelectBank name="bank" style={{ width: 140 }} />
                      </Col>
                      <Col>
                        <Form.Item
                          key="type_filter"
                          name="type"
                          label="Tipo de solicitud"
                        >
                          <Select
                            style={{ width: 150 }}
                            key="select_type"
                            options={optionType}
                            allowClear
                            notFoundContent={"No se encontraron resultados."}
                          />
                        </Form.Item>
                      </Col>
                      <Col>
                        <Form.Item
                          key="estatus_filter"
                          name="status"
                          label="Estatus"
                        >
                          <Select
                            style={{ width: 100 }}
                            key="select_status"
                            options={optionStatus}
                            allowClear
                            notFoundContent={"No se encontraron resultados."}
                          />
                        </Form.Item>
                      </Col>
                      <Col style={{ display: "flex" }}>
                        <Button
                          style={{
                            background: "#fa8c16",
                            fontWeight: "bold",
                            color: "white",
                            marginTop: "auto",
                          }}
                          key="buttonFilter"
                          htmlType="submit"
                          loading={loading}
                        >
                          <SearchOutlined />
                        </Button>
                      </Col>
                      <Col style={{ display: "flex" }}>
                        <Tooltip
                          title="Limpiar filtros"
                          color={"#3d78b9"}
                          key={"#3d78b9"}
                        >
                          <Button
                            onClick={() => resetFilter()}
                            style={{ marginTop: "auto", marginLeft: 10 }}
                          >
                            <SyncOutlined />
                          </Button>
                        </Tooltip>
                      </Col>
                    </Row>
                  </Form>
                </Col>
              </Row>
            </div>

            <Row justify="end">
              <Col span={24}>
                <ConfigProvider locale={esES}>
                <Table
                  dataSource={backsAccountsList}
                  key="tableHolidays"
                  loading={loading}
                  pagination={{showSizeChanger:true}}
                  columns={columns}
                  scroll={{ x: 350 }}
                  locale={{
                    emptyText: loading
                      ? "Cargando..."
                      : "No se encontraron resultados.",
                  }}
                ></Table>
                </ConfigProvider>
              </Col>
            </Row>
          </>
        ) : (
          <div className="notAllowed" />
        )}
      </div>
    </MainLayout>
  );
};

const mapState = (state) => {
  return {
    permissions: state.userStore.permissions.bank,
    currentNode: state.userStore.current_node,
  };
};

export default connect(mapState)(withAuthSync(BankAccounts));
