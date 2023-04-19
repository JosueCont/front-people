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
    SyncOutlined
} from "@ant-design/icons";
import webApiPeople from "../../api/WebApiPeople";
import {withAuthSync} from "../../libs/auth";
import ModalNonWorkingDays from "./ModalNonWorkingDays";
import moment from "moment";

const NonWorkingDays = ({ node_id = null, ...props }) =>{
    const [form] = Form.useForm()

    const [loading, setLoading] = useState(false)
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
    const getDays = async ( pagination, year = '') =>{
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


    return <>
        {/* BÚSQUEDA */}
        <Row>
            <Col span={18}>
                <Form form={form} scrollToFirstError onFinish={onSearch}>
                    <Row>
                        <Col span={16}>
                            <Form.Item name="name" label="Filtrar">
                                <DatePicker onChange={onYearChange} picker="year" placeholder={'seleccione un año'} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
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
                        </Col>
                    </Row>
                </Form>
            </Col>

            <Col span={6} style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button onClick={onAdd}>
                        <PlusOutlined /> Agregar día
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