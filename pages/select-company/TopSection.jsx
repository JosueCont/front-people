import { Typography } from "antd"
import WebApiPeople from "../../api/WebApiPeople";
import Cookie from "js-cookie";
import { useEffect, useState } from "react";
import styled from "@emotion/styled";
const {Text} = Typography; 

const LigthText = styled(Text)({
    color: "#666",
    fontFamily: "Raleway",
    fontSize: "16px",
    fontStyle: "normal",
    fontWeight: 400,
    lineHeight: "normal",
})

export const StrongText = styled(Text)({
    color: "#666",
    fontFamily: "Raleway",
    fontSize: "32px",
    fontStyle: "normal",
    fontWeight: 700,
    lineHeight: "normal",
})


const TopSection = ({}) => {
    const [name, setName] = useState('Visitante'); 
    useEffect(()=>{
        (async()=>{
            try{
                let user = Cookie.get();
                if (user && user != undefined && user.token) {
                    user = JSON.parse(user.token);
                    const {data:{first_name}} = await WebApiPeople.personForKhonnectId({
                        id:user.user_id,
                    }); 
                    setName(first_name); 
                }
            }
            catch(e){
                console.log("error", e); 
            }
            
        })();
        
    },[])
    
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
                <div style={{display:'flex', flexDirection:'column'}}>
                <LigthText>
                    Bienvenido
                </LigthText> 
                <StrongText>
                    {name}
                </StrongText> 
                </div>
                
            </div>
            <div >
                <div style={{display:'flex', alignItems:'self-end', gap:'22px'}}>
                    <img  width={'32px'} height={'32px'} style={{objectFit:'contain'}} src="/images/keys.png"/>
                    <LigthText>
                        Apps en tu plan
                    </LigthText> 
                <div style={{ display: 'flex', flexDirection: 'column', alignItems:'center' }}>
                    <img width={'32px'} height={'32px'} style={{objectFit:'contain'}}  src="/images/khor-yellow.png"/>
                    <LigthText>
                        Khor 1.5
                    </LigthText> 
                </div>
                </div>
                
            </div>
        </div>
    );
}

export default TopSection;
