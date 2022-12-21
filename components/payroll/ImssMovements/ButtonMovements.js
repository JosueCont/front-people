import {connect} from "react-redux";
import {UnorderedListOutlined, FileZipOutlined, SendOutlined } from "@ant-design/icons";
import {Button, Modal, Form, Input, DatePicker, Alert, Table, Row, Col} from "antd";
import {useEffect, useState} from "react";
import moment from 'moment'
import TableMovements from "./TableMovements";
import MovementsSection from "./MovementsSection";


const ButtonMovements=({person, node, payrollPerson,...props})=>{
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [form] = Form.useForm();
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [movements, setMovements] = useState([]);
    //const regPatronal = useSelector(state => state.catalogStore.cat_patronal_registration);



    const onFinish=(values)=>{
        console.log(values)
    }

    const start = () => {
        setLoading(true);
        // ajax request after empty completing
        setTimeout(() => {
            setSelectedRowKeys([]);
            setLoading(false);
        }, 1000);
    };

    useEffect(()=>{
        if(payrollPerson?.daily_salary){
            form.setFieldsValue({
                amount:payrollPerson?.daily_salary,
                date_updated: moment()
            })
        }
    },[payrollPerson])

    const disabledDate = (current) => {
        // Can not select days before today and today
        return current && current >= moment().endOf('day');
    };



    return (
        <>
            <Button
                style={{ marginBottom: "10px", marginRight:20 }}
                loading={loading}
                icon={<UnorderedListOutlined />}
                type="link"
                onClick={()=> setShowModal(true)}
            >
                Movimientos Imss
            </Button>

            <Modal
                title="Movimientos IMSS"
                visible={showModal}
                width={1000}
                footer={[]}
                onCancel={()=>setShowModal(false)}
            >
                <div
                    style={{
                        marginBottom: 16,
                    }}
                >

                    <MovementsSection/>

                </div>

            </Modal>

        </>

    )
}

const mapState = (state) => {
    return {
        config: state.userStore.general_config,
        permissions: state.userStore.permissions.person,
    };
};

export default connect(mapState)(ButtonMovements);
