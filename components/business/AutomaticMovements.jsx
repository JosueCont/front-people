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
  Popconfirm,
  Alert
  
} from "antd";
import {
CheckCircleOutlined,
QuestionCircleOutlined,
CloseCircleOutlined
} from "@material-ui/icons";
import UploadCerOrPfxFile from "../UploadCerOrPfxFile";
import { ruleRequired } from "../../utils/rules";
import WebApiPeople from "../../api/WebApiPeople";

const AutomaticMovements = ({patronalData,hasImss, hasInfonavit}) => {

  const { Text } = Typography
  const [ modalInfonavitForm ] = Form.useForm()
  const [ modalImssForm ] = Form.useForm()
  const [ service, setService ] = useState(null)
  const [ imssModalVisible, setImssModalVisible ] = useState(false)
  const [ infonavitModalVisible, setInfonavitModalVisible ] = useState(false)
  const [ loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
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
      render: (service) => {
        return <>
          <img src={service === 'IMSS' ? '/images/logo_imss.png':'/images/logoinfonavit.png'} width={40} />
        </>
      },
      dataIndex: 'service'
    },
    {
      title: "Configurado",
      key: 'status',
      render: (record) => {
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
          <Button disabled={loading || deleting} loading={loading === record.service && record.service}  onClick={ () => setService(record.service) }>
            Configurar
          </Button>
          
          {
            record.service && record.service === 'IMSS' && hasCredentialIMSS && 

            <Popconfirm 
              disabled={deleting === 'IMSS'}
              title = "¿Desea eliminar las credenciales IMSS?"
              // icon = {<QuestionCircleOutlined />}
              style={{ color: 'red' }}
              onConfirm = { () => onDeleteCredentials(record.service) }
              okText = "Sí"
              cancelText = "No"
              cancelButtonProps={{ 
                disabled: deleting === 'IMSS'
              }}
            >
              <Button style={{ marginLeft: 10 }} disabled={deleting || loading} loading = { deleting === 'IMSS' } >
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
            cancelButtonProps={{ 
              disabled: deleting === 'INFONAVIT'
            }}
          >
            <Button style={{ marginLeft: 10 }} disabled={deleting} loading= { deleting === 'INFONAVIT' } >
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
    console.log('getPatronalCredentials',patronalData)

    try {
      let response = await WebApiPeople.getCredentials('imss', patronalData.id)
      if(response?.data?.results?.credentials===true){
        setHasCredentialIMSS(true)
        hasImss(true)
      }else{
        setHasCredentialIMSS(false)
        hasImss(false)
      }
    } catch (error) {
      setHasCredentialIMSS(false)
      hasImss(false)
      console.log('Error', error)

    } finally {

    }


    try {
      let response = await WebApiPeople.getCredentials('infonavit', patronalData.id)
      if(response?.data?.results?.credentials===true){
          setHasCredentialInfonavit(true)
          hasInfonavit(true)
      }else{
        setHasCredentialInfonavit(false)
        hasInfonavit(false)
      }
    } catch (error) {
      setHasCredentialInfonavit(false)
      hasInfonavit(false)
      console.log('Error', error)

    } 

    setLoadingTable(false)

  }

  const onFinishImss = async (values) => {

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

    setLoading('IMSS')
    // values.endpoint = 'imss'
    // values.patronal_registration = patronalData.id
    // values.cer = cerOrPfxFile
    // values.key = keyFile

    try {
      let response = await WebApiPeople.addNewCredentials(formData)
      message.success('Guardado correctamente.') 

    } catch (error) {

      console.log('Error', error)
      if(error?.response?.data?.message) message.error(error?.response?.data?.message)
      else message.error('Error al guardar credenciales')

    } finally {

      setLoading(false)
      getPatronalCredentials()
      onCancelIMSS()

    }
  }

  const onFinishInfonavit = async (values) => {

    setLoading('INFONAVIT')
    values.endpoint = 'infonavit'
    values.patronal_registration = patronalData.id

    try {
      let response = await WebApiPeople.addNewCredentials(values)
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

    let newSite = ""

    if(endpoint === 'IMSS'){
      newSite = 'imss'
      setDeleting('IMSS')
    } else {
      newSite = 'infonavit'
      setDeleting('INFONAVIT')
    }

    try {
      let response = await WebApiPeople.deleteCredentials(newSite, patronalData.id)
      if(response){
        message.success('Credenciales eliminadas con éxito')
        if(endpoint === 'IMSS'){
          hasImss(false)
        } else {
          hasInfonavit(false)
        }
        getPatronalCredentials()
      }
    } catch (error) {
        console.log('error', error)
        message.error('Error al eliminar credenciales')
    } finally {
      
      setDeleting(false)
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
        closable={false}
        maskClosable={false}
      >
        <Spin spinning={loading}>
          <Form
            form={ modalInfonavitForm }
            layout = "vertical"
            onFinish={ onFinishInfonavit }
          >
            <Row>
              <Col span={24}>
                <Alert showIcon message={"El uso de este formulario depende de la conexión del servicio del INFONAVIT, " +
                    "por lo que pudiera demorar varios segundos al guardar las credenciales. Verifique que las credenciales correspondan al Registro Patronal " + patronalData.code} type="warning" />
                <br/>
              </Col>
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
        </Spin>
      </Modal>
      <Modal
        title="Configuración IMSS"
        visible = { imssModalVisible }
        onCancel={ onCancelIMSS }
        footer = {[]}
        closable={false}
        maskClosable={false}
      >
        <Spin spinning={loading}>
          <Form
            form={ modalImssForm }
            layout='vertical'
            onFinish={ onFinishImss }
          >
            <Row>
              <Col span={24}>
                <Alert showIcon message={"El uso de este formulario depende de la conexión del servicio del IMSS, " +
                    "por lo que pudiera demorar varios segundos al guardar las credenciales. Verifique que las credenciales correspondan al Registro Patronal "+ patronalData.code} type="warning" />
                <br/>
              </Col>

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
                    set_disabled={ loading !== false && true}
                  />
              </Col>
              <Col span={24}>
                  <UploadCerOrPfxFile 
                    textButton="Subir certificado .key"
                    validateExtension=".key"
                    showList = { keyFile? true : false }
                    setFile = { setKeyFile }
                    size = 'middle'
                    set_disabled = { !required || loading}
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
        </Spin>
      </Modal>
    </>
  )
  
}

export default AutomaticMovements