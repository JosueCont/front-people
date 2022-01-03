import React, {useState, useEffect} from 'react'
import {Row, Col, Skeleton, Card, Dropdown, Menu} from 'antd';
import { css, Global } from "@emotion/core";
import {DeleteOutlined, MoreOutlined, EllipsisOutlined} from '@ant-design/icons';

/* columns accepted => 1, 2, 3, 4, 6, 8, 12  */
const DragAndDrop = ({ columns=1, children ,  reorder, dragEnd, ...props}) => {

    const [origin, setOrigin] = useState(null)
    const [destination, setDestination ] = useState(null)
    const [hover, setHover] = useState(null)
    const [arrayContents, setArrayContents] = useState([])
    
    useEffect(() => {
        createArrays(children)
        
    }, [children])


   /*  useEffect(() => {
        if(tempArray.length>0){
            setContents()
        }
    }, [tempArray]) */

    const createArrays = (arrayOrder) =>{
        let newArray = [];
        for (let index = 0; index < columns; index++){
            newArray.push([]);
        }
        setContents(newArray, arrayOrder)
    }

    const setContents = (list, arrayOrder) => {
        let dataArray = list
        let idx = 0;
        let newOrders = [];
        arrayOrder.map((item) => {
            newOrders.push(item);
            dataArray[idx].push(item);
            idx++;
            if(idx===columns){
                idx=0;
            }
        })
        setArrayContents(dataArray);
    }

    const dragStart = (position) => {
        console.log('start_position',position);
        if(origin !== position){
            setOrigin(position);
            setDestination(position)
        }
    }

    const setOverDrag = (position) =>{
        console.log('okok');
        console.log('position',position);
        if(position !== destination){
            console.log('position_hover', position);
            setDestination(position);
            setHover(position);
            reorder(origin, position)
        }
    }

    const overEnd = () => {
        setHover(null);
        dragEnd();
        /* if(origin !== destination){
            setOriginalPositions(forReorder);
        }else{
            setOrder(originalPositions)
        } */
        
        /* setOrder(originalPositions); */
    }

    const MenuDropDown = (position) => (
        <Menu>
            <Menu.Item /* onClick={() => deleteItemCard(position) } */ >
                <DeleteOutlined />
                Eliminar
            </Menu.Item>
        </Menu>
    );

    const CardTools = ({position}) => (
        <div style={{textAlign:'right',height:10}}>
            <Dropdown overlay={MenuDropDown(position)} placement="bottomRight" arrow >
                <EllipsisOutlined style={{cursor:'pointer' }} />
            </Dropdown>
        </div>
    )

    return (
        <>
            <Global
                styles={css`
                    .card-dragable .ant-card{
                        cursor: grab;
                    }
                    
                    .card-dragable .ant-card .ant-card-head{
                        min-height: 0px;
                        border:none;
                    }
                    .card-dragable .ant-card .ant-card-head .ant-card-extra{
                        padding: 0px;
                    }

                    .ant-card-body{
                        padding: 10px 15px 15px
                    }

                    .card-hover .ant-card{
                        border: 3px red dotted;
                    }
                    .card-drag .ant-card{
                        cursor: grabbing;
                    }
                `}
            />

        {
            arrayContents.length <= 0 ?
            (<Skeleton />) :
            <Row gutter={20} type="flex">
                {arrayContents.map(column => (
                    <Col md={24/columns}>
                        <Row gutter={[16, 20]}>
                            {column.map(item => (
                                <Col span={24} className={`card-dragable ${hover === item.props.position ? 'card-hover' : origin === item.props.position ? 'card-drag' : '' }`}>
                                    <Card
                                        draggable
                                        onDragStart={() => dragStart(item.props.position) } 
                                        onDragEnter={() => setOverDrag(item.props.position) } 
                                        onDragEnd={() => overEnd() }
                                    >   
                                        <CardTools position={item.props.position}/>
                                        {item}
                                    </Card>
                                </Col>
                            )
                            )}
                        </Row>
                    </Col>
                )) }
            </Row>
        }
        </>
    )
} 


export default DragAndDrop
