import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Table, Row, Col, Select, Form, DatePicker, Button } from "antd";

const LoanReport = (props) => {
  const route = useRouter();
  const { Option } = Select;
  const [form] = Form.useForm();
  const [personList, setPersonList] = useState([]);
  const [collaboratorList, setCollaboratorList] = useState([]);

  /* Columnas de tabla */
  const columns = [
    {
      title: "Colaborador",
      dataIndex: "Colaborador",
      key: "Colaborador",
      fixed: "left",
    },
    {
      title: "Tipo de préstamo",
      dataIndex: "Tipo de préstamo",
      key: "Tipo de préstamo",
    },
    {
      title: "Estatus",
      dataIndex: "Estatus",
      key: "Estatus",
    },
    {
      title: "Plazo",
      dataIndex: "Plazo",
      key: "Plazo",
    },
    {
      title: "Periodicidad",
      dataIndex: "Periodicidad",
      key: "Periodicidad",
    },
    {
      title: "Fecha de solicitud",
      dataIndex: "Fecha de solicitud",
      key: "Fecha de solicitud",
    },
    {
      title: "Cantidad solicitada",
      dataIndex: "Cantidad solicitada",
      key: "Cantidad solicitada",
    },
    {
      title: "Pago realizado",
      dataIndex: "",
      key: "",
    },
    {
      title: "Saldo",
      dataIndex: "Saldo",
      key: "Saldo",
    },
    {
      title: "Acciones",
      dataIndex: "actions",
      key: "actions",
    },
  ];

  const getAllPersons = async () => {
    try {
      let response = await axiosApi.get(`/person/person/`);
      let data = response.data.results;
      let list = [];
      data = data.map((a, index) => {
        let item = {
          label: a.first_name + " " + a.flast_name,
          value: a.id,
          key: a.id + index,
        };
        list.push(item);
      });
      setPersonList(list);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <Row justify="space-between" style={{ padding: "10px 20px 10px 0px" }}>
        <Col>
          <Form
            name="filter"
            layout="vertical"
            key="formFilter"
            className="formFilterReports"
          >
            <Row gutter={[24, 8]}>
              <Col>
                <Form.Item
                  key="collaborator"
                  name="collaborator"
                  label="Colaborador"
                >
                  <Select
                    key="selectPerson"
                    showSearch
                    /* options={personList} */
                    style={{ width: 150 }}
                    allowClear
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    filterSort={(optionA, optionB) =>
                      optionA.children
                        .toLowerCase()
                        .localeCompare(optionB.children.toLowerCase())
                    }
                  >
                    {personList
                      ? personList.map((item) => {
                          return (
                            <Option key={item.key} value={item.value}>
                              {item.label}
                            </Option>
                          );
                        })
                      : null}
                  </Select>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item key="company" name="company" label="Tipo">
                  <Select style={{ width: 150 }}></Select>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item
                  key="department_select"
                  name="department"
                  label="Periodicidad"
                >
                  <Select style={{ width: 150 }}></Select>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item key="estatus_filter" name="status" label="Fecha">
                  <DatePicker format={"YYYY/MM/DD"} />
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
                >
                  Filtrar
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
        <Col className="columnRightFilter">
          <Button
            style={{
              background: "#fa8c16",
              fontWeight: "bold",
              color: "white",
            }}
            onClick={() => route.push("holidays/new")}
            key="btn_new"
          >
            Descargar
          </Button>
        </Col>
      </Row>
      <Row style={{ padding: "10px 20px 10px 0px" }}>
        <Col span={24}>
          <Table
            scroll={{ x: 1500 }}
            dataSource={collaboratorList}
            key="tableHolidays"
            columns={columns}
          ></Table>
        </Col>
      </Row>
    </>
  );
};

export default LoanReport;
