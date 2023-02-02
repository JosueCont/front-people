import {useState} from "react";
import {Button, Modal, Steps, Row, Col, Alert} from "antd";
const { Step } = Steps;
import {
    ArrowRightOutlined,
    InfoCircleOutlined
} from "@ant-design/icons";
const ButtonWizardLight=()=>{

    const [isModalOpen, setIsModalOpen] = useState(false);
    const description  = "hola"

    const showModal = () => {
        setIsModalOpen(true);
    };


    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };


    const steps = [
        {
            title: '1. Información fiscal de empresa',
            description: <a style={styles.links} href={'/business'} target={'_blank'}> Ir a configurar <ArrowRightOutlined /></a>,
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
            title: '3. Verificar información de la persona (Noómina, Imss, Fecha de ingreso)',
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
                     <Col span={24}>


                         <br/>
                         <Steps direction="vertical" current={0}>
                             {
                                 steps.map((st)=>{
                                     return <Step status={'finish'} description={st.description} title={st.title} />
                                 })
                             }
                         </Steps>

                         <br/>
                         <Alert
                             message=""
                             showIcon
                             description={
                                 <p>Para mas detalle del uso de la plataforma puedes consultar nuestro manual <a
                                     href="https://rise.articulate.com/share/4aYIEFbd7yUZlU-ZK_paazBEVDQPXmzz#/" target={'_blank'}>aquí</a></p>
                             }
                             type="info"
                         />





                     </Col>
                 </Row>
              </Modal>
          </>

      )
};


const styles= {
    links: {color:'blue'}
}

export default ButtonWizardLight;
