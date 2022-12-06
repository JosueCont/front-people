import { useState, useEffect } from "react";
import {
  Row,
  Col,
  Typography,
  Divider,
  Form,
  Button,
  message,
  Input,
  Table,
  Modal,
  Spin,
  Upload
  
} from "antd";
import UploadCerOrPfxFile from "../UploadCerOrPfxFile";
import { ruleRequired } from "../../utils/rules";
import WebApiPeople from "../../api/WebApiPeople";

const AutomaticMovements = ({patronalData}) => {

  const { Text } = Typography
  const [ modalInfonavitForm ] = Form.useForm()
  const [ modalImssForm ] = Form.useForm()
  const [ service, setService ] = useState(null)
  const [ imssModalVisible, setImssModalVisible ] = useState(false)
  const [ infonavitModalVisible, setInfonavitModalVisible ] = useState(false)
  const [ loading, setLoading ] = useState(false)
  const [ cerOrPfxFile, setCerOrPfxFile ] = useState(null)
  const [ keyFile, setKeyFile ] = useState(null)
  const [ required, setRiquired ] = useState(false)

  useEffect(() => {

    if(service && service === 'IMSS') { setImssModalVisible(true) }
    if(service && service === 'INFONAVIT') { setInfonavitModalVisible(true) }

  },[service])

  useEffect(() => {

    if(cerOrPfxFile && cerOrPfxFile.name.includes('.cer')){
      setRiquired(true)
    } else {
      setRiquired(false)
    }
  },[cerOrPfxFile])

  useEffect(() => {
    
    patronalData && getPatronalCredentials()

  },[patronalData])

  const colums = [
    {
      title: "Servicio",
      key: 'service' ,
      dataIndex: 'service'
    },
    {
      title: "Configuración",
      key: 'configuration',
      render: (record) => (
        <Button onClick={ () => setService(record.service) }>
          Config.
        </Button>
      )
    }
  ]

  const configurations = [
    {
      service: "IMSS",
    },
    {
      service: 'INFONAVIT',
    }
  ]

  const getPatronalCredentials = async () => {

    try {

      let response = await WebApiPeople.getCredentials('infonavit', patronalData.id)
      console.log('Response Infonavit', response)

    } catch (error) {
      
      console.log('Error', error)

    } finally {

    }
  }

  const onFinishImss = async (values) => {

    setLoading(true)
    values.endpoint = 'imss'
    values.patronal_registration = patronalData.id
    values.cer = cerOrPfxFile
    values.key = keyFile

    try {
      console.log('Values -->', values)
      let response = await WebApiPeople.addNewCredentials(values)
      console.log('Response', response)
      message.success('Guardado correctamente.') 

    } catch (error) {

      console.log('Error', error)
      message.error('Error al guardar credenciales.')

    } finally {

      setLoading(false)
      onCancelIMSS()

    }
  }

  const onFinishInfonavit = async (values) => {

    setLoading(true)
    values.endpoint = 'infonavit'
    values.patronal_registration = patronalData.id

    try {
      console.log('Values -->', values)
      let response = await WebApiPeople.addNewCredentials(values)
      console.log('Response', response)
      message.success('Guardado correctamente.') 

    } catch (error) {

      console.log('Error', error)
      message.error('Error al guardar credenciales.')

    } finally {

      setLoading(false)
      onCancelInfonavit()

    }
  }

  const onCancelInfonavit = () => {
    modalInfonavitForm.resetFields()
    setInfonavitModalVisible(false)
    setService(null)
  }

  const onCancelIMSS = () => {
    modalImssForm.resetFields()
    setCerOrPfxFile(null)
    setKeyFile(null)
    setImssModalVisible(false)
    setService(null)
    setRiquired(false)
  }

  return(
    <>
      <Table 
        columns={ colums }
        dataSource={ configurations }
        pagination = { false }
        style = {{ marginBottom: 10 }}
      />
      <Modal
        title="Configuración Infonavit"
        visible = { infonavitModalVisible }
        onCancel={ onCancelInfonavit }
        footer = {[]}
      >
        <Form
          form={ modalInfonavitForm }
          layout = "vertical"
          onFinish={ onFinishInfonavit }
        >
          <Row>
            <Col span={24}>
              <Form.Item
                name="user"
                label = "Usuario"
                labelCol={ 24 }
                rules = {[ruleRequired]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="password"
                label = "Contraseña"
                labelCol={ 24 }
                rules = {[ruleRequired]}
              >
                <Input.Password />
              </Form.Item>
            </Col>
          </Row>
          <Row justify='end' style={{ marginTop: 10 }}>
            <Col style={{ marginRight: 10 }}>
              <Button
                type='primary'
                onClick={ onCancelInfonavit }
                loading={ loading }
              >
                Cerrar
              </Button>
            </Col>
            <Form.Item>
              <Button
                type='primary'
                htmlType='submit'
                loading={ loading }
              >
                Guardar
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </Modal>
      <Modal
        title="Configuración IMSS"
        visible = { imssModalVisible }
        onCancel={ onCancelIMSS }
        footer = {[]}
      >
        <Form
          form={ modalImssForm }
          layout='vertical'
          onFinish={ onFinishImss }
        >
          <Row>
            <Col span={24}>
              <Form.Item
                name="user"
                label = "Usuario"
                labelCol={ 24 }
                rules = {[ruleRequired]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="password"
                label = "Contraseña"
                labelCol={ 24 }
                rules = {[ruleRequired]}
              >
                <Input.Password />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Text> Certificados </Text>
            </Col>
            <Col span={24} style = {{ marginTop: 10 }}>
                <UploadCerOrPfxFile 
                  textButton="Subir certificado .cer o .pfx"
                  validateExtension=".cer, .pfx"
                  showList = { cerOrPfxFile? true : false }
                  setFile = { setCerOrPfxFile }
                  size = 'middle'
                />
            </Col>
            <Col span={24}>
                <UploadCerOrPfxFile 
                  textButton="Subir certificado .key"
                  validateExtension=".key"
                  showList = { keyFile? true : false }
                  setFile = { setKeyFile }
                  size = 'middle'
                  set_disabled = { !required }
                />
            </Col>
          </Row>
          <Row justify='end' style={{ marginTop: 10 }}>
            <Col style={{ marginRight: 10 }}>
              <Button
                type='primary'
                onClick={ onCancelIMSS }
                loading={ loading }
              >
                Cerrar
              </Button>
            </Col>
            <Form.Item>
              <Button
                type='primary'
                htmlType='submit'
                loading={ loading }
              >
                Guardar
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </Modal>
    </>
  )
  
}

export default AutomaticMovements