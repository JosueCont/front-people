import {useState} from "react";
import {Button, Modal, Steps, Row, Col, Alert, Timeline, Typography, Badge} from "antd";
const { Step } = Steps;
import {
    ArrowRightOutlined,
    InfoCircleOutlined
} from "@ant-design/icons";
const { Paragraph } = Typography;
const ButtonWizardLight=({data=null})=>{

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenSystem, setIsModalOpenSystem] = useState(false);
    const description  = "hola"

    const imgKhorflix = "https://khorplus.s3.us-west-1.amazonaws.com/demo/people/site-configuration/images/khorflix.png";

    const imgSukhaTv = "https://khorplus.s3.us-west-1.amazonaws.com/demo/people/site-configuration/images/sukha.png";

    const showModal = () => {
        setIsModalOpen(true);
    };

    const showModalSystem = () => {
        setIsModalOpenSystem(true);
    };


    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const handleOkSystem = () => {
        setIsModalOpenSystem(false);
    };
    const handleCancelSystem = () => {
        setIsModalOpenSystem(false);
    };


    const steps = [
        {
            title: '1. Información fiscal de empresa',
            description: <a style={styles.links} href={'/business/companies'} target={'_blank'}> Ir a configurar <ArrowRightOutlined /></a>,
        },
        {
            title: '2. Información de Registro Patronal',
            description: <a style={styles.links} href={'/business/patronalRegistrationNode'} target={'_blank'}> Ir a configurar <ArrowRightOutlined /></a>,
        },
        {
            title: '3. Generar Departamentos, Puestos y Plazas',
            description: <a style={styles.links} href={'/config/catalogs'} target={'_blank'}>  Ir a configurar <ArrowRightOutlined /></a>,
        },
        {
            title: '4. Verificar información de la persona (Nómina, Imss, Fecha de ingreso)',
            description: <a style={styles.links} href={'/home/persons'} target={'_blank'}> Ir a configurar <ArrowRightOutlined /></a>,
        },
    ]

      return (
          <>
              <Button type="primary" onClick={showModal}>
                  <InfoCircleOutlined /> Información de nómina
              </Button>
              <Modal title=" Información requerida para el módulo de nómina" width={1000} visible={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                 <Row>
                     <Badge.Ribbon text="V.06102023">
                     <Col span={24}>


                         <br/>
                         <Steps direction="vertical" current={0}>
                             {
                                steps &&  steps.map((st)=>{
                                     return <Step status={'finish'} description={st.description} title={st.title} />
                                 })
                             }
                         </Steps>

                         <br/>
                         <Alert
                             message=""
                             showIcon
                             description={
                                 <p><a  href="https://rise.articulate.com/share/4aYIEFbd7yUZlU-ZK_paazBEVDQPXmzz#/" target={'_blank'}>Visita el manual haciendo clic aquí</a></p>
                             }
                             type="info"
                         />





                     </Col>
                     </Badge.Ribbon>
                 </Row>
              </Modal>
              {data &&
              <div>
                <br/>
                <Button type="primary" onClick={showModalSystem}>
                    <InfoCircleOutlined /> Información de sistema
                </Button>
              </div>}
              {data && <Modal title=" Información de acceso a los sistemas" width={400} visible={isModalOpenSystem} onOk={handleOkSystem} onCancel={handleCancelSystem}>
                 <Row>
                     <Col span={24}>


                         <br/>
                         <Timeline>
                            {data?.concierge_code &&<Timeline.Item dot={<img src={imgSukhaTv} width={30}/>}>Concierge: <b><Paragraph copyable>{data.concierge_code}</Paragraph></b></Timeline.Item>}
                            {data?.khorflix_code && <Timeline.Item dot={<img src={imgKhorflix} width={30}/>}>Khorflix: <b><Paragraph copyable>{data.khorflix_code}</Paragraph></b></Timeline.Item>}
                            {data?.sukhatv_code &&<Timeline.Item dot={<img src={imgSukhaTv} width={30}/>}>Sukha TV: <b><Paragraph copyable>{data.sukhatv_code}</Paragraph></b></Timeline.Item>}
                        </Timeline>
                         <Alert
                             message=""
                             showIcon
                             description={
                                 <p>Los códigos mostrados, son los que se solicitan en las respectivas aplicaciones</p>
                             }
                             type="info"
                         />





                     </Col>
                 </Row>
              </Modal>}
          </>

      )
};


const styles= {
    links: {color:'blue'}
}

export default ButtonWizardLight;
