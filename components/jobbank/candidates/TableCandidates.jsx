import React, { useState, useMemo, useEffect } from 'react';
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
    DownloadOutlined,
    LinkOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import ListItems from '../../../common/ListItems';
import WebApiJobBank from '../../../api/WebApiJobBank';
import { getCandidates } from '../../../redux/jobBankDuck';
import { pdf } from '@react-pdf/renderer';
import HighDirectionReport from './HighDirectionReport';
import CandidateReport from './CandidateReport';
import { copyContent } from '../../../utils/functions';

const TableCandidates = ({
    currentNode,
    jobbank_page,
    getCandidates,
    list_candidates,
    load_candidates,
    jobbank_filters,
    jobbank_page_size
}) => {

    const router = useRouter();
    const [itemsKeys, setItemsKeys] = useState([]);
    const [itemsToDelete, setItemsToDelete] = useState([]);
    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [loading, setLoading] = useState(false);
    const [useToDelete, setUseToDelete] = useState(true);
    const [widthAndHeight, setWidthAndHeight] = useState({
        width: 0,
        height: 0
    })
    const image = currentNode?.image? currentNode.image : ''

    useEffect(() => {
        if(image){
            const widthImage = new Image()
            widthImage.src = image
            widthImage.onload = () => {
            setWidthAndHeight({
                width: widthImage.width,
                height: widthImage.height
            })
    }
        }
    },[image])

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

    const MyDoc = ({ infoCandidate, infoEducation, infoPositions }) =>
        <HighDirectionReport
            infoCandidate={infoCandidate}
            infoEducation={ infoEducation}
            infoPositions={infoPositions}
            image = { image }
            widthAndHeight = {widthAndHeight}
            
        />
    const NyCandidateReport = ({infoCandidate, infoEducation, infoExperience, infoPositions, }) => 

    <CandidateReport
        infoCandidate={infoCandidate}
        infoEducation={ infoEducation}
        infoExperience = { infoExperience }
        infoPositions={ infoPositions}
        image = { image }
        widthAndHeight = {widthAndHeight}
    />
    

    const linkTo = (url, download = false, nameCandidate, type ) =>{

        let nameFile = nameCandidate !== ''? 
                            type === 1?
                                `Reporte de alta dirección ${nameCandidate}`
                            :
                                `Reporte de ${nameCandidate}`
                        : 
                            'demo'
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
            let responsePos = await WebApiJobBank.getCandidateLastJob(id, '&paginate=0')
            let infoCan = responseInfo.data || {}
            let infoEducation = responseEdu.data || []
            let infoPositions = responsePos.data || []
            let nameCandidate = `${infoCan.first_name} ${infoCan.last_name}`
            let resp = await pdf(<MyDoc infoCandidate={infoCan} infoEducation = {infoEducation} infoPositions = {infoPositions}/>).toBlob();
            let url = URL.createObjectURL(resp);
            setTimeout(()=>{
                setLoading(false);
                message.success({content: 'PDF generado', key})
            }, 1000)
            setTimeout(()=>{  
                linkTo(url+'#toolbar=0', download, nameCandidate, 1);
            },2000)
        } catch (e) {
            console.log(e)
            setTimeout(()=>{
                setLoading(false)
                message.error({content: 'PDF no generado', key});
            },2000)
        }
    }

    const generateReportCandidate = async (id, download) => {
        if(!id) return
        const key = 'updatable';
        message.loading({content: 'Generando PDF...', key});
        try {
            setLoading(true)
            let responseInfo = await WebApiJobBank.getInfoCandidate(id);
            let responseEdu = await WebApiJobBank.getCandidateEducation(id, '&paginate=0');
            let responsePos = await WebApiJobBank.getCandidateLastJob(id, '&paginate=0')
            let responseExp = await WebApiJobBank.getCandidateExperience(id, '&paginate=0')
            let infoCan = responseInfo.data || {}
            let infoEducation = responseEdu.data || []
            let infoExp = responseExp.data || []
            let infoPositions = responsePos.data || []
            let nameCandidate = `${infoCan.first_name} ${infoCan.last_name}`
            let resp = await pdf(
                                <NyCandidateReport 
                                    infoCandidate={infoCan} 
                                    infoEducation = {infoEducation} 
                                    infoExperience  = { infoExp } 
                                    infoPositions = {infoPositions}
                                />).toBlob();
            let url = URL.createObjectURL(resp);
            setTimeout(()=>{
                setLoading(false);
                message.success({content: 'PDF generado', key})
            }, 1000)
            setTimeout(()=>{  
                linkTo(url+'#toolbar=0', download, nameCandidate, 2);
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
        const filter_ = item => item.in_selection_process;
        let notDelete = itemsToDelete.filter(filter_);
        if(notDelete.length > 0){
            setUseToDelete(false)
            setOpenModalDelete(true)
            setItemsToDelete(notDelete)
            return;
        }
        setUseToDelete(true);
        if(itemsToDelete.length > 1){
            setOpenModalDelete(true)
            return;
        }
        setOpenModalDelete(false)
        message.error('Selecciona al menos dos candidatos')
    }

    const titleDelete = useMemo(()=>{
        if(!useToDelete){
            return itemsToDelete.length > 1
            ? `Estos candidatos no se pueden eliminar, ya que
                se encuentran en un proceso de selección`
            : `Este candidato no se puede eliminar, ya que
                se encuentra en un proceso de selección`;
        }
        return itemsToDelete.length > 1
            ? '¿Estás seguro de eliminar estos candidatos?'
            : '¿Estás seguro de eliminar este candidato?';
    },[useToDelete, itemsToDelete])

    const openModalRemove = (item) =>{
        setUseToDelete(!item?.in_selection_process)
        setItemsToDelete([item])
        setOpenModalDelete(true)
    }

    const closeModalDelete = () =>{
        setOpenModalDelete(false)
        setUseToDelete(true)
        setItemsKeys([])
        setItemsToDelete([])
    }

    const onChangePage = ({current, pageSize}) =>{
        let filters = {...router.query, page: current, size: pageSize};
        router.replace({
            pathname: '/jobbank/candidates',
            query: filters
        })
    }

    const rowSelection = {
        selectedRowKeys: itemsKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            setItemsKeys(selectedRowKeys)
            setItemsToDelete(selectedRows)
        }
    }

    const copyLinkAutoregister = () =>{
        copyContent({
            text: `${window.location.origin}/jobbank/${currentNode.permanent_code}/candidate`,
            onSucces: ()=> message.success('Link de autorregistro copiado'),
            onError: () => message.error('Link de autorregistro no copiado')
        })
    }

    const copyLinkUpdate = (item) =>{
        copyContent({
            text: `${window.location.origin}/jobbank/${currentNode.permanent_code}/candidate?id=${item.id}`,
            onSucces: ()=> message.success('Link de actualización copiado'),
            onError: () => message.error('Link de actualización no copiado')
        })
    }

    const menuTable = () => {
        return (
            <Menu>
                <Menu.Item
                    key='1'
                    icon={<LinkOutlined/>}
                    onClick={()=> copyLinkAutoregister()}
                >
                    Autorregistro
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
                <Menu.Item
                    key='1'
                    icon={<LinkOutlined/>}
                    onClick={() => copyLinkUpdate(item)}
                >
                    Actualización
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
                <Menu.SubMenu title="Descargar reporte" icon={<DownloadOutlined />}>
                    <Menu.Item
                        key='4'
                        onClick={() => generatePDF(item.id, true)}
                    >
                        Reporte alta dirección
                    </Menu.Item>
                    <Menu.Item
                        key='5'
                        onClick={() => { generateReportCandidate(item.id, true) }}
                    >
                        Reporte de candidato
                    </Menu.Item>
                </Menu.SubMenu>
            </Menu>
        );
    };

    const columns = [
        {
            title: 'Nombre',
            dataIndex: 'first_name',
            key: 'first_name',
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
                    pageSize: jobbank_page_size,
                    current: jobbank_page,
                    hideOnSinglePage: list_candidates?.count < 10,
                    showSizeChanger: list_candidates?.count > 10
                }}
            />
            <ListItems
                title={titleDelete}
                visible={openModalDelete}
                keyTitle={['first_name','last_name']}
                keyDescription='email'
                close={closeModalDelete}
                itemsToList={itemsToDelete}
                actionConfirm={actionDelete}
                textCancel={useToDelete ? 'Cancelar' : 'Cerrar'}
                useWithAction={useToDelete}
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
        currentNode: state.userStore.current_node,
        jobbank_page_size: state.jobBankStore.jobbank_page_size
    }
}

export default connect(
    mapState, { getCandidates }
)(TableCandidates);