import React, { useEffect, useState } from 'react'
import MainLayout from "../../../layout/MainInter";
import { Breadcrumb, Button, Card, Col, Form, Input, InputNumber, Modal, Popconfirm, Row, Select, Space, Spin, Table, Tooltip, Typography, Upload, message } from 'antd';
import router, { useRouter } from "next/router";
import { verifyMenuNewForTenant, downLoadFileBlobAwait, getDomain } from "../../../utils/functions";
import { API_URL_TENANT } from "../../../config/config";
import WebApiPayroll from "../../../api/WebApiPayroll";
import { connect } from 'react-redux';
import { withAuthSync } from "../../../libs/auth";
import { CheckOutlined, CloseOutlined, DownloadOutlined, EditOutlined, FilePdfTwoTone, FileTextTwoTone, SearchOutlined, UploadOutlined } from '@ant-design/icons';
import { CancelOutlined } from '@material-ui/icons';

const ExtraordinaryPayment = ({...props}) => {
    const route = useRouter();
    const [form] = Form.useForm()
    const [formTable] = Form.useForm()
    const [loadingCalendars, setLoadingCalendars] = useState(false)
    const [optionspPaymentCalendars, setOptionsPaymentCalendars] = useState([]);
    const [paymentCalendars, setPaymentCalendars] = useState([]);
    const [periodSelected, setPeriodSelcted] = useState(null);
    const [calendarSelect, setCalendarSelect] = useState(null);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [dataList, setDataList] = useState([])
    const [loading, setLoading] = useState(false)
    const [editingKey, setEditingKey] = useState('');
    const [currentFile, setCurrentFile] = useState(null)
    const [fileName, setFileName] = useState(null)
    const [openModal, setOpenModal] = useState(false)
    const [consolidation, setConsolidation] = useState(null)

    const isEditing = (record) => record.key === editingKey;

    const edit = (record) => {
        console.log('record', record)
        formTable.setFieldsValue({ 
            "concept": {description: record.concept.description},
            "concept": {amount:record.concept.amount}
        })
        console.log('formTable',formTable)
        setEditingKey(record.key);
    };

    const cancel = () => {
        setEditingKey('');
      };

    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
      };

    const columns = [
        {
            title: 'Nombre',
            dataIndex: 'name'
        },
        {
            title: "Valor",
            dataIndex: ["concept", "value"]
        },
        {
            title: "Descripción",
            dataIndex: ["concept", "description"],
                editable: true,

        },
        {
            title: "cantidad",
            dataIndex: ["concept", "amount"],
            editable: true,

        },
        {
            title: "Acciones",
            render: (record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Tooltip title="Guardar">
                            <Typography.Link
                                onClick={() => save(record.key) }
                                style={{ marginRight: 8 }}
                            >
                                <CheckOutlined />
                            </Typography.Link>
                        </Tooltip>
                        <Tooltip title="Cancelar">
                            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                                <CloseOutlined />
                            </Popconfirm>
                        </Tooltip>
                    </span>
                ) : (
                    <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                        <EditOutlined/>
                    </Typography.Link>
                )
            }
        },
        {
            title: "",
            render: (item) => {
                return <>
                    <Tooltip title="Comprobante" key={item.person_id} color={"#3d78b9"}>
                        <FilePdfTwoTone
                            twoToneColor="#34495E"
                            /* onClick={() => downloadReceipt(item)} */
                            style={{ fontSize: "25px" }}
                        />
                        </Tooltip>
                        <Tooltip title="XML" color={"#3d78b9"} key={"#3d78b9"}>
                            <FileTextTwoTone
                                /* onClick={() => downLoadFile(item, 1)} */
                                style={{ fontSize: "25px" }}
                            />
                    </Tooltip>
                </>
            }
        }
    ]

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
        selections: [
          Table.SELECTION_ALL,
          Table.SELECTION_INVERT,
          Table.SELECTION_NONE,
        ]
      };

    const getPaymentCalendars = async (value) => {
        setLoadingCalendars(true)
        await WebApiPayroll.getPaymentCalendar(value)
          .then((response) => {
            const calendarFilter = response.data.results.filter(
              (item) => item.perception_type.code != "046"
            );
            setPaymentCalendars(calendarFilter);
            let calendars = calendarFilter.map((item, index) => {
              return { key: item.id, label: item.name, value: item.id };
            });
            setOptionsPaymentCalendars(calendars);
            setLoadingCalendars(false)
          })
          .catch((error) => {
            console.log(error);
            message.error(messageError);
          });
      };

      const resetState = () => {
        form.resetFields();
        setCalendarSelect(null);
        setPeriodSelcted(null);
        setDataList([])
      };

    const changeCalendar = (value) => {
        console.log('value', value)
        if (!value) {
          resetState();
          return;
        }
        const calendar = paymentCalendars.find((item) => item.id === value);
        let period = calendar.periods.find((p) => p.active == true);
        if (!period) period = calendar.periods[0];
        setPeriodSelcted(period);
        setCalendarSelect(calendar);
        getCalculateCreditNote(period.id)
        form.setFieldsValue({
          period: `${period.name}.- ${period.start_date} - ${period.end_date}`,
        });
    };

    useEffect(() => {
        if (props.currentNode) getPaymentCalendars(props.currentNode.id);
    }, [props.currentNode]);

    const changePeriod = (period_id) => {
        getCalculateCreditNote(period_id)
    }

    const getCalculateCreditNote = async (id) => {
        try {
            setLoading(true)
            let data = { payment_period : id }
            let resp = await WebApiPayroll.getCalculateCreditNote(data)
            if(resp.status === 200){
                setConsolidation(resp?.data?.consolidation)
                let dataInfo = resp?.data?.credit_notes?.map(item => {
                    item.key = item.person_id
                    return item
                })
                setDataList(dataInfo)
            }
            setLoading(false)
        } catch (error) {
            setConsolidation(null)
            setDataList([])
            setLoading(false)
            if(error.response.data.message){
                message.error(error.response.data.message)
            }
            
        }
    }

    const sendData = () => {
        console.log('rowSelections', rowSelection.selectedRowKeys)
    }

    const EditableCell = ({
        editing,
        dataIndex,
        title,
        inputType,
        record,
        index,
        children,
        ...restProps
      }) => {
        const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
        return (
          <td {...restProps}>
            {editing ? (
              <Form.Item
                name={dataIndex}
                style={{
                  margin: 0,
                }}
                rules={[
                  {
                    required: true,
                    message: `Please Input ${title}!`,
                  },
                ]}
              >
                {inputNode}
              </Form.Item>
            ) : (
              children
            )}
          </td>
        );
      };

      const mergedColumns = columns.map((col) => {
        if (!col.editable) {
          return col;
        }
        return {
          ...col,
          onCell: (record) => ({
            record,
            inputType: col.dataIndex === ['concept', 'amount'] ? 'number' : 'text',
            dataIndex: col.dataIndex,
            title: col.title,
            editing: isEditing(record),
          }),
        };
      });

      const save = async (key) => {
        try {
            const row = await formTable.validateFields();
            const newData = [...dataList];
            const index = newData.findIndex((item) => key === item.key);

            if (index > -1) {
              const item = newData[index];

              const newItem = item
              newItem['concept']['description'] = row['concept']['description']
              newItem['concept']['amount'] = row['concept']['amount']

              newData.splice(index, 1, {
                ...item,
                ...newItem,
              });
              
              setDataList(newData);
              setEditingKey('');
              formTable.resetFields()
            } else {
              newData.push(row);
              setData(newData);
              setEditingKey('');
            }
          } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
          }
      };

    const saveCloseList = async (status=0) => {
        try {
            setLoading(true)
            let data = {
                payment_period: periodSelected.id,
                status: status,
                credit_notes: dataList
            }   
            let resp = await WebApiPayroll.saveConsolidationCreditNote(data)
            if(resp.status === 200){
                if(status===0){
                    message.success("Información de pagos guardada")
                }else if(status===1){
                    message.success("información cerrada")
                }
                getCalculateCreditNote(periodSelected.id)
            }
            setLoading(false)
        } catch (error) {
            setLoading(false)
            message.error(error?.response?.data?.message)
        }   
    }

    const closeModal = () =>{
        setOpenModal(false)
        setCurrentFile(null)
        setFileName(null)
    }

    const showModal = () => {
        setOpenModal(true)
        setCurrentFile(null)
        setFileName(null)
    }

    const SendList = async () => {
        let data = {
            credit_notes: dataList
        }
        downLoadFileBlobAwait(
            `${getDomain(API_URL_TENANT)}/payroll/export_credit_note_layout`,
            "Pagos extraordinarios.xlsx",
            "POST",
            data,
            "No se encontraron resultados",
            setLoading
        )
    }

    const UpListByExcel = (newArray) => {
        let newList = [...dataList]
        let newDataList = newArray.map(item => {
            let idx = newList.findIndex(itemList => item.person_id === itemList.person_id)
            if (idx > -1) {
                const element = newList[idx];
                element['concept'] = item['concept']
                return element
            }
        })
        setDataList(newDataList)
    }

    const uploadLayout = async () => {
        try {
            setLoading(true)
            let formData = new FormData()
            formData.append('File', currentFile)
            formData.append('payment_period', periodSelected.id)
            let resp = await WebApiPayroll.UploadCreditNoteLayout(formData)
            if(resp.status === 200){
                closeModal()
                setLoading(false)
                UpListByExcel(resp.data)
            }
        } catch (error) {
            console.log('error', error)
        }
    }


  return (
    <MainLayout
        currentKey={["extraordinaryPayment"]}
        defaultOpenKeys={["managementRH", "payroll"]}
      >
        <Breadcrumb>
          <Breadcrumb.Item
            className={"pointer"}
            onClick={() => route.push({ pathname: "/home/persons/" })}
          >
            Inicio
          </Breadcrumb.Item>
          {verifyMenuNewForTenant() && (
            <Breadcrumb.Item>Administración de RH</Breadcrumb.Item>
          )}
          <Breadcrumb.Item>Nómina</Breadcrumb.Item>
          <Breadcrumb.Item>Pagos extraordinarios</Breadcrumb.Item>
        </Breadcrumb>
        <div className="container" style={{ width: "100%" }}>
        <Row gutter={[10, 10]} >
            <Col span={24}>
                <Card className="form_header">
                    <Row justify='space-between'>
                        <Col span={20}>
                            <Form form={form} layout="vertical">
                                <Row gutter={[16, 8]}>
                                    <Col xxs={24} xl={6}>
                                        <Form.Item name="calendar" label="Calendario">
                                            <Select
                                                disabled={loadingCalendars}
                                                loading={loadingCalendars}
                                                size="large"
                                                style={{ width: "100%" }}
                                                options={optionspPaymentCalendars}
                                                onChange={changeCalendar}
                                                placeholder={loadingCalendars ? "Cargando..." : "Calendarios"}
                                                notFoundContent={"No se encontraron resultados."}
                                                allowClear
                                            />
                                        </Form.Item>
                                    </Col>
                                    {periodSelected && (
                                        <>
                                            <Col xxs={24} xl={6}>
                                                <Form.Item name="periodicity" label="Periodicidad">
                                                    <Input
                                                    size="large"
                                                    key="periodicity"
                                                    placeholder="Periodicidad"
                                                    disabled={true}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col xxs={24} xl={8}>
                                                <Form.Item name="period" label="Periodo">
                                                    <Select
                                                    placeholder="Periodo"
                                                    size="large"
                                                    onChange={(value) => changePeriod(value)}
                                                    options={
                                                        calendarSelect
                                                        ? calendarSelect.periods
                                                            .sort((a, b) => a.name - b.name)
                                                            .map((item) => {
                                                                return {
                                                                value: item.id,
                                                                label: `${item.name}.- ${item.start_date} - ${item.end_date}`,
                                                                key: item.id,
                                                                };
                                                            })
                                                        : []
                                                    }
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </>
                                    )}
                                </Row>
                            </Form>
                        </Col>
                        {
                            calendarSelect &&
                            <>
                                <Col span={4}>
                                    <Space direction="vertical">
                                        <Button icon={<DownloadOutlined/>}  style={{ width:'100%' }} onClick={SendList}>
                                            Descargar
                                        </Button>               
                                        <Button icon={<UploadOutlined/>} style={{ width:'100%' }} onClick={() => showModal()}>
                                            Cargar
                                        </Button>               
                                    </Space>
                                </Col>
                                <Col span={24}>
                                    <Space>
                                        <Button onClick={() => saveCloseList(0)} disabled={loading}>
                                            Guardar cambios
                                        </Button>
                                        {
                                            consolidation && 
                                            <Button  onClick={() => saveCloseList(1)} style={{ width:150 }} disabled={loading}>
                                                Cerrar
                                            </Button>
                                        }
                                        {
                                            consolidation && consolidation.status === 1 &&
                                            <Button  style={{ width:150 }} onClick={sendData} disabled={loading}>
                                                Timbrar
                                            </Button>
                                        }
                                        
                                    </Space>
                                </Col>
                            </>
                        }
                    </Row>
                    <Row>
                        <Col span={24} component={false} style={{ paddingTop:30 }}>
                            <Form form={formTable}>
                                <Table
                                    components={{
                                        body: {
                                        cell: EditableCell,
                                        },
                                    }}
                                    rowClassName="editable-row"
                                    loading={loading}
                                    columns={mergedColumns}
                                    dataSource={dataList}
                                    rowSelection={rowSelection}
                                />
                            </Form>
                        </Col>
                    </Row>
                </Card>
                <Modal
                    title={"Cargar layout"}
                    visible={openModal}
                    onOk={() => uploadLayout()}
                    onCancel={() => closeModal()}
                    okText="Aceptar"
                    confirmLoading={loading}
                    cancelButtonProps={{ disabled:loading }}
                    cancelText="Cancelar"
                >
                    <Spin spinning={loading}>
                        <Row>
                            <Col span={24}>
                                <Space direction={"vertical"}>
                                    <Upload
                                    {...{
                                        showUploadList: false,
                                        beforeUpload: (file) => {
                                        const isXlsx = file.name.includes(".xlsx");
                                        if (!isXlsx) {
                                            message.error(`${file.name} no es un xlsx.`);
                                        }
                                        return isXlsx || Upload.LIST_IGNORE;
                                        },
                                        onChange(info) {
                                        const { status } = info.file;
                                        if (status !== "uploading") {
                                            if (info.file) {
                                            setFileName(info?.file?.originFileObj?.name);
                                            setCurrentFile(info?.file?.originFileObj);
                                            info.file = null;
                                            } else {
                                            setCurrentFile(null);
                                            setFileName(null);
                                            }
                                        }
                                        },
                                    }}
                                    >
                                    <Button
                                        size="middle"
                                        icon={<UploadOutlined />}
                                        style={{ marginBottom: "10px" }}
                                    >
                                        Importar datos
                                    </Button>
                                    </Upload>
                                    <p>
                                    {"     "} {fileName}
                                    </p>
                                </Space> 
                            </Col>
                            <Col span={24}>
                                {/* <ul>
                                {personsListErrors &&
                                    personsListErrors.map((p) => {
                                    return (
                                        <li style={{ padding: 10 }}>
                                        <Alert
                                            message={`${p.person} ${p.message}`}
                                            type="error"
                                        />
                                        </li>
                                    );
                                    })}
                                </ul> */}
                            </Col>
                        </Row>
                    </Spin>
                </Modal>
            </Col>
        </Row>
        </div>
    </MainLayout>
  )
}

const mapState = (state) => {
    return {
      currentNode: state.userStore.current_node,
    };
};


export default connect(mapState)(withAuthSync(ExtraordinaryPayment));