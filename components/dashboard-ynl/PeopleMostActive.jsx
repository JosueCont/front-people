import {React, useEffect, useState} from 'react'
import {Avatar, List, Empty} from 'antd'
import { connect } from 'react-redux';

const PeopleMostActive = ({ynlStore,...props}) => {
    const [dataTop, setDataTop] = useState([]);
    useEffect(() => {
        setDataTop(ynlStore);
    }, [ynlStore]); 
  return (
    <>
        {ynlStore.length > 0 &&(
            <List
                itemLayout="horizontal"
                dataSource={dataTop}
                size="small"
                pagination={{
                    pageSize: 5,
                    total: dataTop.length,
                    position: ['bottomCenter'],
                    hideOnSinglePage: true
                }}
                renderItem={(item) => (
                <List.Item>
                    <List.Item.Meta
                    avatar={<Avatar  src={item.avatar ? item.avatar : "/images/LogoYnl.png"} />}
                    title={
                    <div>
                        <p style={{marginBottom:0, textAlign:"center", textTransform:"capitalize"}}>{item.firstName?.toLowerCase()} {item.lastName?.toLowerCase()}</p>
                    </div>}
                />
                </List.Item>
                )}
            />
        )}
        {ynlStore.length <= 0 &&(
            <Empty 
                image={Empty.PRESENTED_IMAGE_SIMPLE} 
                description={
                <span>
                    <b>No se encontraron personas</b>
                </span>
                } 
            />
        )}
    </>
  )
}

const mapState = (state) =>{
    return {
        ynlStore: state.ynlStore.topPersons
    }
};
export default connect(mapState)(PeopleMostActive);