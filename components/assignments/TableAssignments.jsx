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

const TableAssignments = ({...props}) => {

  const permissions = useSelector(state => state.userStore.permissions.person)
  const currenNode = useSelector(state => state.userStore.current_node)
  const [openManyDelete, setOpenManyDelete] = useState(false);
  const [itemSelected, setItemSelected] = useState({});
  const [selectedAssign, setSelectedAssign] = useState([]);
  const [assignKeys, setAssignKeys] = useState([]);

  const HandleUpdate = (item) =>{
    setItemSelected(item)
  }

  const HandleDelete = (item) =>{
    setItemSelected(item)
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
        {permissions?.edit && (
          <Menu.Item
            key={1}
            icon={<EditOutlined/>}
            onClick={() => HandleUpdate(item)}
          >
            Editar
          </Menu.Item>
        )}
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
              {item.person}
            </div>
          );
        },
      },
      {
        title: "Encuestas",
        render: (item) => {
          return (
            <div>{item.id_assessment}</div>
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
    </>
  )
}

export default TableAssignments