import React, {useEffect, useState} from "react";
import {
    Button,
    Col,
    ConfigProvider,
    DatePicker,
    Divider,
    Form,
    Input,
    message,
    Modal,
    Row,
    Space,
    Table,
    Tooltip
} from "antd";
import esES from "antd/lib/locale/es_ES";
import {
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    SearchOutlined,
    StopOutlined,
    CloudSyncOutlined,
    SyncOutlined
} from "@ant-design/icons";
import webApiPeople from "../../api/WebApiPeople";
import {withAuthSync} from "../../libs/auth";
import ModalNonWorkingDays from "./ModalNonWorkingDays";
import moment from "moment";
import {trim} from "lodash/string";

const NonWorkingDays = ({ node_id = null, ...props }) =>{
    const [form] = Form.useForm()

    const [loading, setLoading] = useState(false)
    const [loadingHolidays, setLoadingHolidays] = useState(false)
    const [searchYear, setSearchYear] = useState('')
    const [selectedItem, setSelectedItem] = useState(null)
    const [modalVisible, setModalVisible] = useState(false)
    const [modalDeleteVisible, setModalDeleteVisible] = useState(false);
    const [nonWorkingDays, setNonWorkingDays] = useState([])
    const [tablePagination, setTablePagination] = useState({
        showSizeChanger: true,
        current: 1,
        pageSize: 10,
    })

    const columns = [
        {
            title: 'Año',
            dataIndex: 'date',
            key: 'date',
            render: (item) => moment(item, 'YYYY-MM-DD').format('YYYY')
        },
        {
            title: 'Fecha',
            dataIndex: 'date',
            key: 'date',
            render: (item) => moment(item, 'YYYY-MM-DD').format('DD-MM-YYYY')
        },
        {
            title: 'Descripción',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: "Acciones",
            align: "center",
            key: "actions",
            render: (item) => {
                return (
                        <Space size={"large"}>
                            <Tooltip title="Editar">
                                <EditOutlined onClick={() => onEdit(item)} />
                            </Tooltip>
                            <Tooltip title="Eliminar">
                                <DeleteOutlined
                                    onClick={() => onDelete(item)}
                                />
                            </Tooltip>
                        </Space>
                )
            }
        }
    ]

    {/* BÚSQUEDA */}
    const handleTableChange = async (pagination, filters, sorter) => {
        setTablePagination({
            ...tablePagination,
            pagination
        })
        await getDays(pagination, searchYear)
    }

    const onYearChange = (date, dateString) => {
        setSearchYear(dateString)
    }

    const onSearch = async (values) =>{
        await getDays(tablePagination,searchYear)
    }
    const onSearchReset = async () =>{
        setSearchYear('')
        form.resetFields()
        await getDays({
            current: 1,
            pageSize: 10,
        })
    }

    {/* FUNCIONES CRUD */}
    const getDays = async ( pagination, year = new Date().getFullYear().toString()) =>{
        try{
            setLoading(true)
            let params = {
                node: node_id,
                offset: (pagination.current - 1) * pagination.pageSize,
                limit: pagination.pageSize,
                year
            }
            let response = await webApiPeople.getNonWorkingDays(params)
            const data = response.data
            setNonWorkingDays(data.results)
            setTablePagination({
                ...pagination,
                total: data.count
            })
            setLoading(false)
        }catch (e) {
            console.log(e)
            setLoading(false)
        }
    }

    const onAdd = () =>{
        setModalVisible(true)
    }

    const onEdit = (item) =>{
        setSelectedItem(item)
        setModalVisible(true)
    }

    const onSaved = async () =>{
        setModalVisible(false)
        setSelectedItem(null)
        await onSearchReset()
    }

    const onDelete = (item) =>{
        setSelectedItem(item)
        setModalDeleteVisible(true)
    }

    const onDeleteConfirm = async () =>{
        try{
            let response = await webApiPeople.deleteNonWorkingDay(selectedItem.id)

            await onSearchReset()
            setModalDeleteVisible(false)
            setSelectedItem(null)
            message.success("Día inhábil eliminado.")
        }catch (e) {
            console.log(e)
            message.error("No se pudo eliminar el día.")
            setModalDeleteVisible(false)
            setSelectedItem(null)
        }
    }

    useEffect(() => {
        if(node_id){
            getDays(tablePagination)
        }
    }, [node_id])

    const bulkHolidays=(holidays)=>{
        let arrayPromises = []
        setLoadingHolidays(true)
        console.log(nonWorkingDays)
        if(holidays){
            holidays.map((item, i)=>{
                let data = {
                    node: node_id,
                    date: item.date,
                    description: item.localName
                }
                arrayPromises.push(webApiPeople.createNonWorkingDay(data))
            })
        }

        if(arrayPromises.length>0){
            Promise.all(arrayPromises).then(values => {
                message.success('Agregado correctamente')
            }).catch(reason => {
                message.warning('No se pudieron sincronizar todos los días, probablemente algunos ya existan.')
            }).finally(()=>{
                setLoadingHolidays(false)
                onSearch(tablePagination,searchYear)
            });
        }else{
            setLoadingHolidays(false)
        }


    }

    const getHolidays=async ()=>{
        try{
            let url = `https://date.nager.at/api/v3/PublicHolidays/${searchYear}/MX`
            const response = await fetch(url)
            const jsonData = await response.json();
            bulkHolidays(jsonData)
        }catch (e){
            message.error('Hubo un error al consultar la información de los días festivos')
        }
    }


    return <>
        {/* BÚSQUEDA */}
        <Row>
            <Col md={10}>
                <ConfigProvider locale={esES}>
                    <Form form={form} scrollToFirstError onFinish={onSearch}>
                        <div style={{display: "flex", justifyContent:'flex-start', gap:8, flexWrap:'wrap'}}>
                            <Form.Item name="name" label="Filtrar">
                                <DatePicker onChange={onYearChange} picker="year" placeholder={'seleccione un año'} />
                            </Form.Item>
                            <div style={{ float: "left", marginLeft: "5px" }}>
                                <Form.Item>
                                    <Button htmlType="submit">
                                        <SearchOutlined />
                                    </Button>
                                </Form.Item>
                            </div>
                            <div style={{ float: "left", marginLeft: "5px" }}>
                                <Form.Item>
                                    <Button onClick={()=>onSearchReset()}>
                                        <SyncOutlined />
                                    </Button>
                                </Form.Item>
                            </div>
                        </div>
                    </Form>
                </ConfigProvider>
            </Col>


            <Col md={3}>
                    <Button onClick={onAdd}>
                        <PlusOutlined /> Agregar día
                    </Button>
            </Col>
        </Row>
        <Row>
            <Col>
                <Button type={'link'} size={'small'} loading={loadingHolidays} ghost={true} disabled={!searchYear} onClick={getHolidays}>
                    <CloudSyncOutlined /> Obtener días festivos desde servicio de nager.date
                </Button>
            </Col>
        </Row>
        <Divider style={{ marginTop: "2px" }} />

        {/* TABLA */}
        <Row>
            <Col span={24}>
                <ConfigProvider locale={esES}>
                    <Table
                        rowKey={"id"}
                        size={"small"}
                        columns={columns}
                        dataSource={nonWorkingDays}
                        loading={loading}
                        locale={{
                            emptyText: loading
                                ? "Cargando..."
                                : "No se encontraron resultados.",
                        }}
                        showSizeChanger={true}
                        pagination={tablePagination}
                        onChange={handleTableChange}
                    />
                </ConfigProvider>
            </Col>
        </Row>

        {/* MODALS */}
        {node_id && modalVisible &&
            <ModalNonWorkingDays
                node_id={node_id}
                nonWorkingDay={selectedItem}
                title={selectedItem ? 'Editar día inhábil' : 'Agregar día inhábil'}
                visible={modalVisible}
                onCancel={()=>{
                    setModalVisible(false)
                    setSelectedItem(null)
                }}
                onSave={onSaved}
            />
        }
        {selectedItem && modalDeleteVisible &&
            <Modal
                title="Eliminar día inhábil"
                visible={modalDeleteVisible}
                onOk={onDeleteConfirm}
                onCancel={() => {
                    setModalDeleteVisible(false)
                    setSelectedItem(null)
                }}
                okText="Sí, Eliminar"
                cancelText="Cancelar"
            >
                ¿Desea eliminar el día "{selectedItem.date}"?
            </Modal>
        }
    </>
}
export default withAuthSync(NonWorkingDays)