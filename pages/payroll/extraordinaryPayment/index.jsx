import React, { useEffect, useState } from 'react'
import MainLayout from "../../../layout/MainInter";
import { Breadcrumb, Button, Card, Col, Form, Input, Row, Select, Space, Spin, Table, Tooltip, message } from 'antd';
import router, { useRouter } from "next/router";
import { verifyMenuNewForTenant } from "../../../utils/functions";
import WebApiPayroll from "../../../api/WebApiPayroll";
import { connect } from 'react-redux';
import { withAuthSync } from "../../../libs/auth";
import { DownloadOutlined, FilePdfTwoTone, FileTextTwoTone, SearchOutlined, UploadOutlined } from '@ant-design/icons';

const ExtraordinaryPayment = ({...props}) => {
    const route = useRouter();
    const [form] = Form.useForm()
    const [loadingCalendars, setLoadingCalendars] = useState(false)
    const [optionspPaymentCalendars, setOptionsPaymentCalendars] = useState([]);
    const [paymentCalendars, setPaymentCalendars] = useState([]);
    const [periodSelected, setPeriodSelcted] = useState(null);
    const [calendarSelect, setCalendarSelect] = useState(null);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [dataList, setDataList] = useState([])
    const [loading, setLoading] = useState(false)
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
            dataIndex: ["concept", "description"]
        },
        {
            title: "cantidad",
            dataIndex: ["concept", "amount"]
        },
        {
            title: "Acciones",
            render: (item) => (
                <>
                    <Tooltip title="Comprobante" key={item.person_id} color={"#3d78b9"}>
                        <FilePdfTwoTone
                            twoToneColor="#34495E"
                            /* onClick={() => downloadReceipt(item)} */
                            style={{ fontSize: "25px" }}
                        />
                        <Tooltip title="XML" color={"#3d78b9"} key={"#3d78b9"}>
                            <FileTextTwoTone
                                /* onClick={() => downLoadFile(item, 1)} */
                                style={{ fontSize: "25px" }}
                            />
                        </Tooltip>
                    </Tooltip>
                </>
            )
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
                console.log('resp', resp)
                let dataInfo = resp?.data.map(item => {
                    item.key = item.person_id
                    return item
                })
                setDataList(dataInfo)
            }
            setLoading(false)
        } catch (error) {
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
                                        <Button  icon={<UploadOutlined/>} style={{ width:'100%' }}>
                                            Descargar
                                        </Button>               
                                        <Button  icon={<DownloadOutlined/>} style={{ width:'100%' }}>
                                            Cargar
                                        </Button>               
                                    </Space>
                                </Col>
                                <Col span={24}>
                                    <Space>
                                        <Button  style={{ width:150 }}>
                                            Cerrar
                                        </Button>
                                        <Button  style={{ width:150 }} onClick={sendData}>
                                            Timbrar
                                        </Button>
                                    </Space>
                                </Col>
                            </>
                        }
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Table
                                loading={loading}
                                columns={columns}
                                dataSource={dataList}
                                rowSelection={rowSelection}
                            />
                        </Col>
                    </Row>
                </Card>
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