import { useEffect, useState } from "react";
import { userId, withAuthSync } from "../../../libs/auth";
import {
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined, LoadingOutlined, PlusOutlined,
} from "@ant-design/icons";

import PropTypes from "prop-types";
import SvgIcon from "@material-ui/core/SvgIcon";
import { fade, makeStyles, withStyles } from "@material-ui/core/styles";
import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";
import Collapse from "@material-ui/core/Collapse";
import { useSpring, animated } from "react-spring/web.cjs";
import { TreeViewContent } from "./TreeView.style";
import ModalDeleteBusiness from "../../modal/deleteBusiness";
import IconButton from "./iconbutton";
import {Tooltip, Modal, Button, Form, Select, Input, message, Upload} from "antd";
import TextArea from "antd/lib/input/TextArea";
import jsCookie from "js-cookie";
import WebApiPeople from "../../../api/WebApiPeople";
import { connect } from "react-redux";

const NodeTreeView = ({ ...props }) => {
  const [nodes, setNodes] = useState([]);
  const [nodeId, setNodeId] = useState(0);
  const [visibleCreate, setVisibleCreate] = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [formBusiness] = Form.useForm();
  const [business, setBusiness] = useState([]);
  const [creUp, setCreup] = useState(false);
  const [nameNode, setNameNode] = useState("");
  const [idNodeUpdate, setIdNodeUpdate] = useState(0);
  const [loadingLogo, setLoadingLogo] = useState(false);
  const [logo, setLogo] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  let personId = userId();

  useEffect(() => {
    personId = userId();
    const jwt = JSON.parse(jsCookie.get("token"));
    person();
  }, []);

  const person = () => {
    const jwt = JSON.parse(jsCookie.get("token"));
    WebApiPeople.personForKhonnectId({
      id: jwt.user_id,
    })
      .then((response) => {
        if (response.data.node.length > 0) {
          let bus = response.data.results.map((a) => {
            return { label: a.name, value: a.id };
          });
          setBusiness(bus);
        }
        if (response.data.is_admin) Nodos();
        getNodes();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getNodes = () => {
    WebApiPeople.getNodeTree({
      person: personId,
    })
      .then((response) => {
        setNodes(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const configUpload = {
    label: "Logo",

    listType: "picture-card",

    className: "avatar-uploader",
    showUploadList: false,

    beforeUpload: (file) => {
      const isPNG = file.type === "image/png" || file.type === "image/jpg";
      if (!isPNG) {
        message.error(`${file.name} , No es una imagen.`);
      }
      return isPNG || Upload.LIST_IGNORE;
    },
    onChange: (image) => {
      if (image.file.status === "uploading") {
        setLoadingLogo(true);
        return;
      }
      if (image.file.status === "done") {
        if (image.fileList.length > 0) {
          setLogo(image.file.originFileObj);
          getBase64(image.file.originFileObj, (imageUrl) => {
            setLoadingLogo(false);
            setImageUrl(imageUrl);
          });
        }
      }
    },
  };

  function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  const Nodos = () => {
    WebApiPeople.getCompanys(props?.user?.id)
      .then((response) => {
        setBusiness([]);
        let bus = response.data.results.map((a) => {
          return { label: a.name, value: a.id };
        });
        setBusiness(bus);
      })
      .catch((e) => {
        setBusiness([]);
        console.log(e);
      });
  };

  function MinusSquare(props) {
    return (
      <SvgIcon fontSize="inherit" style={{ width: 20, height: 20 }} {...props}>
        <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
      </SvgIcon>
    );
  }

  function PlusSquare(props) {
    return (
      <SvgIcon fontSize="inherit" style={{ width: 20, height: 20 }} {...props}>
        <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
      </SvgIcon>
    );
  }

  function CloseSquare(props) {
    return <PlusCircleOutlined style={{ fontSize: "20px" }} />;
  }

  function TransitionComponent(props) {
    const style = useSpring({
      from: { opacity: 0, transform: "translate3d(20px,0,0)" },
      to: {
        opacity: props.in ? 1 : 0,
        transform: `translate3d(${props.in ? 0 : 20}px,0,0)`,
      },
    });

    return (
      <animated.div style={style}>
        <Collapse {...props} />
      </animated.div>
    );
  }

  TransitionComponent.propTypes = {
    in: PropTypes.bool,
  };

  const StyledTreeItem = withStyles((theme) => ({
    iconContainer: {
      "& .close": {
        opacity: 0.3,
      },
    },
    group: {
      marginLeft: 12,
      paddingLeft: 12,
      borderLeft: `1px dashed ${fade(theme.palette.text.primary, 0.4)}`,
    },
  }))((props) => (
    <TreeItem
      {...props}
      onClick={props.onHandleClickItem}
      TransitionComponent={TransitionComponent}
    />
  ));

  const useStyles = makeStyles({
    root: {
      height: 264,
      flexGrow: 1,
      maxWidth: 400,
    },
  });

  let level = 0;

  const NodeTree = ({ nodesArray, parent }) => {
    const classes = useStyles();
    return (
      <>
        {nodesArray.map((p) => {
          return (
            <>
              <StyledTreeItem
                style={{ margin: "1%" }}
                nodeId={p.value}
                label={p.title}
                className="titleFirstLevel"
              >
                <IconButton className="addButton" color="secondary">
                  {props.permissions.company &&
                    props.permissions.company.delete && (
                      <Tooltip placement="top" title="Eliminar">
                        <DeleteOutlined onClick={() => modalDelete(true, p)} />
                      </Tooltip>
                    )}
                  {props.permissions.company &&
                    props.permissions.company.edit && (
                      <Tooltip placement="top" title="Editar">
                        <EditOutlined
                          onClick={() =>
                            modalCreateUpdate({
                              bool: true,
                              edit: p,
                              parent: parent,
                            })
                          }
                        />
                      </Tooltip>
                    )}
                </IconButton>

                {p.children && p.children.length > 0 ? (
                  <>
                    <NodeTree nodesArray={p.children} parent={p.value} />
                    {props.permissions.company &&
                      props.permissions.company.create && (
                        <StyledTreeItem
                          className="titleFirstLevel"
                          style={{ margin: "1%" }}
                          nodeId={0}
                          onHandleClickItem={() =>
                            modalCreateUpdate({
                              bool: false,
                              parent: p.value,
                              level: level + 1,
                            })
                          }
                          label={"Agregar empresa"}
                        />
                      )}
                  </>
                ) : (
                  <>
                    {props.permissions.company &&
                      props.permissions.company.create && (
                        <StyledTreeItem
                          className="titleFirstLevel"
                          style={{ margin: "1%" }}
                          nodeId={0}
                          label={"Agregar empresa"}
                          onHandleClickItem={() =>
                            modalCreateUpdate({ bool: false, parent: p.value })
                          }
                        />
                      )}
                  </>
                )}
              </StyledTreeItem>
            </>
          );
        })}
      </>
    );
  };

  const modalCreateUpdate = (value) => {
    formBusiness.resetFields();
    setImageUrl(null)
    setCreup(value.bool);
    if (value.parent > 0 && value.bool === false) {
      formBusiness.setFieldsValue({
        parent: value.parent,
      });
    } else {
      if (value.parent > 0 && value.bool) {
        setIdNodeUpdate(value.edit.value);
        setNameNode(value.edit.title);
        console.log('valores',value)
        formBusiness.setFieldsValue({
          name: value.edit.title,
          parent: value.parent,
          description: value.edit.description,
        });
      }
      if (value.parent == undefined && value.bool) {
        setIdNodeUpdate(value.edit.value);
        setNameNode(value.edit.title);
        formBusiness.setFieldsValue({
          name: value.edit.title,
          parent: value.parent,
          description: value.edit.description,
        });

        if(value.edit?.node?.image){
          setImageUrl(value.edit?.node?.image)
        }

      }
    }
    visibleCreate ? setVisibleCreate(false) : setVisibleCreate(true);
  };

  const modalDelete = (value, item) => {
    if (item != undefined && item != "") setNodeId(item.value);
    setVisibleDelete(value);
    if (item != undefined && item != "") setNameNode(item.title);
    if (!value) {
      getNodes();
    }
  };

  const closeDialogCreate = () => {
    visibleCreate ? setVisibleCreate(false) : setVisibleCreate(true);
  };

  const createBusiness = (value) => {
    let data = new FormData();
    data.append("name", value.name);
    data.append("description", value.description);
    data.append("active", true);
    if (value.parent) {
      data.append("parent", value.parent ? value.parent : null);
    }
    if (logo) {
       data.append("image", logo);
    }
    if (idNodeUpdate > 0) {
      WebApiPeople.updateNode(idNodeUpdate, data)
        .then(function (response) {
          Nodos();
          getNodes();
          setVisibleCreate(false);
          formBusiness.resetFields();
          message.success("Actualizado correctamente.");
          setIdNodeUpdate(0);
        })
        .catch(function (error) {
          message.success("Ocurrio un error, intente de nuevo.");
          setIdNodeUpdate(0);
          console.log(error);
        });
    } else {
      data.append("person", personId);
      WebApiPeople.createNode(data)
        .then(function (response) {
          Nodos();
          getNodes();
          setVisibleCreate(false);
          formBusiness.resetFields();
          message.success("Guardado correctamente.");
          setIdNodeUpdate(0);
        })
        .catch(function (error) {
          message.success("Ocurrio un error, intente de nuevo.");
          setIdNodeUpdate(0);
          console.log(error);
        });
    }
  };

  const uploadButton = (
      <div>
        {loadingLogo ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
  );

  return (
    <div>
      <TreeViewContent>
        <TreeView
          className={useStyles.root}
          defaultCollapseIcon={<MinusSquare />}
          defaultExpandIcon={<PlusSquare />}
          defaultEndIcon={<CloseSquare />}
        >
          <>
            {props.permissions.company && props.permissions.company.create && (
              <StyledTreeItem
                className="titleFirstLevel"
                style={{ margin: "1%" }}
                nodeId={0}
                label="Agregar empresa"
                onHandleClickItem={() =>
                  modalCreateUpdate({ bool: false, parent: 0 })
                }
              />
            )}
            {nodes.length > 0 && <NodeTree nodesArray={nodes} />}
          </>
        </TreeView>
      </TreeViewContent>
      <Modal
        title={creUp ? `Actualizar ${nameNode}` : "Agregar empresa"}
        visible={visibleCreate}
        onCancel={() => closeDialogCreate()}
        footer={[
          <Button key="back" onClick={closeDialogCreate}>
            Regresar
          </Button>,
          <Button
            form="addBusinessForm"
            type="primary"
            key="submit"
            htmlType="submit"
          >
            Guardar
          </Button>,
        ]}
      >
        <Form
          id="addBusinessForm"
          form={formBusiness}
          layout={"vertical"}
          onFinish={createBusiness}
        >
          <Form.Item label="Logo">
            <Upload {...configUpload}>
              {imageUrl ? (
                  <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
              ) : (
                  uploadButton
              )}
            </Upload>
          </Form.Item>

          <Form.Item
            name="name"
            label="Nombre"
            rules={[{ required: true, message: "Ingresa un nombre" }]}
          >
            <Input placeholder="Nombre de la empresa" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Descripción"
            rules={[{ required: true, message: "Ingresa una descripción" }]}
          >
            <TextArea rows={4} showCount maxLength={200} />
          </Form.Item>
          <Form.Item name="parent" label="Nodo padre">
            <Select
              showSearch
              placeholder="Empresa"
              notFoundContent={"No se encontraron resultados."}
              options={business}
            />
          </Form.Item>
        </Form>
      </Modal>
      <ModalDeleteBusiness
        close={modalDelete}
        node={nodeId}
        visible={visibleDelete}
        name={nameNode}
      />
    </div>
  );
};
const mapState = (state) => {
  return {
    permissions: state.userStore.permissions,
    user: state.userStore.user,
  };
};
export default connect(mapState)(withAuthSync(NodeTreeView));
