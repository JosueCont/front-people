import { React, useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import {
    Row,
    Col,
    Typography,
    Table,
    Breadcrumb,
    Image,
    Button,
    Form,
    Input,
    InputNumber,
    Select,
    Modal,
    DatePicker,
    notification,
    Space,
    Switch,
} from "antd";
import { useRouter } from "next/router";
import axiosApi from "../../../libs/axiosApi";
import moment from "moment";
import Incapacityform from "../../../components/forms/IncapacityForm";
import { withAuthSync } from "../../../libs/auth";
import Axios from 'axios';
import { API_URL } from '../../../config/config';


const IncapacityDetails = () => {
    const route = useRouter();
    const [form] = Form.useForm();
    const { Title, Text } = Typography;
    const { Option } = Select;
    const { TextArea } = Input;


    const { confirm } = Modal;
    const [visibleModalReject, setVisibleModalReject] = useState(false);

    const [details, setDetails] = useState(null);
    const { id } = route.query;
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [message, setMessage] = useState(null);

    /* Dates */
    const [departure_date, setDepartureDate] = useState(null);
    const [return_date, setReturnDate] = useState(null);

    /* Selects */
    const [allPersons, setAllPersons] = useState(null)

    /* file */
    const [file, setFile] = useState(null);

    const onCancel = () => {
        route.push("/incapacity");
    };

    const getDetails = async () => {
        setLoading(true);
        try {
            let response = await Axios.get(API_URL + `/person/incapacity/${id}/`);
            let data = response.data;
            console.log('get_details', data);
            setDetails(data);
            setDepartureDate(data.departure_date);
            setReturnDate(data.return_date);

            setLoading(false);
        } catch (e) {
            console.log("error", e);
            setLoading(false);
        }
    };

    const saveRequest = async (values) => {
        setSending(true)
        values["departure_date"] = departure_date;
        values["return_date"] = return_date;
        file ? console.log(file['originFileObj']) : null;
        console.log(values);

        let data = new FormData();
        data.append("departure_date", departure_date)
        data.append("return_date", return_date)
        data.append("khonnect_id", values.khonnect_id);
        data.append("document", file['originFileObj'])
        try {
            let response = await Axios.post(API_URL + `/person/incapacity/${id}/`, data);
            let resData = response.data;
            route.push("/incapacity");
            notification["success"]({
                message: "Aviso",
                description: "Información enviada correctamente.",
            });

            console.log("res", response.data);
        } catch (error) {
            console.log("error", error);
        } finally {
            setSending(false);
        }
    };

    const onChangeDepartureDate = (date, dateString) => {
        setDepartureDate(dateString);
    };

    const onChangeReturnDate = (date, dateString) => {
        setReturnDate(dateString);
    };

    const onChangeMessage = (value) => {
        setMessage(value);
      };

    const rejectCancel = () => {
        setVisibleModalReject(false);
        setMessage(null);
      };

    const rejectRequest = async () => {
        if (json) {
          console.log(json);
          try {
            let values = {
              khonnect_id: json.user_id,
              id: id,
              comment: 1212231,
            };
            console.log(values);
            let response = await Axios.post(
              API_URL+`/person/vacation/reject_request/`,
              values
            );
            if (response.status == 200) {
              notification["success"]({
                message: "Aviso",
                description: "Solicitud rechazada.",
              });
              setMessage(null);
              route.push('/holidays');
            }
          } catch (e) {
            console.log("error", e);
          }
        }
      };
    
      const approveRequest = async () => {
        if (json) {
          console.log(json);
          setSending(true);
          try {
            let values = {
              khonnect_id: json.user_id,
              id: id,
            };
            let response = await Axios.post(
              API_URL+`/person/vacation/approve_request/`,
              values
            );
            if (response.status == 200) {
              confirm({
                title: "Su solicitud de vacaciones anuales ha sido aceptada",
                icon: <CheckCircleOutlined />,
                okText: "Aceptar y notificar",
                cancelText: "Cancelar",
                onOk() {
                  /* console.log('OK'); */
                  /* route.push('/holidays'); */
                  route.push("/holidays");
                },
                onCancel() {
                  console.log("Cancel");
                },
              });
    
              /* notification["success"]({
                            message: "Notification Title",
                            description: "Solicitud aprobada.",
                        });
                        route.push('/holidays') */
            }
          } catch (e) {
            console.log("error", e);
          }finally{
              setSending(false)
          }
        }
      };


    useEffect(() => {
        if (id) {
            getDetails();
        }
    }, [route]);

    return (
        <MainLayout currentKey="5">
            <Breadcrumb key="Breadcrumb" className={'mainBreadcrumb'}>
                <Breadcrumb.Item>Inicio</Breadcrumb.Item>
                <Breadcrumb.Item href="./">Incapacidad</Breadcrumb.Item>
                <Breadcrumb.Item>Nueva solicitud</Breadcrumb.Item>
            </Breadcrumb>
            <div className="container back-white" style={{ width: "100%", padding: '20px 0' }}>
                <Row justify={'center'}>
                    <Col span={23}>
                        <Incapacityform onReject={() => setVisibleModalReject(true)} onApprove={approveRequest} toApprove={true} readOnly={true} details={details} file={file} setFile={setFile} onFinish={saveRequest} sending={sending} onChangeDepartureDate={onChangeDepartureDate} onChangeReturnDate={onChangeReturnDate} onCancel={onCancel} />
                    </Col>
                </Row>
            </div>
            <Modal
                title="Rechazar solicitud de incapacidad"
                visible={visibleModalReject}
                onOk={rejectRequest}
                onCancel={rejectCancel}
            >
                <Text>Comentarios</Text>
                <TextArea rows="4" onChange={onChangeMessage} />
            </Modal>
        </MainLayout>
    )
}

export default withAuthSync(IncapacityDetails);
