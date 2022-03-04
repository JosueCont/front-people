import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import {
    Table,
    Row,
    Col,
    Tooltip,
    Tag,
    Modal,
    message,
    Menu,
    Dropdown,
    Button,
    Space,
    List,
    Avatar
} from "antd";
import {
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    UserOutlined,
    FileTextOutlined,
    EllipsisOutlined
} from "@ant-design/icons";
import DeleteAssign from "./DeleteAssign";
import ViewSurveys from "../assessment/groups/ViewSurveys";
import WebApiAssessment from "../../api/WebApiAssessment";

const TableAssignments = ({...props}) => {

  const permissions = useSelector(state => state.userStore.permissions.person)
  const currenNode = useSelector(state => state.userStore.current_node)
  const [openManyDelete, setOpenManyDelete] = useState(false);
  const [showManyDelete, setShowManyDelete] = useState(false);
  const [showModalSurveys, setShowModalSurveys] = useState(false);
  const [itemSelected, setItemSelected] = useState({});
  const [selectedAssign, setSelectedAssign] = useState([]);
  const [assignKeys, setAssignKeys] = useState([]);

  const HandleUpdate = (item) =>{
    setItemSelected(item)
  }

  const HandleDelete = (item) =>{
    setSelectedAssign([item])
    setOpenManyDelete(true)
  }

  const resetValues = () =>{
    setSelectedAssign([])
    setAssignKeys([])
    setOpenManyDelete(false)
    setShowManyDelete(false)
  }

  const HandleViewSurveys = (item) =>{
    getDetailsAssessment(item.id_assessment)
  }
  
  const rowSelectionAssign = {
    selectedRowKeys: assignKeys,
    onChange: (selectedRowKeys, selectedRows) => {
        setAssignKeys(selectedRowKeys)
        setSelectedAssign(selectedRows)
    }
  }

  const onChangePage = (pagination) => {
    if (pagination.current > 1) {
      const offset = (pagination.current - 1) * 10;
      const queryParam = `&limit=10&offset=${offset}`;
      props.getList(currenNode?.id,queryParam)
    } else if (pagination.current == 1) {
      props.getList(currenNode?.id,"")
    }
  }

  useEffect(()=>{
    if(openManyDelete){
      if(selectedAssign.length > 0){
        setShowManyDelete(true)
      }else{
        message.error("Seleccio al menos una asignación")
        setOpenManyDelete(false)
      }
    }
  },[openManyDelete])

  const removeAssign = (ids) =>{
    props.setLoading(true)
    props.delete(ids)
    resetValues()
  }

  const getDetailsAssessment = async (id) =>{
    try {
      let response = await WebApiAssessment.getDetailsAssessment(id);
      setItemSelected(response.data)
      setShowModalSurveys(true)
    } catch (e) {
      setItemSelected({})
      setShowModalSurveys(false)
      message.error("No se encontraron detalles de la encuesta")
    }
  }

  const menuTable = () => {
    return (
      <Menu>
        {permissions?.delete && (
          <Menu.Item
            key={1}
            icon={<DeleteOutlined/>}
            onClick={()=>setOpenManyDelete(true)}
          >
            Eliminar
          </Menu.Item>
        )}
      </Menu>
    );
  };

  const menuItem = (item) => {
    return (
      <Menu>
        {/* {permissions?.edit && (
          <Menu.Item
            key={1}
            icon={<EditOutlined/>}
            onClick={() => HandleUpdate(item)}
          >
            Editar
          </Menu.Item>
        )} */}
        {permissions?.delete && (
          <Menu.Item
            key={2}
            icon={<DeleteOutlined/>}
            onClick={() => HandleDelete(item)}
          >
            Eliminar
          </Menu.Item>
        )}
      </Menu>
    )
  }

  const columns = [
      {
        title: "Persona",
        render: (item) => {
          return (
            <div>
              {item.person.first_name} {item.person.flast_name} {item.person.mlast_name}
            </div>
          );
        },
      },
      {
        title: "Encuesta",
        render: (item) => {
          return (
            <Space>
              {item.id_assessment &&(
                <Tooltip title='Ver encuesta'>
                    <EyeOutlined
                      style={{cursor: 'pointer'}}
                      onClick={()=>HandleViewSurveys(item)}
                    />
                </Tooltip>
              )}
            </Space>
          )
        }
      },
      {
        title: () => {
          return (
            <>
              {permissions?.delete && (
                <Dropdown overlay={menuTable}>
                  <Button size="small">
                    <EllipsisOutlined />
                  </Button>
                </Dropdown>
              )}
            </>
          )
        },
        render: (item) => {
          return (
            <>
              {(permissions?.edit || permissions?.delete) && (
                <Dropdown overlay={() => menuItem(item)}>
                  <Button size="small">
                    <EllipsisOutlined />
                  </Button>
                </Dropdown>
              )}
            </>
          )
        }
      },
  ]

  return(
    <>
        <Row>
            <Col span={24}>
                <Table
                  rowKey={'id'}
                  columns={columns}
                  loading={props.loading}
                  dataSource={props.dataAssign?.results}
                  locale={{
                    emptyText: props.loading ?
                    "Cargando..." :
                    "No se encontraron resultados."
                  }}
                  pagination={{
                      pageSize: 10,
                      total: props.dataAssign?.count,
                  }}
                  onChange={onChangePage}
                  rowSelection={rowSelectionAssign}
                />
            </Col>
        </Row>
        {showManyDelete && (
          <DeleteAssign
            visible={showManyDelete}
            close={resetValues}
            assign={selectedAssign}
            actionDelete={removeAssign}
          />
        )}
        {showModalSurveys && (
          <ViewSurveys
            title={'Encuesta asignada'}
            visible={showModalSurveys}
            setVisible={setShowModalSurveys}
            item={{assessments: [itemSelected]}}
          />
        )}
    </>
  )
}

export default TableAssignments