import Card from "antd/lib/card/Card"
import { useEffect, useMemo, useState } from "react";
import styled from "@emotion/styled";

const StyledCard = styled(Card)({
    backgroundColor: '#fff',
    height:'100%',
    margin:'auto',
    width:'257px',
    display:'flex', 
    border:'1px solid #D3D3D3',
    borderRadius:'8px',
    flexDirection:'column', 
    justifyContent:'space-between',
    '& .ant-card-body':{
        padding:'24px 0px 0px 0px!important',
        borderBottomRightRadius:'8px',
        borderBottomLeftRadius:'8px', 
        background:'#D3D3D3'
    }
}); 

const CustomCard = ({item, setCompanySelect})=>{
    // const {overflowingText, hasVerticalOverflow} = useOverflowWatch(); 
    const [imgSrc , setImgSrc] = useState(''); 

    if (!item) {
        // Handle the case where item is undefined
        return null;
    }

    useMemo(()=>{
        if(!!!item) return;
        if(!!!item.image) return; 
        setImgSrc(item.image); 
    },[item])
    
    const handleOnError = (e) => {
        e.target.src = "/images/empresas.svg";
      };

      const renderImage = useMemo(()=>{
        if(item.image){
            return(
                <img
                alt="example"
                src={imgSrc}
                style={{ width: "80%",height:'80%', objectFit:'contain' }}
                onError={handleOnError}
                />
            )
        }
        return(
            <div className="center-content">
              <img
                alt="example"
                src="/images/LogoKhorconnect_1.png"
                style={{ width: "80%",height:'80%', objectFit:'contain' }}
                onError={handleOnError}
              />
            </div>
        )
      },[item, imgSrc])


    return(
    <StyledCard
        className=""
        bordered={false}
        hoverable
        cover={renderImage}
        onClick={() => setCompanySelect(item)}
      >
        <div style={{padding:'16px'}}>   
            <p style={{
                fontSize:'16px', 
                fontFamily:'Raleway', 
                color:'#666', 
                overflow:"hidden",
                textOverflow:'ellipsis',
                whiteSpace:'nowrap'
                }}>{item.name}</p>
            
        </div>
        
      </StyledCard>
    )
}

export default CustomCard; 