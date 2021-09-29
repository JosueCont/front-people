import React, {useEffect} from 'react'
import {Button} from "antd";
import {EditOutlined, DeleteOutlined, PlusOutlined} from '@ant-design/icons';
                                               
const Options = ({item, onUpdate, onDelete, onCreate, buttonName, setSection, setQuestion}) => {

    useEffect(() => {
        setSection && setSection(item.id);
        setQuestion && setQuestion(item.id);
    }, [])

    return (
        <div style={{ display: 'flex', alignItems: 'center'}} key={1}>
            {
                onUpdate &&
                <EditOutlined
                style={{marginRight: 24}} 
                onClick={event => {
                    event.stopPropagation();
                    onUpdate(item);
                }}
                />
            }
            {
                onDelete &&
                <DeleteOutlined
                style={{marginRight: 24}}
                onClick={event => {
                    event.stopPropagation();
                    onDelete(item.id);
                }}
                />
            }
            {
                onCreate &&
                <Button 
                style={{marginRight: 10}} 
                onClick={ event => { 
                    event.stopPropagation();
                    onCreate(item.id);
                }}>
                    <PlusOutlined /> {buttonName}
                </Button>
            }
        </div>
    )
}

export default Options