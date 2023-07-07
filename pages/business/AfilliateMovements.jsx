import React, { useEffect, useState } from "react";
import { Table, Spin, Button, Col, Modal, message } from "antd";
import WebApiPeople from "../../api/WebApiPeople";
import moment from "moment";
import { FileExcelOutlined, SyncOutlined } from "@ant-design/icons";
import { DeleteOutlined } from "@material-ui/icons";
import { messageDeleteSuccess, messageError } from "../../utils/constant";

const AfilliateMovements = ({ node, id }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const columns = [
    {
      title: "Periodo",
      dataIndex: "period",
    },
    {
      title: "Descripción",
      dataIndex: "description",
    },
    {
      title: "Fecha",
      dataIndex: "timestamp",
      render: (item) => <>{moment(item).format("DD-MM-YYYY")}</>,
    },
    {
      title: "Documento",
      dataIndex: "file",
      render: (item, record) =>
        item != null ? (
          <>
            <a href={item} download>
              {" "}
              <FileExcelOutlined /> Descargar{" "}
            </a>
          </>
        ) : (
          <span style={{ color: "gray" }}>Sin documento</span>
        ),
    },
    {
      title: "Estatus",
      dataIndex: "meta",
      render: (item) => <a>{item.status}</a>,
    },
    {
      title: "Acciones",
      render: (record) =>
        record.file == null ||
        (record.meta != null && record.meta.status == "Finalizado")
          ? (console.log("RECORD -> ", record),
            (
              <Col className="gutter-row" offset={1}>
                <DeleteOutlined onClick={() => onDelete(record.id)} />
              </Col>
            ))
          : (console.log("RECORD -> ", record), null),
    },
  ];
  useEffect(() => {
    id && getAfilliateMovements();
  }, [id]);

  const getAfilliateMovements = async () => {
    try {
      setLoading(true);
      let url = `?node_id=${node}&origin__type=4&patronal_registration_id=${id}&offset=0&limit=1000`;
      const movements = await WebApiPeople.afilliateMovements(url);
      setLoading(false);
      processData(movements?.data?.results);
    } catch (e) {
      setData([]);
      console.log("error", e);
    } finally {
      setLoading(false);
    }
  };

  const processData = (results) => {
    let arr = _.orderBy(results, ["period"], ["desc"]);
    setData(arr);
  };

  const deleteMovement = async (id) => {
    try {
      let data = {
        document_id: id,
      };
      let res = await WebApiPeople.deleteAffiliatedMovements(data);
      message.success(messageDeleteSuccess);
      getAfilliateMovements();
    } catch (e) {
      message.error(messageError);
      console.log("error", e);
    }
  };

  const onDelete = (id) => {
    if (id) {
      Modal.confirm({
        title: "¿Está seguro de eliminar este registro?",
        content: "Si lo elimina no podrá recuperarlo",
        cancelText: "Cancelar",
        okText: "Sí, eliminar",
        onOk: () => {
          deleteMovement(id);
        },
      });
    }
  };

  return (
    <>
      <Button onClick={getAfilliateMovements}>
        <SyncOutlined spin={loading} />
      </Button>

      <Spin tip="Cargando..." spinning={loading}>
        <Table
          columns={columns}
          dataSource={data}
          key={(item, index) => index}
          pagination={{ showSizeChanger: true }}
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
export default AfilliateMovements;
