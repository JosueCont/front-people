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
  Upload,
  Popconfirm
  
} from "antd";
import {
CheckCircleOutlined,
QuestionCircleOutlined,
CloseCircleOutlined
} from "@material-ui/icons";
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
  const [ loadingTable, setLoadingTable ] = useState(false)
  const [ cerOrPfxFile, setCerOrPfxFile ] = useState(null)
  const [ keyFile, setKeyFile ] = useState(null)
  const [ required, setRiquired ] = useState(false)

  const [hasCredentialInfonavit, setHasCredentialInfonavit] = useState(false)
  const [hasCredentialIMSS, setHasCredentialIMSS] = useState(false)

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
      title: "Configurado",
      key: 'status',
      render: (record) => {
        console.log('record', record?.service)
        if(record?.service){
           if(record?.service==='INFONAVIT' && hasCredentialInfonavit){
             return <CheckCircleOutlined style={{color:'green'}} />
             // {
             //   (record?.service==='INFONAVIT' && hasCredentialInfonavit) ? <CheckCircleOutlined /> :<CloseCircleOutlined />
             // }
           }

          if(record?.service==='IMSS' && hasCredentialIMSS){
            return <CheckCircleOutlined style={{color:'green'}} />
            // {
            //   (record?.service==='INFONAVIT' && hasCredentialInfonavit) ? <CheckCircleOutlined /> :<CloseCircleOutlined />
            // }
          }

        }
        return <p>

        </p>
      }
    },
    {
      title: "Configuración",
      key: 'configuration',
      render: (record) => (
        <>
          <Button loading= { loading }  onClick={ () => setService(record.service) }>
            Configurar
          </Button>
          
          {
            record.service && record.service === 'IMSS' && hasCredentialIMSS && 

            <Popconfirm 
              title = "¿Desea eliminar las credenciales IMSS?"
              // icon = {<QuestionCircleOutlined />}
              style={{ color: 'red' }}
              onConfirm = { () => onDeleteCredentials(record.service) }
              okText = "Sí"
              cancelText = "No"
            >
              <Button style={{ marginLeft: 10 }} loading = { loading } >
                Eliminar
              </Button>
            </Popconfirm>

          }

{
            record.service && record.service === 'INFONAVIT' && hasCredentialInfonavit &&

            <Popconfirm 
            title = "¿Desea eliminar las credenciales INFONAVIT?"
            // icon = {<QuestionCircleOutlined />}
            style={{ color: 'red' }}
            onConfirm = { () => onDeleteCredentials(record.service) }
            okText = "Sí"
            cancelText = "No"
          >
            <Button style={{ marginLeft: 10 }} loading= { loading } >
              Eliminar
            </Button>
          </Popconfirm>

          }


        </>
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

    setLoadingTable(true)

    try {
      let response = await WebApiPeople.getCredentials('imss', patronalData.id)
      if(response?.data?.results?.credentials===true){
        setHasCredentialIMSS(true)
      }else{
        setHasCredentialIMSS(false)
      }
      console.log('Response imss', response?.data.results?.credentials)
    } catch (error) {
      setHasCredentialIMSS(false)
      console.log('Error', error)

    } finally {

    }


    try {
      let response = await WebApiPeople.getCredentials('infonavit', patronalData.id)
      if(response?.data?.results?.credentials===true){
          setHasCredentialInfonavit(true)
      }else{
        setHasCredentialInfonavit(false)
      }
      console.log('Response Infonavit', response?.data.results?.credentials)
    } catch (error) {
      setHasCredentialInfonavit(false)
      console.log('Error', error)

    } 

    setLoadingTable(false)

  }

  const onFinishImss = async (values) => {

    console.log('vals', values)
    const formData = new FormData();
    formData.append('endpoint', 'imss')
    formData.append('patronal_registration', patronalData.id)
    formData.append('cer', cerOrPfxFile)
    formData.append('key', keyFile || {})
    // formData.append('FILES', [cerOrPfxFile, keyFile])
    // formData.append('cer', cerOrPfxFile)
    // formData.append('key', keyFile)
    formData.append('password', values.password)
    formData.append('user', values.user)

    setLoading(true)
    // values.endpoint = 'imss'
    // values.patronal_registration = patronalData.id
    // values.cer = cerOrPfxFile
    // values.key = keyFile

    try {
      console.log('Values -->', values)
      let response = await WebApiPeople.addNewCredentials(formData)
      console.log('Response', response)
      message.success('Guardado correctamente.') 

    } catch (error) {

      console.log('Error', error)
      message.error('Error al guardar credenciales.')

    } finally {

      setLoading(false)
      getPatronalCredentials()
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
      getPatronalCredentials()
      onCancelInfonavit()

    }
  }

  const onDeleteCredentials = async (endpoint) => {
    setLoading(true)

    let newSite = ""

    if(endpoint === 'IMSS'){
      newSite = 'imss'
    } else {
      newSite = 'infonavit'
    }

    try {
      let response = await WebApiPeople.deleteCredentials(newSite, patronalData.id)
      if(response){
        message.success('Credenciales eliminadas con éxito')
        getPatronalCredentials()
      }
    } catch (error) {
        console.log('error', error)
        message.error('Error al eliminar credenciales')
    } finally {
      setLoading(false)
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
        loading = { loadingTable }
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
                  validateExtension=".cer,.pfx"
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