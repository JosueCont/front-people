import { Spin, Button, Row, Col, Typography, Table, Modal } from "antd";
import {
  FileTextOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import DocumentModal from "../../components/modal/document";
import DocumentSelectModal from "../../components/modal/selectDocument";
import { messageDialogDelete, titleDialogDelete } from "../../utils/constant";
import WebApiPeople from "../../api/WebApiPeople";

const FormDocument = ({ person_id, node }) => {
  const { Title } = Typography;
  const { confirm } = Modal;
  const [documents, setDocuments] = useState([]);
  const [modalDoc, setModalDoc] = useState(false);
  const [loadingTable, setLoadingTable] = useState(true);
  const [showModalSelectDoc, setShowModalSelectDoc] = useState(false);
  const [editDocument, setEditDocument] = useState(null);

  useEffect(() => {
    getDocument();
  }, [person_id]);

  const getDocument = async () => {
    setLoadingTable(true);
    await WebApiPeople.getDocumentPerson(person_id)
      .then((response) => {
        setDocuments(response.data);

        setTimeout(() => {
          setLoadingTable(false);
        }, 1000);
      })
      .catch((e) => {
        console.log(e);
        setDocuments([]);

        setTimeout(() => {
          setLoadingTable(false);
        }, 1000);
      });
  };
  const getModalDoc = (value) => {
    setModalDoc(value);
    getDocument();
  };

  const deleteDocument = async (value) => {
    await WebApiPeople.deleteDocument(value)
      .then((response) => {
        getDocument();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const showModalDelete = (id) => {
    confirm({
      title: titleDialogDelete,
      icon: <ExclamationCircleOutlined />,
      content: messageDialogDelete,
      okText: "Si",
      okType: "danger",
      cancelText: "Cancelar",
      onOk() {
        if (id !== undefined) deleteDocument(id);
      },
      onCancel() {},
    });
  };

  const colDoc = [
    {
      title: "Tipo documento",
      render: (item) => {
        return <>{item.document_type.name}</>;
      },
    },
    {
      title: "Descripción",
      dataIndex: "description",
      key: "id",
    },
    {
      title: "Documento",
      render: (item) => {
        return (
          <div>
            <Row gutter={16}>
              <Col className="gutter-row" offset={1}>
                <a href={item.document} target="_blank">
                  <FileTextOutlined style={{ fontSize: "30px" }} />
                </a>
              </Col>
            </Row>
          </div>
        );
      },
    },
    {
      title: "Opciones",
      render: (item) => {
        return (
          <div>
            <Row gutter={16}>
              <Col className="gutter-row" offset={1}>
                <DeleteOutlined
                  style={{ fontSize: "20px" }}
                  onClick={() => {
                    showModalDelete(item.id);
                  }}
                />
              </Col>
            </Row>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <Row>
        <Title style={{ fontSize: "20px" }}>Documentos</Title>
      </Row>
      <Row>
        <Col style={{ padding: "2%" }}>
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => getModalDoc(true)}
          >
            Agregar
          </Button>
        </Col>
      </Row>
      <Spin tip="Cargando..." spinning={loadingTable}>
        <Table
          columns={colDoc}
          dataSource={documents}
          locale={{
            emptyText: loadingTable
              ? "Cargando..."
              : "No se encontraron resultados.",
          }}
        />
      </Spin>
      {modalDoc && (
        <DocumentModal
          document={editDocument}
          close={getModalDoc}
          visible={modalDoc}
          person_id={person_id}
          node={node}
        />
      )}
    </>
  );
};
export default FormDocument;
