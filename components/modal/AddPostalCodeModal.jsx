import { Form, Input, Modal, Spin, message } from 'antd'
import React, { useState } from 'react'
import SelectCountry from '../selects/SelectCountry'
import SelectState from '../selects/SelectState'
import SelectMunicipality from '../selects/SelectMunicipality'
import {ruleRequired} from '../../utils/rules'
import WebApiFiscal from '../../api/WebApiFiscal'

const AddPostalCodeModal = ({ isVisible = false, setIsVisible, getPostalCode, onSuccess=null }) => {

    const [form] = Form.useForm()

    const [state, setState] = useState(null)
    const [loading, setLoading] = useState(false)

    const closeModal = () => {
        setIsVisible(false)
        form.resetFields()
    }


    const sendPostalCode = async (values) => {
        setLoading(true)
        try {
            let resp = await WebApiFiscal.addPostalCode(values);
            if(resp.status === 200){
                message.success("Cdigo postal creado exitosamente.")
                closeModal()
                getPostalCode()
                onSuccess(resp.data)
            }else{
                message.error(error?.data?.response?.message)
            }
            setLoading(false)
        } catch (error) {
            setLoading(false)
            try{
                message.error(error?.data?.response?.message)
            }catch{
                message.error("Ocurrio un problema al crear el código postal")
            }
        }
    }


    return (
            <Modal 
                visible={isVisible}
                maskClosable={false}
                closable={false} 
                onCancel={() => closeModal() }
                onOk={() => form.submit()}
                title="Agregar código postal"
            >
                <Spin spinning={loading}>
                    <Form form={form} layout="vertical" onFinish={sendPostalCode}>
                        <Form.Item rules={[ruleRequired]} name={'code'} label="Código">
                            <Input />
                        </Form.Item>
                        <SelectCountry rules={[ruleRequired]}/>
                        <SelectState  setState={setState} rules={[ruleRequired]} />
                        <SelectMunicipality state={state && state} rules={[ruleRequired]}/>
                    </Form>
                </Spin>
            </Modal>
    )
}

export default AddPostalCodeModal