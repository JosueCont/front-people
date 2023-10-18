import { Col,Row, Button, Input } from "antd";
import { AppstoreOutlined, PlusCircleOutlined, UnorderedListOutlined } from "@ant-design/icons";
import styled from "@emotion/styled";
import { StrongText } from "./TopSection";

const CustomBtn = styled(Button)({
    borderRadius:'4px',
    display: 'inline-flex',
    height: '44px',
    padding: '12px 24px',
    alignItems:'center'
  
  });

const Filters = ({setTreeTable, switchModal, debouncedSearch})=>{

    const changeViewTable = () => {
        setTreeTable(true);
    };
    const changeViewCards = () => {
    setTreeTable(false);
    };

    return(
        
            <Row justify="space-between" style={{alignItems:'center'}} gutter={[8,12]}>
                <Col sm={12} lg={7} style={{textAlign:'center'}}>
                    <StrongText style={{fontSize:'22px'}}>
                        ¿En qué empresa trabajaremos hoy?
                    </StrongText>
                </Col>
                 <Col sm={12} lg={8} style={{textAlign:'center'}}>
                    <Input style={{ width:'100%', maxWidth:'400px' }} size={'large'} placeholder="Buscar empresa" onChange={debouncedSearch} allowClear />
                  </Col>
                  <Col sm={24} lg={9}>
                    <div style={{display:'flex', justifyContent:'flex-end', width:'100%', gap:'12px', flexWrap:'wrap'}}>
                        <CustomBtn onClick={changeViewTable} className="v2">
                                <UnorderedListOutlined style={{fontSize:'20px'}} />
                                &nbsp;&nbsp;Lista
                        </CustomBtn>
                        <CustomBtn onClick={changeViewCards} className="v2">
                                <AppstoreOutlined style={{fontSize:'20px'}} />
                                &nbsp;&nbsp;Tarjetas
                        </CustomBtn>
                        <CustomBtn onClick={switchModal} className="v2 orange">
                            <PlusCircleOutlined style={{fontSize:'20px', color:'#121212'}} /> Agregar empresa
                        </CustomBtn>
                    </div>
                        
                  </Col>
                  
                
            </Row>
       
    )
}
export default Filters; 