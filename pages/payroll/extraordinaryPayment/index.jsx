import React, { useEffect, useState } from 'react'
import MainLayout from "../../../layout/MainInter";
import { Alert, Breadcrumb, Button, Card, Col, Form, Input, InputNumber, List, Modal, Popconfirm, Row, Select, Space, Spin, Table, Tooltip, Typography, Upload, message } from 'antd';
import router, { useRouter } from "next/router";
import { verifyMenuNewForTenant, downLoadFileBlobAwait, getDomain, gerErrorMesagesPayroll } from "../../../utils/functions";
import { API_URL_TENANT } from "../../../config/config";
import WebApiPayroll from "../../../api/WebApiPayroll";
import { connect } from 'react-redux';
import { withAuthSync } from "../../../libs/auth";
import { CheckOutlined, CloseOutlined, DownloadOutlined, EditOutlined, FilePdfTwoTone, FileTextTwoTone, SearchOutlined, UploadOutlined } from '@ant-design/icons';
import { CancelOutlined } from '@material-ui/icons';

import {ruleWhiteSpace, onlyNumeric, twoDecimal} from '../../../utils/rules'




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
    const [errorsDetails, setErrorsDetails] = useState(null)
    const [showModalErrors, setShowModalErrors] = useState(false)

    /* Estado para botones */

    const [disabledSave, setDisabledSave] = useState(true)

    const [disabledOpen, setDisabledOpen] = useState(false)


    const [disabledClose, setDisabledClose] = useState(false)

    
    const [disabledStamp, setDisabledStamp] = useState(false) 

    const [onlySelection, setOnlySelection] = useState(null)


    const isEditing = (record) => record.key === editingKey;

    const edit = (record) => {
        
        let concept = {
            'description': record?.concept?.description,
            'amount':record?.concept?.amount
        }

        formTable.setFieldsValue({ 
            "concept": concept
        })
        
        setEditingKey(record.key);
    };

    const cancel = () => {
        
        setEditingKey('');

        let concept = null

        formTable.setFieldsValue({ 
            "concept": concept
        })

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
            title: "Cantidad",
            dataIndex: ["concept", "amount"],
            editable: true,

        },
        {
            title: "Estatus",
            dataIndex: "employee_credit_note",
            render: (employee_credit_note) =>{
                return !employee_credit_note ? "N/A" : employee_credit_note.status === 0 ? "Abierto" : employee_credit_note.status === 1 ? "Cerrado" : "Timbrado"
                
            }

        },
        {
            title: "UUID",
            key: "uuid",
            render: (record) => 
                    <>{ record?.employee_credit_note?.uuid }</>
        },
        {
            title: "Acciones",
            render: (record) => {
                if(record?.employee_credit_note?.status === 2){ 
                    return (
                        <>
                            <Tooltip title="Comprobante" key={record.person_id} color={"#3d78b9"}>
                                <FilePdfTwoTone
                                    twoToneColor="#34495E"
                                    disabled={loading}
                                    onClick={() => downLoadFile(record, 2)}
                                    style={{ fontSize: "25px" }}
                                />
                                </Tooltip>
                                <Tooltip title="XML" color={"#3d78b9"} key={"#3d78b9"}>
                                    <FileTextTwoTone
                                        disabled={loading}
                                        onClick={() => downLoadFile(record, 1)}
                                        style={{ fontSize: "25px" }}
                                    />
                            </Tooltip>
                        </>
                    )
                }else if(record?.employee_credit_note === null || record?.employee_credit_note?.status < 1) {
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
                                <CloseOutlined onClick={cancel} />
                            </Tooltip>
                        </span>
                    ) : (
                        <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                            <EditOutlined/>
                        </Typography.Link>
                    )   
                }
            }
        },
    ]

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
        hideSelectAll: true,
        getCheckboxProps: (record) => {
            let flag = false
            if(record?.employee_credit_note?.status >= 2){
                flag = true
            }
            if(onlySelection === "X" && record.employee_credit_note){
                flag= true
            }
            if(onlySelection === 0 && record.employee_credit_note?.status !== 0){
                flag = true
            }

            if(onlySelection === 1 && record.employee_credit_note?.status !== 1){
                flag = true
            }

            return {
                disabled: flag,
            }
        }
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
        
        if (!value) {
          resetState();
          return;
        }
        const calendar = paymentCalendars.find((item) => item.id === value);

        /* Periodo */
        let period = calendar.periods.find((p) => p.active == true);
        if (!period) period = calendar.periods[0];

    
        setOnlySelection(null)
        setPeriodSelcted(period);
        setCalendarSelect(calendar);
        getCalculateCreditNote(period.id)
        form.setFieldsValue({
            periodicity: calendar.periodicity.description,
            period: `${period.name}.- ${period.start_date} - ${period.end_date}`,
        });
    };

    useEffect(() => {
        if (props.currentNode) getPaymentCalendars(props.currentNode.id);
    }, [props.currentNode]);

    const changePeriod = (period_id) => {
        let period = calendarSelect.periods.find((p) => p.id == period_id);
        cancel()
        setPeriodSelcted(period);
        getCalculateCreditNote(period_id)
        setSelectedRowKeys([])
        setOnlySelection(null)
    }

    const getCalculateCreditNote = async (id) => {
        try {
            setLoading(true)
            let data = { payment_period : id }
            let resp = await WebApiPayroll.getCalculateCreditNote(data)
            if(resp.status === 200){
                setConsolidation(resp?.data.consolidation)
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

        /* rules para los inputs */
        let rules = [
            {
              required: true,
              message: `${title}, es un campo requerido`,
            }
        ]

        let max = 13
        let type = "string"
        
        /* Obtenemos el tipo de valor para realizar la validación */
        if(editing && dataIndex.includes('description')){
            max = 100
            type = "string"
            rules.push(ruleWhiteSpace)
        }else if(editing && dataIndex.includes('amount')){
            max = 13
            type = "number"
            rules.push({
                pattern: /^\d+(?:\.\d{1,2})?$/,
                message: "Ingresa un valor numerico válido, máximo de dos decimales",
            })
        }

        const inputNode =  <Input maxLength={max} />

        return (
          <td {...restProps}>
            {editing ? (
              <Form.Item
                name={dataIndex}
                style={{
                  margin: 0,
                }}
                rules={rules}
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
                credit_notes: dataList,
            }   
            if(selectedRowKeys.length > 0 && status === 1){
                let selecteds = []
                dataList.map(element => {
                    if(selectedRowKeys.includes(element.person_id) ){
                        selecteds.push(element)
                    }    
                })
                data['credit_notes'] = selecteds
            }
            let resp = await WebApiPayroll.saveConsolidationCreditNote(data)
            if(resp.status === 200){
                if(status===0){
                    message.success("Información de pagos guardada")
                }else if(status===1){
                    message.success("Información cerrada")
                }
                getCalculateCreditNote(periodSelected.id)
            }
            setLoading(false)
            setSelectedRowKeys([])
        } catch (error) {
            setLoading(false)
            setSelectedRowKeys([])
            message.error(error?.response?.data?.message)
        }   
    }

    const OpenList = async () => {
        try {
            setLoading(true)
            let data = {
                consolidation_id: consolidation.id
            }   
            if(selectedRowKeys.length > 0){
                let credit_note_ids = []
                dataList.map(item => {
                    if(selectedRowKeys.includes(item.person_id)){
                        credit_note_ids.push(item.employee_credit_note.id)
                    }
                })
                data['credit_note_ids'] = credit_note_ids
            }
            let resp = await WebApiPayroll.openConsolidationCreditNote(data)
            if(resp.status === 200){
                message.success(resp?.data?.message)
                getCalculateCreditNote(periodSelected.id)
            }
            setLoading(false)
            setSelectedRowKeys([])
        } catch (error) {
            
            setLoading(false)
            setSelectedRowKeys([])
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

    const stampCreditNote = async () => {
        try {
            setLoading(true)
            let data = {
                "consolidation_id": consolidation.id,
                "credit_notes_id": []
            }

            if(selectedRowKeys.length > 0){
                let credit_notes_id = []
                for (let i = 0; i < dataList.length; i++) {   
                    if(selectedRowKeys.includes(dataList[i].person_id) ){
                        if(!dataList[i].employee_credit_note || dataList[i].employee_credit_note.status < 1){
                            message.error("Solo pueden enviar cuentas cerradas")
                            break;
                        }
                        credit_notes_id.push(dataList[i].employee_credit_note.id)
                    }    
                }
                data['credit_notes_id'] = credit_notes_id
            }
            let resp = await WebApiPayroll.stampCreditNote(data)
            if(resp.status === 200){
                message.success(resp?.data?.message)
                getCalculateCreditNote(periodSelected.id)
            }
            setLoading(false)
            setSelectedRowKeys([])
        } catch (error) {
            setLoading(false)
            if(error.response.data.message){
                message.error(error.response.data.message)
            }
        }
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
            gerErrorMesagesPayroll(error)
            if(error.response.data.message){
                setLoading(false)
                message.error(error.response.data.message)
            }
            if(error.response?.data?.details){
                setErrorsDetails(error.response?.data)
                setShowModalErrors(true)
            }
            
        }
    }

    useEffect(() => {
        if(selectedRowKeys.length > 0){
            let nSaves = 0
            let nClosed = 0
            let nOpen = 0
            selectedRowKeys.map((key, index) => {
                const idx = dataList.findIndex((item) => key === item.key);
                if (idx > -1) {
                    /* Validamos si es la primera selección para saber que tipo de fila vamos a seleccionar */
                    let item = dataList[idx]
                    /* Validamos los que estan abiertos */
                    if(item.employee_credit_note?.status === 0){
                        if(index === 0){
                            setOnlySelection(0)
                        }
                        nOpen++;
                    }else if(item?.employee_credit_note?.status === 1){
                        if(index === 0){
                            setOnlySelection(1)
                        }
                        nClosed++;
                    }
                }
            })
            if(nOpen > 0){
                setDisabledOpen(true)
                setDisabledClose(false)
                setDisabledStamp(true)
            }else if(nClosed > 0){
                setDisabledOpen(false)
                setDisabledClose(true)
                setDisabledStamp(false)
            }
        }else{
            setOnlySelection(null)
            validateDataList()
        }
    }, [selectedRowKeys])
    

    useEffect(() => {
        validateDataList()
    }, [dataList])

    const validateDataList = () => {
        let itemClosed = 0
        let itemOpen = 0
        let itemStamp = 0

        dataList.map((item) =>{
            if(item.employee_credit_note?.status == 1){
                itemClosed++;
            }
            if(item.employee_credit_note?.status == 0){
                itemOpen++;
            }
            if(item.employee_credit_note?.status == 2){
                itemStamp++;
            }
        })


        /* deshabilitamos el guardar si todos estan timbrados */
        if(!consolidation){
            setDisabledSave(false)
            setDisabledClose(true)
            setDisabledStamp(true)
            setDisabledOpen(true)
        }else if(itemStamp === dataList.length){
            setDisabledSave(true)
            setDisabledClose(true)
            setDisabledStamp(true)
            setDisabledOpen(true)
        }else if(itemOpen === dataList.length){
            setDisabledSave(false)
            setDisabledClose(false)
            setDisabledStamp(true)
            setDisabledOpen(true)
        }else if(itemClosed === dataList.length){
            setDisabledSave(true)
            setDisabledClose(true)
            setDisabledStamp(false)
            setDisabledOpen(false)
        }
        else if(itemOpen > 0 && itemClosed > 0){
            setDisabledSave(false)
            setDisabledClose(false)
            setDisabledStamp(false)
            setDisabledOpen(false)
        }else if(itemOpen > 0 && itemClosed == 0){
            setDisabledSave(false)
            setDisabledClose(false)
            setDisabledStamp(true)
            setDisabledOpen(true)
        }
        else{
            
            setDisabledSave(false)
            setDisabledClose(false)
            setDisabledStamp(false)
            setDisabledOpen(false)
        }
    }

    const closeModalError = () => {
        setShowModalErrors(false)
        setErrorsDetails(null)
    }
    

    const downLoadFile = (element, type_file) => {
        
        let data = {
            "type_request": 3,
            "type_file": type_file,
            "credit_note_stamp_id": element?.employee_credit_note?.id_stamp,
            "node": props.currentNode.id,
        };
    
        let url = `${getDomain(
          API_URL_TENANT
        )}/payroll/cfdi_multi_emitter_facturama/cfdi_multi_emitter/`;
    
        downLoadFileBlobAwait(
          url,
          `${element.rfc}_${periodSelected.start_date}_${periodSelected.end_date}.${type_file == 1 ? "xml" : "pdf"}`,
          "POST",
          data,
          "No se encontraron resultados",
          setLoading
        );        
      };

    const AlertError = (personDetail=null) =>{
        let name = personDetail?.person?.name
        return <Alert
                style={{ width:'100%' }}
                message={name}
                description={
                    <List dataSource={personDetail?.person?.errors} 
                        renderItem={(item) => (
                            <List.Item>
                                {item}
                            </List.Item>
                      )}
                    />
                }
                type="warning"
                showIcon
            />
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
                        <Col span={18}>
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
                                            <Col xxs={24} xl={8}>
                                                <Form.Item name="periodicity" label="Periodicidad">
                                                    <Input
                                                    size="large"
                                                    key="periodicity"
                                                    placeholder="Periodicidad"
                                                    disabled={true}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col xxs={24} xl={9}>
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
                                {
                                    !disabledSave &&
                                    <Col span={6}>
                                        <Space style={{ marginTop:30 }} >
                                            <Button loading={loading} icon={<DownloadOutlined/>}  style={{ width:'100%' }} onClick={SendList}>
                                                Descargar.
                                            </Button>               
                                            <Button icon={<UploadOutlined/>} style={{ width:'100%' }} onClick={() => showModal()}>
                                                Cargar
                                            </Button>               
                                        </Space>
                                    </Col>
                                }
                                <Col span={24}>
                                    <Space>
                                        {
                                            <Button onClick={() => saveCloseList(0)} disabled={loading || disabledSave}>
                                                Guardar cambios
                                            </Button>
                                        }
                                            
                                            <Button  onClick={() => saveCloseList(1)} style={{ minWidth:150 }} disabled={loading || disabledClose}>
                                                 {selectedRowKeys.length > 0 ? "Cerrar seleccionados" : "Cerrar abiertos" } 
                                            </Button>
                                        {
                                            <Button  onClick={() => OpenList()} style={{ minWidth:150 }} disabled={loading || disabledOpen}>
                                                { selectedRowKeys.length > 0 ? "Abrir seleccionados" : "Abrir cerrados" }
                                            </Button>
                                        }
                                        {
                                            <Tooltip title={"Se timbraran los elementos que esten cerrados"}>
                                                <Button disabled={disabledStamp || loading}  style={{ width:150 }} onClick={stampCreditNote}>
                                                    Timbrar
                                                </Button>
                                            </Tooltip>
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
                    title={"Cargar plantilla"}
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
                <Modal visible={showModalErrors}
                    footer={<Button onClick={() => closeModalError()} >Aceptar</Button>}
                    title={<>{errorsDetails?.message}</>}
                    onCancel={() => closeModalError()}
                >
                    
                    <Space direction="vertical" style={{ width:'100%' }}>
                    {
                        
                        errorsDetails?.details?.map(person => {
                            return <AlertError  person={person} />
                        })
                    }
                    </Space>
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