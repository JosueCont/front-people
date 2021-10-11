import React, {useEffect} from 'react';
import {Button} from "antd";
import {EditOutlined, DeleteOutlined, PlusOutlined, DownOutlined, UpOutlined} from '@ant-design/icons';

const Options = ({item, index, array, onOrder, onUpdate, onDelete, onCreate, buttonName}) => {

    return (
        <div style={{ display: 'flex', alignItems: 'center'}} key={`item-${item.id}`}>
            {
                <DownOutlined 
                className="handle-content" 
                style={{marginRight: 24, fontSize: 18}} 
                onClick={event => {
                    event.stopPropagation();
                    onOrder("down", item);
                }} />
            }
            {
                <UpOutlined 
                className="handle-content" 
                style={{marginRight: 24, fontSize: 18}} 
                onClick={event => {
                    event.stopPropagation();
                    onOrder("up", item);
                }} />
            }
            {
                onUpdate &&
                <EditOutlined
                style={{marginRight: 24, fontSize: 18}} 
                onClick={event => {
                    event.stopPropagation();
                    onUpdate(item);
                }} />
            }
            {
                onDelete &&
                <DeleteOutlined
                style={{marginRight: 24, fontSize: 18}}
                onClick={event => {
                    event.stopPropagation();
                    onDelete(item);
                }} />
            }
            {
                onCreate && item.type !== "TXT-LG" &&
                <Button 
                style={{marginRight: 10}} 
                onClick={ event => { 
                    event.stopPropagation();
                    onCreate(item.id);
                }}> <PlusOutlined /> {buttonName} </Button>
            }
        </div>
    )
}

export default Options;