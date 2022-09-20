import {React, useEffect, useState} from 'react'
import {Avatar, List,} from 'antd'
import { connect } from 'react-redux';

const TopPeople = ({ynlStore,...props}) => {
    const [dataTop, setDataTop] = useState([]);
    useEffect(() => {
        setDataTop(ynlStore);
    }, [ynlStore]); 
  return (
    <>
        <List
            itemLayout="horizontal"
            dataSource={dataTop}
            renderItem={(item) => (
            <List.Item>
                <List.Item.Meta
                avatar={<Avatar src={item.avatar} />}
                title={
                <div>
                    <p style={{marginBottom:0, textAlign:"center", textTransform:"capitalize"}}>{item.firstName}</p>
                    <p style={{marginBottom:0, textAlign:"center", textTransform:"capitalize"}}>{item.lastName}</p>
                </div>}
            />
            </List.Item>
            )}
        />
    </>
  )
}

const mapState = (state) =>{
    return {
        ynlStore: state.ynlStore.topPersons
    }
};
export default connect(mapState)(TopPeople);