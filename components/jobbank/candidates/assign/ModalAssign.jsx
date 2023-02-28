import React, { useState } from 'react';
import MyModal from '../../../../common/MyModal';
import { optionsStatusApply } from '../../../../utils/constant';
import { getValueFilter } from '../../../../utils/functions';
import { Table, Row, Col, Button, Dropdown, Menu } from 'antd';
import moment from 'moment';
import {
    DeleteOutlined,
    RedoOutlined,
    EyeOutlined,
    EllipsisOutlined,
} from "@ant-design/icons";

const ModalAssign = ({
    visible = false,
    close =()=>{},
    itemToEdit = {},
    actionRestart = ()=>{},
    actionDelete = ()=>{},
    showResults = ()=>{},
    fetching = false
}) => {


    const [loading, setLoading] = useState();
    const [selected, setSelected] = useState({});
    const [actionType, setActionType] = useState("delete");
    const formatDate = "DD-MM-YYYY hh:mm a";

    const openAction = (item, type) =>{
        setSelected(item)
        setActionType(type)
    }

    const closeAction = () =>{
        setSelected({})
        setActionType("delete")
    }

    const confirmAction = () =>{
        setLoading(true)
        setTimeout(()=>{
            if(actionType == "restart") actionRestart(selected?.id);
            if(actionType == "delete") actionDelete(selected?.id);
            closeAction()
            setLoading(false)
        },1000)
    }

    const menuItem = (item) => {
        return (
            <Menu>
                {item?.status == 1 && (
                    <Menu.Item
                        key="1"
                        icon={<RedoOutlined />}
                        onClick={()=> openAction(item, "restart")}
                    >
                        Reiniciar evaluación
                    </Menu.Item>
                )}
                {([0,1].includes(item?.status)) && (
                    <Menu.Item
                        key="2"
                        icon={<DeleteOutlined />}
                        onClick={()=> openAction(item, "delete")}
                    >
                        Eliminar evaluación
                    </Menu.Item>
                )}
                {item?.status == 2 && (
                    <Menu.Item
                        key="3"
                        icon={<EyeOutlined />}
                        onClick={()=> {
                            closeAction()
                            showResults(item)
                        }}
                    >
                        Ver resultados
                    </Menu.Item>
                )}
            </Menu>
        );
    };

    const columns = [
        {
            title: "Fecha inicio",
            ellipsis: true,
            render: (item) => {
                if(!item.apply_date) return <></>;
                return moment(item.apply_date).format(formatDate);
            }
        },
        {
            title: "Fecha fin",
            ellipsis: true,
            render: (item) => {
                if(!item.end_date) return <></>;
                return moment(item.end_date).format(formatDate);
            }
        },
        {
            title: "Estatus",
            render: (item) => getValueFilter({
                value: item.status,
                list: optionsStatusApply,
                keyShow: 'label',
                keyEquals: 'value'
            })
        },
        {
            title: "Progreso",
            render: (item) => `${item?.progress}%`
        },
        {
            title: "Acciones",
            render: (item) =>{
                return (
                    <Dropdown overlay={() => menuItem(item)}>
                        <Button size="small">
                            <EllipsisOutlined />
                        </Button>
                    </Dropdown>
                )
            }
        }
    ]

    const styleBtn = {
        borderRadius: 10,
        border: "1px solid #cccc",
        cursor: loading ? "not-allowed" : "pointer"
    }

    return (
        <MyModal
            title={<>Historial / <span style={{color: 'rgba(0,0,0,0.5)'}}>{itemToEdit?.name}</span></>}
            visible={visible}
            close={close}
            closable={!loading}
            widthModal={800}
        >
            <Row gutter={[0,16]}>
                <Col span={24}>
                    <Table
                        rowKey="id"
                        size="small"
                        columns={columns}
                        loading={loading || fetching}
                        rowClassName={(item) => item.id == selected?.id ? "ant-table-row-selected" : null}
                        dataSource={itemToEdit?.applys ? [...itemToEdit.applys].splice(1) : []}
                        // dataSource={prueba}
                        pagination={{
                            pageSize: itemToEdit?.applys?.length,
                            // pageSize: prueba?.length,
                            hideOnSinglePage: true,
                            showSizeChanger: false
                        }}
                        scroll={{y: 400}}
                    />
                </Col>
                <Col span={24} style={{display: 'flex', alignItems: 'center'}}>
                    {Object.keys(selected)?.length > 0 && (
                        <div style={{display: 'flex', alignItems: 'center', gap: 8, marginRight: 'auto'}}>
                            <span style={{fontWeight: 500}}>{actionType == "restart"
                                ? "¿Estás seguro de reiniciar esta aplicación?"
                                : "¿Estás seguro de eliminar esta aplicación?"}
                            </span>
                            <button
                                style={styleBtn}
                                disabled={loading}
                                onClick={()=> confirmAction()}
                            >
                                {actionType == "restart" ? "Reiniciar" : "Eliminar"}
                            </button>
                            <button
                                style={styleBtn}
                                disabled={loading}
                                onClick={()=> closeAction()}
                            >
                                Cancelar
                            </button>
                        </div>
                    )}
                    <Button
                        disabled={loading}
                        onClick={()=> close()}
                        style={{marginLeft: 'auto'}}
                    >
                        Cerrar
                    </Button>
                </Col>
            </Row>
        </MyModal>
    )
}

export default ModalAssign