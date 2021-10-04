import React from 'react';
import {Button} from "antd";
import {EditOutlined, DeleteOutlined, PlusOutlined, DownOutlined, UpOutlined} from '@ant-design/icons';

const Options = ({item, from, onOrder, onUpdate, onDelete, onCreate, buttonName}) => {
    return (
        <div style={{ display: 'flex', alignItems: 'center'}} key={`item-${item.id}`}>
            {
                false &&
                <DownOutlined 
                className="handle-content" 
                style={{marginRight: 24, fontSize: 18}} 
                onClick={event => {
                    event.stopPropagation();
                    onOrder(from, "down", item);
                }} />
            }
            {
                false && 
                <UpOutlined 
                className="handle-content" 
                style={{marginRight: 24, fontSize: 18}} 
                onClick={event => {
                    event.stopPropagation();
                    onOrder(from, "up", item);
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

export default Options