import { Typography, Card } from "antd";
import { useEffect, useMemo, useState } from "react";
import styled from "@emotion/styled";

const {Text} = Typography; 

const StyledCard = styled(Card)({
    backgroundColor: '#fff',
    height:'100%',
    margin:'auto',
    width:'257px',
    display:'flex', 
    border:'1px solid #D3D3D3!important',
    borderRadius:'8px',
    flexDirection:'column', 
    justifyContent:'space-between',
    '& .ant-card-body':{
        padding:'0px!important',
        borderBottomRightRadius:'6px',
        borderBottomLeftRadius:'6px', 
        background:'#D3D3D3'
    }
}); 
const TitleText = styled('p')({
    fontSize:'16px', 
    marginBottom:'0px', 
    textTransform:'capitalize',
    color:'#666', 
    overflow:"hidden",
    textOverflow:'ellipsis',
    whiteSpace:'nowrap'
}); 

const CustomCard = ({item, setCompanySelect})=>{
    // const {overflowingText, hasVerticalOverflow} = useOverflowWatch(); 
    const [imgSrc , setImgSrc] = useState(''); 
    const [name, setName] = useState(''); 

    if (!item) {
        // Handle the case where item is undefined
        return null;
    }

    useEffect(()=>{
        //debugger;
        if(!!!item) return;
        setImgSrc(item.image ?? ''); 
        setName(item.name ?? ''); 
    },[item, item.image, item.name])
    
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
            <TitleText>{name.toLowerCase()}</TitleText>
        </div>
        
      </StyledCard>
    )
}

export default CustomCard; 