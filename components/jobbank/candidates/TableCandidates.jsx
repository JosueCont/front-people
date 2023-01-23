import React, { useState } from 'react';
import {
    Table,
    Button,
    Menu,
    Dropdown,
    message,
    Switch
} from 'antd';
import { connect } from 'react-redux';
import {
    EllipsisOutlined,
    DeleteOutlined,
    EditOutlined,
    DownloadOutlined
    
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import ListItems from '../../../common/ListItems';
import WebApiJobBank from '../../../api/WebApiJobBank';
import { getCandidates } from '../../../redux/jobBankDuck';
import Clipboard from '../../../components/Clipboard';
import { pdf } from '@react-pdf/renderer';
import HighDirectionReport from './HighDirectionReport';

const TableCandidates = ({
    currentNode,
    jobbank_page,
    getCandidates,
    list_candidates,
    load_candidates,
    jobbank_filters
}) => {

    const router = useRouter();
    const [itemsKeys, setItemsKeys] = useState([]);
    const [itemsToDelete, setItemsToDelete] = useState([]);
    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [infoCandidate, setInfoCandidate] = useState(null)
    const [infoEducation, setInfoEducation] = useState(null)
    const [infoExperience, setInfoExperience] = useState(null)
    const [infoPositions, setInfoPositions] = useState(null)
    const [loading, setLoading] = useState(false)

    const actionDelete = async () =>{
        let ids = itemsToDelete.map(item => item.id);
        try {
            await WebApiJobBank.deleteCandidate({ids});
            getCandidates(currentNode.id, jobbank_filters, jobbank_page);
            let msg = ids.length > 1 ? 'Candidatos eliminados' : 'Candidato eliminado';
            message.success(msg);
        } catch (e) {
            console.log(e)
            let msg = ids.length > 1 ? 'Candidatos no eliminados' : 'Candidato no eliminado';
            message.error(msg);
        }
    }

    const actionStatus = async (checked, item) =>{
        try {
            await WebApiJobBank.updateCandidateStatus(item.id, {is_active: checked});
            getCandidates(currentNode.id, jobbank_filters, jobbank_page);
            let msg = checked ? 'Candidato activado' : 'Candidato desactivado';
            message.success(msg);
        } catch (e) {
            console.log(e)
            let msg = checked ? 'Candidato no activado' : 'Candidato no desactivado';
            message.error(msg);
        }
    }

    const getInfoCandidate = async (id) =>{
        if(!id) return
        try {
            // setFetching(true);
            let responseInfo = await WebApiJobBank.getInfoCandidate(id);
            let responseEdu = await WebApiJobBank.getCandidateEducation(id, '&paginate=0');
            let responseExp = await WebApiJobBank.getCandidateExperience(id, '&paginate=0');
            let responsePos = await WebApiJobBank.getCandidateLastJob(id, '&paginate=0');
            setInfoCandidate(responseInfo.data);
            setInfoEducation(responseEdu.data)
            setInfoExperience(responseExp.data)
            setInfoPositions(responsePos.data)
            // setFetching(false);
        } catch (e) {
            console.log(e)
            // setFetching(false);
        }
    }

    const MyDoc = ({ infoCandidate, infoEducation }) =>
        <HighDirectionReport
            infoCandidate={infoCandidate? infoCandidate : {}}
            infoEducation={ infoEducation? infoEducation : []}
            // infoExperience={infoExperience}
            // infoPositions={ partialPositions?.length > 0 ? partialPositions : infoPositions}
        />
    

    const linkTo = (url, download = false ) =>{
        // let nameFile = `${infoCandidate.fisrt_name} ${infoCandidate.last_name}`;
        let nameFile = 'demo'
        const link = document.createElement("a");
        link.href = url;
        link.target = "_black";
        if(download) link.download = nameFile;
        link.click();
    }

    const generatePDF = async (id, download) =>{
        if(!id) return
        const key = 'updatable';
        message.loading({content: 'Generando PDF...', key});
        try {
            setLoading(true)
            let responseInfo = await WebApiJobBank.getInfoCandidate(id);
            let responseEdu = await WebApiJobBank.getCandidateEducation(id, '&paginate=0');
            let infoCan = responseInfo.data || {}
            let infoEducation = responseEdu.data || {}
            let resp = await pdf(<MyDoc infoCandidate={infoCan} infoEducation = {infoEducation}/>).toBlob();
            let url = URL.createObjectURL(resp);
            setTimeout(()=>{
                setLoading(false);
                message.success({content: 'PDF generado', key})
            }, 1000)
            setTimeout(()=>{  
                linkTo(url+'#toolbar=0', download);
            },2000)
        } catch (e) {
            console.log(e)
            setTimeout(()=>{
                setLoading(false)
                message.error({content: 'PDF no generado', key});
            },2000)
        }
    }

    const openModalManyDelete = () =>{
        if(itemsToDelete.length > 1){
            setOpenModalDelete(true)
        }else{
            setOpenModalDelete(false)
            message.error('Selecciona al menos dos candidatos')
        }
    }

    const openModalRemove = (item) =>{
        setItemsToDelete([item])
        setOpenModalDelete(true)
    }

    const closeModalDelete = () =>{
        setOpenModalDelete(false)
        setItemsKeys([])
        setItemsToDelete([])
    }

    const savePage = (query) => router.replace({
        pathname: '/jobbank/candidates',
        query
    })

    const onChangePage = ({current}) =>{
        let newQuery = {...router.query, page: current};
        if(current > 1){
            savePage(newQuery);
            return;
        }
        if(newQuery.page) delete newQuery.page;
        savePage(newQuery)
    }

    const rowSelection = {
        selectedRowKeys: itemsKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            setItemsKeys(selectedRowKeys)
            setItemsToDelete(selectedRows)
        }
    }

    const menuTable = () => {
        return (
            <Menu>
                <Menu.Item key='1'>
                    <Clipboard
                        text={`${window.location.origin}/jobbank/${currentNode.permanent_code}/candidate`}
                        title='Autorregistro'
                        border={false}
                        tooltipTitle='Copiar link de autorregistro'
                    />
                </Menu.Item>
                <Menu.Item
                    key='2'
                    icon={<DeleteOutlined/>}
                    onClick={()=>openModalManyDelete()}
                >
                    Eliminar
                </Menu.Item>
            </Menu>
        );
    };

    const menuItem = (item) => {
        return (
            <Menu>
                <Menu.Item key='1'>
                    <Clipboard
                        text={`${window.location.origin}/jobbank/${currentNode.permanent_code}/candidate?id=${item.id}`}
                        title='Actualización'
                        border={false}
                        tooltipTitle='Copiar link de actualización'
                    />
                </Menu.Item>
                <Menu.Item
                    key='2'
                    icon={<EditOutlined/>}
                    onClick={()=> router.push({
                        pathname: `/jobbank/candidates/edit`,
                        query:{...router.query, id: item.id }
                    })}
                >
                    Editar
                </Menu.Item>
                <Menu.Item
                    key='3'
                    icon={<DeleteOutlined/>}
                    onClick={()=> openModalRemove(item)}
                >
                    Eliminar
                </Menu.Item>
                <Menu.Item
                    key='4'
                    icon={<DownloadOutlined />}
                    onClick={() => { generatePDF(item.id, true) }}
                >
                    Descargar reporte alta dirección
                </Menu.Item>
            </Menu>
        );
    };

    const columns = [
        {
            title: 'Nombre',
            dataIndex: 'fisrt_name',
            key: 'fisrt_name',
            ellipsis: true
        },
        {
            title: 'Apellidos',
            dataIndex: 'last_name',
            key: 'last_name',
            ellipsis: true
        },
        {
            title:'Correo electrónico',
            dataIndex: 'email',
            key: 'email',
            ellipsis: true
        },
        {
            title: 'Teléfono',
            dataIndex: 'cell_phone',
            key: 'cell_phone'
        },
        {
            title: 'Estatus',
            render: (item) =>{
                return(
                    <Switch
                        size='small'
                        defaultChecked={item.is_active}
                        checked={item.is_active}
                        checkedChildren="Activo"
                        unCheckedChildren="Inactivo"
                        onChange={(e)=> actionStatus(e, item)}
                    />
                )
            }
        },
        {
            title: ()=>{
                return(
                    <Dropdown overlay={menuTable}>
                        <Button size={'small'}>
                            <EllipsisOutlined />
                        </Button>
                    </Dropdown>
                )
            },
            render: (item) =>{
                return (
                    <Dropdown overlay={()=> menuItem(item)}>
                        <Button size={'small'}>
                            <EllipsisOutlined />
                        </Button>
                    </Dropdown>
                )
            }
        }
    ]

    return (
        <>
            <Table
                size='small'
                rowKey='id'
                columns={columns}
                dataSource={list_candidates.results}
                loading={load_candidates}
                rowSelection={rowSelection}
                onChange={onChangePage}
                locale={{
                    emptyText: load_candidates
                        ? 'Cargando...'
                        : 'No se encontraron resultados.',
                }}
                pagination={{
                    total: list_candidates.count,
                    current: jobbank_page,
                    hideOnSinglePage: true,
                    showSizeChanger: false
                }}
            />
            <ListItems
                title={itemsToDelete.length > 1
                    ? '¿Estás seguro de eliminar estos candidatos?'
                    : '¿Estás seguro de eliminar este candidato?'
                }
                visible={openModalDelete}
                keyTitle='fisrt_name'
                keyDescription='last_name'
                close={closeModalDelete}
                itemsToList={itemsToDelete}
                actionConfirm={actionDelete}
            />
        </>
    )
}

const mapState = (state) =>{
    return {
        list_candidates: state.jobBankStore.list_candidates,
        load_candidates: state.jobBankStore.load_candidates,
        jobbank_page: state.jobBankStore.jobbank_page,
        jobbank_filters: state.jobBankStore.jobbank_filters,
        currentNode: state.userStore.current_node
    }
}

export default connect(
    mapState, { getCandidates }
)(TableCandidates);