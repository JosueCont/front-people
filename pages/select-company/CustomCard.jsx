import { Typography, Card , Button, Tooltip} from "antd";
import { SettingOutlined } from "@ant-design/icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import styled from "@emotion/styled";
import {UsersIcon} from "../../components/icons/";
import { useRouter } from "next/router";
import { useRef } from "react";


const {Text} = Typography; 

const StyledCard = styled('div')({
    backgroundColor: '#fff',
    overflow:'hidden',
    height:'100%',
    position:'relative', 
    margin:'auto',
    width:'257px',
    display:'flex', 
    border:'1px solid #D3D3D3!important',
    borderRadius:'8px',
    flexDirection:'column', 
    justifyContent:'space-between',
    '&:hover':{
      boxShadow: '0px 4px 40px 0px rgba(0, 0, 0, 0.16)',
      transition: '0.5s',
      '& .ant-card-body':{
        transition: '0.5s',
        background:'#121212',
        '& p':{
          color:'#F4F4F4',
          transition: '0.5s',
        },
        '& .usersIcon svg path':{
          fill:'white',
          transition: '0.5s',
        }
      }
    },
    '& .ant-card-cover':{
      height:'140px'
    },
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
const SettingIcon = styled(SettingOutlined)({
  width:'16px', 
  height:'16px',
}); 
const SettingWrapper = styled('div')({
  position:'absolute', 
  top:'0px', 
  right:'0px',
  padding:'8px', 
  zIndex:'999', 
  backgroundColor:'#F4F4F4',
  borderTopRightRadius:'8px',
  '&:hover':{
    backgroundColor:''
  }
}); 

const CustomCard = ({item, setCompanySelect})=>{
    const [imgSrc , setImgSrc] = useState(''); 
    const [name, setName] = useState(''); 
    const [companyID, setCompanyID] = useState(null);
    const [activeCollaborators, setActiveCollaborators] = useState(0);
    const route = useRouter();
    const refIconBtn = useRef(null); 
    const refCard = useRef(null); 

    if (!item) {
        // Handle the case where item is undefined
        return null;
    }

    useEffect(()=>{
      const onCardClick = (event)=>{
        if(refCard.current.contains(event.target)){
          setCompanySelect(item); 
        }
      }

      const element = refCard.current;

      element.addEventListener("click", onCardClick, {capture:true}); 

      return() => {
        element.removeEventListener("click", onCardClick, {capture:true} )
      }
    },[])

    useMemo(()=>{
      const {id, num_collaborators} = item; 
      const num_employees = item.num_of_employees ?? num_collaborators; 
      setActiveCollaborators(num_employees); 
      setCompanyID(id); 
    },[item])

    useEffect(()=>{
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

      const handleRedirection = useCallback(()=>{
        if(!!!companyID) return; 
        route.push(`/business/companies/myCompany/${companyID}`); 

      },[companyID]); 



    return(
      <StyledCard style={{position:'relative'}}>
      <Card
        className=""
        // style={{ border:'1px solid #D3D3D3!important',
        // borderRadius:'8px'}}
        bordered={false}
        hoverable
        cover={renderImage}
        ref={refCard}
      > 
        <div style={{padding:'16px', display:'flex', gap:'1em', justifyContent:'space-between'}}>   
            <TitleText>{name.toLowerCase()}</TitleText>
            <div style={{width:'66px', minWidth:'66px', display:'flex', justifyContent:'space-between'}}>
              <UsersIcon style={{width:'24px'}}/>
              <TitleText>{activeCollaborators}</TitleText>
            </div>
            
        </div>
        
      </Card>
      <a>
       <SettingWrapper ref={refIconBtn}  onClick={handleRedirection}>
       <Tooltip placement="top" title={'Ir a configuración de empresa'}>
         <SettingIcon/>
       </Tooltip>
     </SettingWrapper>
     </a>
     </StyledCard>
     
    
    )
}

export default CustomCard; 