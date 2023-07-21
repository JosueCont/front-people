import React, { useState, useEffect } from "react";
import {
    Table,
    Dropdown,
    Menu,
    Button,
    Tooltip,
    Space,
    Tag,
    message
} from "antd";
import {
    DeleteOutlined,
    RedoOutlined,
    RetweetOutlined,
    EyeOutlined,
    SolutionOutlined,
    MinusCircleOutlined,
    EllipsisOutlined,
    UserOutlined,
    UsergroupAddOutlined,
} from "@ant-design/icons";
import { optionsStatusApply } from "../../../../utils/constant";
import { getValueFilter, deleteFiltersJb } from "../../../../utils/functions";
import ModalAssign from "./ModalAssign";
import { useRouter } from "next/router";
import WebApiAssessment from "../../../../api/WebApiAssessment";
import ListItems from '../../../../common/ListItems';
import { useViewResults } from "../../hook/useViewResults";
import moment from "moment";

const TableAssign = ({
    loading = false,
    evaluations = [],
    getEvaluations =()=>{},
    fetching = false,
    infoCandidate = {}
}) => {

    const router = useRouter();
    const formatTable = "DD-MM-YYYY hh:mm a";
    const [itemToEdit, setItemToEdit] = useState({});
    const [itemsToDelete, setItemsToDelete] = useState([]);
    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [actionType, setActionType] = useState("delete");
    const [withAction, setWithAction] = useState(true);
    const [loadResults, setLoadResults] = useState({});
    const { validateGetResults } = useViewResults({
        loadResults,
        setLoadResults,
        infoPerson: infoCandidate
    });
    const watchAssign = [
        router.query?.open_history,
        router.query?.selected
    ];

    useEffect(()=>{
        setItemToEdit({})
        let evaluation_id = router.query?.selected;
        if(!evaluation_id) return;
        const find_ = item => item.id == evaluation_id;
        let result = evaluations.find(find_);
        if(!result) return;
        setItemToEdit(result) 
    },[evaluations, ...watchAssign])

    //Reaplicar
    //Puede que este sea para reiniciar
    const actionReapply = async () =>{
        try {
            let assessment = itemsToDelete.at(-1)?.id;
            let body = { assessment, user_id: router.query?.person};
            await WebApiAssessment.restartAssessmentUser(body);
            getEvaluations(router.query?.person)
            message.success('Evaluación reaplicada')
        } catch (e) {
            console.log(e)
            message.error('Evaluación no reaplicada')
        }
    }

    //Reiniciar
    //Puede que este sea para reaplicar
    const actionRestart = async (id) =>{
        try {
            let apply_id = id ?? itemsToDelete.at(-1)?.applys[0]?.id;
            await WebApiAssessment.resetAssessmentUser({apply_id});
            getEvaluations(router.query?.person)
            message.success('Aplicación reiniciada')
        } catch (e) {
            console.log(e)
            message.error('Aplicación no reiniciada')
        }
    }

    //Eliminar
    const actionDelete = async (id) =>{
        try {
            let apply_id = id ?? itemsToDelete.at(-1)?.applys[0]?.id;
            await WebApiAssessment.deleteAssessmentUser({apply_id});
            getEvaluations(router.query?.person)
            message.success('Aplicación eliminada')
        } catch (e) {
            message.error('Aplicación no eliminida')
        }
    }

    //Desasignar
    const actionDeallocate = async ()=>{
        try {
            let assessment = itemsToDelete.at(-1)?.id;
            let body = { assessment, user_id: router.query?.person};
            await WebApiAssessment.deleteAssessmentPersonal(body);
            getEvaluations(router.query?.person)
            message.success('Evaluación desasignada')
        } catch (e) {
            console.log(e)
            message.error('Evaluación no desasignada')
        }
    }

    const setFilters = (filters = {}) => router.replace({
        pathname: '/jobbank/candidates/assign',
        query: filters
    }, undefined, {shallow:true})

    const openHistory = (item) =>{
        setFilters({
            ...router.query,
            open_history: true,
            selected: item.id
        })
    }

    const closeHistory = () =>{
        let deleteKeys = ['open_history','selected'];
        let params = deleteFiltersJb({...router.query}, deleteKeys);
        setFilters(params)
    }

    const openModalGroups = (item) =>{
        setWithAction(false)
        setOpenModalDelete(true)
        setItemsToDelete(item.groups)
    }

    const openModalRemove = (item, type) =>{
        setActionType(type)
        setItemsToDelete([item])
        setOpenModalDelete(true)
        setWithAction(true)
    }

    const closeModalDelete = () =>{
        setOpenModalDelete(false)
        setWithAction(true)
        // setActionType("delete")
        setItemsToDelete([])
    }

    const menuItem = (item) => {
        const earring_ = (record) => record.status == 0;
        const finished_ = (record) => record.status == 2;
        let earring = item.applys?.some(earring_);
        let finished = item.applys?.some(finished_);
        return (
            <Menu>
                {([0,2].includes(item.applys[0]?.status) || item.applys?.length <= 0)
                    && !earring && (
                    <Menu.Item
                        key="1"
                        icon={<RetweetOutlined/>}
                        onClick={()=> openModalRemove(item, "reapply")}
                    >
                        Reaplicar evaluación
                    </Menu.Item>
                )}
                {item.applys[0]?.status == 1 && (
                    <Menu.Item
                        key="2"
                        icon={<RedoOutlined />}
                        onClick={()=> openModalRemove(item, "restart")}
                    >
                        Reiniciar aplicación
                    </Menu.Item>
                )}
                {[0,1].includes(item.applys[0]?.status) && (
                    <Menu.Item
                        key="3"
                        icon={<DeleteOutlined />}
                        onClick={()=> openModalRemove(item, "delete")}
                    >
                        Eliminar aplicación
                    </Menu.Item>
                )}
                {!finished && item.origins?.includes('personal') && (
                    <Menu.Item
                        key="4"
                        icon={<MinusCircleOutlined />}
                        onClick={()=> openModalRemove(item, "deallocate")}
                    >
                        Desasignar evaluación
                    </Menu.Item>
                )}
                {item.applys[0]?.status == 2 && (
                    <Menu.Item
                        key="5"
                        icon={<EyeOutlined />}
                        onClick={()=> validateGetResults(item)}
                    >
                        Ver resultados
                    </Menu.Item>
                )}
            </Menu>
        );
    };

    const columns = [
        {
            title: "Evaluación",
            ellipsis: true,
            render: (item) =>{
                const some_ = item => item == 'personal';
                let is_personal = item.origins?.some(some_);
                return (
                    <>
                        {is_personal
                            ? <UserOutlined title="Personal" style={{color: '#ed6432'}}/>
                            : <UsergroupAddOutlined title="Grupal" style={{color: '#814cf2'}}/>
                        }
                        <span title={item.name} style={{marginInlineStart: 5}}>
                            {item.name}
                        </span>
                    </>
                )
            }
        },
        {
            title: "Grupo",
            ellipsis: true,
            render: (item) =>{
                if(item.groups?.length <= 0) return null;
                if(item.groups?.length == 1) return item.groups[0]?.name;
                return (
                    <Space>
                        <Tooltip title='Ver grupos'>
                            <EyeOutlined
                                style={{cursor: 'pointer'}}
                                onClick={()=> openModalGroups(item)}
                            />
                        </Tooltip>
                        <Tag
                            icon={<UsergroupAddOutlined style={{color:'#52c41a'}} />}
                            color='green' style={{fontSize: '14px'}}
                        >
                            {item.groups?.length}
                        </Tag>
                    </Space>
                )
            }
        },
        {
            title: "Fecha inicio",
            ellipsis: true,
            render: (item) => {
                if(item.applys?.length <= 0) return null;
                let date = item.applys[0]?.apply_date;
                return date ? moment(date).format(formatTable) : null;
            }
        },
        {
            title: "Fecha fin",
            ellipsis: true,
            render: (item) => {
                if(item.applys?.length <= 0) return null;
                let date = item.applys[0]?.end_date;
                return date ? moment(date).format(formatTable) : null;
            }
        },
        {
            title: "Estatus",
            render: (item) =>{
                if(item.applys?.length <= 0) return 'Pendiente';
                return getValueFilter({
                    value: `${item.applys[0]?.status}`,
                    list: optionsStatusApply,
                    keyShow: 'label',
                    keyEquals: 'value'
                })
            }
        },
        {
            title: "Progreso",
            render: (item) =>{
                if(item.applys?.length <= 0) return null;
                let progress = `${item.applys[0]?.progress}`;
                return progress ? `${progress}%`  : null;
            }
        },
        {
            title: "Historial",
            render: (item) =>{
                if([0,1].includes(item.applys?.length)) return null;
                return (
                    <Space>
                        <Tooltip title='Ver historial'>
                            <EyeOutlined
                                style={{cursor: 'pointer'}}
                                onClick={()=> openHistory(item)}
                            />
                        </Tooltip>
                        <Tag
                            icon={<SolutionOutlined style={{color:'#52c41a'}} />}
                            color='green' style={{fontSize: '14px'}}
                        >
                            {item.applys?.length - 1}
                        </Tag>
                    </Space>
                )
            }
        },
        {
            title: "Acciones",
            width: 80,
            render: (item) => {
                return (
                    <Dropdown placement='bottomRight' overlay={() => menuItem(item)}>
                        <Button size="small">
                            <EllipsisOutlined />
                        </Button>
                    </Dropdown>
                );
            },
        },
    ];

    const mapAction = {
        deallocate: ["Desasignar","¿Estás seguro de desasignar esta evaluación?", actionDeallocate],
        restart: ["Reiniciar", "¿Estás seguro de reiniciar esta aplicación?", actionRestart],
        reapply: ["Reaplicar","¿Estás seguro de reaplicar esta evaluación?", actionReapply],
        delete: ["Eliminar", "¿Estás seguro de eliminar esta aplicación?", actionDelete]
    };

    return (
        <>
            <Table
                rowKey="id"
                size="small"
                columns={columns}
                loading={loading}
                dataSource={evaluations}
                pagination={{
                    pageSize: evaluations?.length,
                    hideOnSinglePage: true,
                    showSizeChanger: false
                }}
            />
            <ModalAssign
                visible={router.query?.selected
                    && router.query?.open_history == 'true'
                    && Object.keys(itemToEdit).length > 0
                }
                itemToEdit={itemToEdit}
                close={closeHistory}
                actionRestart={actionRestart}
                actionDelete={actionDelete}
                showResults={e => validateGetResults({...itemToEdit, applys: [e]})}
                fetching={fetching}
            />
            <ListItems
                title={withAction ? mapAction[actionType][1] : 'Listado de grupos'}
                visible={openModalDelete}
                keyTitle='name'
                // keyDescription={withAction ? 'applys, 0, apply_date' : ''}
                close={closeModalDelete}
                itemsToList={itemsToDelete}
                actionConfirm={mapAction[actionType][2]}
                textConfirm={mapAction[actionType][0]}
                textCancel={withAction ? 'Cancelar' : 'Cerrar'}
                useWithAction={withAction}
            />
        </>
    );
};

export default TableAssign;
