import Card from "antd/lib/card/Card"
import { Tooltip } from "antd";
import { MessageOutlined } from "@ant-design/icons";
import useOverflowWatch from "../../utils/useOverflowWatch";


const CustomCard = ({item, setCompanySelect, children})=>{
    const {overflowingText, hasVerticalOverflow} = useOverflowWatch(); 
    
    const handleOnError = (e) => {
        e.target.src = "/images/empresas.svg";
      };
    return(
    <Card
        className="cardCompany "
        hoverable
        cover={
          item.image ? (
            <img
              alt="example"
              src={item.image}
              style={{ width: "50%" }}
              onError={handleOnError}
            />
          ) : (
            <div className="center-content">
              <img
                alt="example"
                src="/images/LogoKhorconnect.svg"
                style={{ width: "50%" }}
                onError={handleOnError}
              />
            </div>
          )
        }
        style={{
          backgroundColor: `#262837`,
          padding:40
        }}
        onClick={() => setCompanySelect(item)}
      >
        {/* <span
        className="buttonEditCompany"
        style={{ position: "absolute" }}
      >
        <EditOutlined />
      </span> */}
        {/*<Meta*/}
        {/*  className="meta_company"*/}
        {/*  title={item.name}*/}
        {/*  // description="Ultima vez: Hace 2 Hrs"*/}
        {/*/>*/}
        
        <p className={hasVerticalOverflow ? "addDots":""} ref={overflowingText} style={{fontSize:15, color:'white', maxHeight:"5em", overflow:"hidden"}}>{item.name}</p>
        {hasVerticalOverflow && (
            <Tooltip title={item.name}>
                <MessageOutlined style={{color:'white'}}/>
            </Tooltip>
        )}
      </Card>
    )
}

export default CustomCard; 