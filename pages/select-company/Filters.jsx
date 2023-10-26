import { Col,Row, Button, Input } from "antd";
import { AppstoreOutlined, PlusCircleOutlined, UnorderedListOutlined } from "@ant-design/icons";
import isPropValid from '@emotion/is-prop-valid'
import styled from "@emotion/styled";
import { StrongText } from "./TopSection";

const CustomBtn = styled(Button,{
    shouldForwardProp: prop => isPropValid(prop) && prop !== 'color' && prop !== 'backgroundColor'
})(({color, backgroundColor})=>({
    borderRadius:'4px',
    display: 'inline-flex',
    height: '44px',
    padding: '12px 24px',
    alignItems:'center',
    border: 'none!important',
    borderRadius: '4px',
    backgroundColor: backgroundColor + '!important' ?? '#1C1B2B' , 
    color: color + '!important'?? '#fff', 
    '& span':{
        color: color + '!important'?? '#fff', 
    },
    '&:hover': {
        '& span':{
            color: '#fff!important', 
        },
    }
  }));

  const WrapperBtns = styled('div')({
    display:'flex', 
    justifyContent:'flex-end',
    width:'100%',
    gap:'12px',
    flexWrap:'wrap',
    '@media (max-width:508px)':{
        justifyContent:'center'
    }
  })

const Filters = ({setTreeTable, switchModal, debouncedSearch})=>{

    const changeViewTable = () => {
        setTreeTable(true);
    };
    const changeViewCards = () => {
    setTreeTable(false);
    };

    return(
        
            <Row justify="space-between" style={{alignItems:'center'}} gutter={[8,12]}>
                <Col xs={24} sm={12} lg={7} style={{textAlign:'center'}}>
                    <StrongText style={{fontSize:'22px'}}>
                        ¿En qué empresa trabajaremos hoy?
                    </StrongText>
                </Col>
                 <Col xs={24} sm={12} lg={8} style={{textAlign:'center'}}>
                    <Input style={{ width:'100%', maxWidth:'400px' }} size={'large'} placeholder="Buscar empresa" onChange={debouncedSearch} allowClear />
                  </Col>
                  <Col xs={24} lg={9}>
                    <WrapperBtns>
                        <CustomBtn onClick={changeViewTable} backgroundColor="#466289">
                                <UnorderedListOutlined style={{fontSize:'20px'}} />
                                &nbsp;&nbsp;Lista
                        </CustomBtn>
                        <CustomBtn onClick={changeViewCards} backgroundColor="#466289">
                                <AppstoreOutlined style={{fontSize:'20px'}} />
                                &nbsp;&nbsp;Tarjetas
                        </CustomBtn>
                        <CustomBtn onClick={switchModal} backgroundColor="#F99543" color="black">
                            <PlusCircleOutlined style={{fontSize:'20px', color:'#121212'}} /> Agregar empresa
                        </CustomBtn>
                    </WrapperBtns>
                        
                  </Col>
                  
                
            </Row>
       
    )
}
export default Filters; 