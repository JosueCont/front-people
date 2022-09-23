import {
  Alert,
  Avatar,
  Button,
  Col,
  Form,
  Input,
  message,
  Row,
  Select,
  Table,
} from "antd";
import { useState } from "react";
import {
  defaulPhoto,
  messageError,
  SuaMovementsType,
} from "../../../utils/constant";
import { ruleRequired } from "../../../utils/rules";
import { SearchOutlined, SyncOutlined } from "@material-ui/icons";
import SelectBranchNode from "../../../components/selects/SelectBranchNode";
import SelectPatronalRegistration from "../../../components/selects/SelectPatronalRegistration";
import WebApiPeople from "../../../api/WebApiPeople";
import GenericModal from "../../../components/modal/genericModal";
import { downLoadFileBlob, getDomain } from "../../../utils/functions";
import { useEffect } from "react";
import { API_URL_TENANT } from "../../../config/config";

const SuaMovements = ({ node }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [modalValid, setModalValid] = useState(false);
  const [patronalSelected, setPatronalSelected] = useState(null);
  const [movementType, setMovementType] = useState(null);
  const [person, setPerson] = useState([]);
  const [personSelected, setPersonSelected] = useState([]);
  const [personsKeys, setPersonsKeys] = useState([]);
  let filters = {};
  let columns = [
    {
      title: "Núm. Empleado",
      show: true,
      render: (item) => {
        return <div>{item.code ? item.code : ""}</div>;
      },
    },
    {
      title: "Foto",
      show: true,
      render: (item) => {
        return (
          <div>
            <Avatar src={item.photo ? item.photo : defaulPhoto} />
          </div>
        );
      },
    },
    {
      title: "Nombre",
      show: true,
      render: (item) => {
        let personName = item.first_name + " " + item.flast_name;
        if (item.mlast_name) personName = personName + " " + item.mlast_name;
        return (
          <>
            <div>{personName}</div>
          </>
        );
      },
    },
    ,
    {
      title: "NSS",
      show: true,
      render: (item) => {
        return (
          <>
            <div>{item.imss ? item.imss : ""}</div>
          </>
        );
      },
    },
  ];

  const filterPersonName = async () => {
    filters.node = node.id;
    setLoading(true);
    try {
      let response = await WebApiPeople.filterPerson(filters);
      setPerson([]);
      setLoading(false);
      let persons = response.data.map((a) => {
        a.key = a.khonnect_id;
        return a;
      });
      setPerson(persons);
    } catch (error) {
      setPerson([]);
      setLoading(false);
      console.log(error);
    }
  };

  const formFinish = (value) => {
    if (!value.patronal_registration && !value.imss) {
      setModalValid(true);
      return;
    }
    if (value.patronal_registration)
      filters.patronal_registration = value.patronal_registration;
    if (value && value.name !== undefined && value.name !== "") {
      filters.first_name = value.name;
    }
    if (value && value.flast_name !== undefined && value.flast_name !== "") {
      filters.flast_name = value.flast_name;
    }
    if (value && value.code !== undefined) {
      filters.code = value.code;
    }
    if (value && value.imss !== undefined && value.imss !== "") {
      filters.imss = value.imss;
    }
    filterPersonName();
  };

  const downloadFile = () => {
    try {
      setLoading(true);
      let ids = null;
      if (personSelected.length > 0)
        ids = personSelected.map((item) => {
          return item.id;
        });
      else
        ids = person.map((item) => {
          return item.id;
        });
      const data = {
        type: movementType,
        patronal_id: patronalSelected,
        list: ids,
      };
      downLoadFileBlob(
        `${getDomain(API_URL_TENANT)}/payroll/sua-movements`,
        "SuaMove.txt",
        "POST",
        data
      );
    } catch (error) {
      message.error(messageError);
    } finally {
      setLoading(false);
    }
  };

  const rowSelectionPerson = {
    selectedRowKeys: personsKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setPersonsKeys(selectedRowKeys);
      setPersonSelected(selectedRows);
    },
  };

  const resetFilter = () => {
    form.resetFields();
    setPerson([]);
    setPersonSelected([]);
    setPersonsKeys([]);
    setLoading(false);
    setMovementType(null);
  };

  return (
    <>
      <Alert
        message={
          <span>
            Paara poder iniciar la busqueda es necesario que{" "}
            <b>seleccione un registro patronal o ingrese un NSS.</b>
          </span>
        }
        closable
        type="info"
      />
      <Form layout={"vertical"} form={form} onFinish={formFinish} size="large">
        <Row gutter={30} style={{ marginBottom: 20 }}>
          <Col lg={4} xs={22}>
            {/* <SelectBranchNode onChange={(value) => setBranch(value)} /> */}
            <SelectPatronalRegistration
              currentNode={node.id}
              onChange={(value) => setPatronalSelected(value)}
            />
          </Col>
          <Col lg={4} xs={22}>
            <Form.Item name="name" label={"Nombre"}>
              <Input allowClear={true} placeholder="Nombre(s)" />
            </Form.Item>
          </Col>
          <Col lg={4} xs={22}>
            <Form.Item name="flast_name" label={"Apellido"}>
              <Input allowClear={true} placeholder="Apellido(s)" />
            </Form.Item>
          </Col>
          <Col lg={4} xs={22}>
            <Form.Item name="code" label={"Núm. empleado"}>
              <Input allowClear={true} placeholder="Núm. empleado" />
            </Form.Item>
          </Col>
          <Col lg={4} xs={22}>
            <Form.Item name="imss" label="NSS">
              <Input allowClear={true} placeholder="Numero de seguro social" />
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
      {person.length > 0 && (
        <Row justify="end">
          <Button onClick={() => setModal(true)}>Descargar batch</Button>
        </Row>
      )}
      <Table
        className={"mainTable table-persons"}
        rowKey={"id"}
        size="small"
        columns={columns}
        dataSource={person}
        loading={loading}
        locale={{
          emptyText: loading ? "Cargando..." : "No se encontraron resultados.",
        }}
        rowSelection={rowSelectionPerson}
      />
      {modal && (
        <GenericModal
          visible={modal}
          setVisible={(value) => setModal(value)}
          title="Tipo de movimiento"
          titleActionButton="Descargar"
          width="50%"
          viewActionButton={movementType ? true : false}
          actionButton={() => {
            downloadFile(), setModal(false);
          }}
          maskClosable={false}
        >
          <>
            <Alert
              message={
                <span>
                  <b>Seleccione el tipo de movimiento a realizar.</b>
                </span>
              }
              type="warning"
            />
            <br />
            <Col lg={6} xs={22}>
              <Form.Item label="Tipo de movimiento " rules={[ruleRequired]}>
                <Select
                  placeholder="Tipo de movimiento"
                  options={SuaMovementsType}
                  allowClear
                  onChange={(value) => setMovementType(value)}
                />
              </Form.Item>
            </Col>
          </>
        </GenericModal>
      )}
      {modalValid && (
        <GenericModal
          visible={modalValid}
          setVisible={(value) => setModalValid(value)}
          title="Requerido"
          width="50%"
          viewActionButton={false}
        >
          <>
            <Alert
              message={"Datos requeridos"}
              description={
                <span style={{ fontSize: "20px" }}>
                  Paara poder iniciar la busqueda es necesario que{" "}
                  <b>seleccione un registro patronal o ingrese un NSS.</b>
                </span>
              }
              type="warning"
              showIcon
            />
          </>
        </GenericModal>
      )}
    </>
  );
};

export default SuaMovements;
