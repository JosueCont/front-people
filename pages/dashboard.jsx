import { css, Global } from "@emotion/core";
import { Row, Col, Card, Image, Typography, Divider,  Menu, Dropdown } from 'antd';
import { isFunction, set } from "lodash";
import React, {useState, useEffect} from 'react'
import MainLayout from '../layout/MainLayout';
import {MoreOutlined, DeleteOutlined} from '@ant-design/icons';
/* import Draggable from 'react-smooth-draggable'; */
/* import moduleName from 'react-sm'; */


const dashboard = () => {

    const {Title} = Typography
    const [orders, setOrder] = useState([])
    const [tempOrder, setTempOrder] = useState([]);
    const [originalPositions, setOriginalPositions] = useState([]);
    const [origin, setOrigin] = useState(null)
    const [elementOrigin, setElementOrigin] = useState(null);
    const [hover, setHover] = useState(null)
    const [destination, setDestination ] = useState(null)
    const [dragActive, setDragActive] = useState(false);

    const setOverDrag = (position) =>{
        if(position !== destination){
            setDestination(position);
            setHover(position);
            /* if(position !== origin){ */
                let newData = array_move(origin, position);
                /* const newData2 = newData.map((item, idx) => {
                    item.pos = idx
                    return item
                }) */
                setOrder(newData);
                /* setTempOrder(newData2) */
            /* } */
        }
    }

    const array_move = (from, to) => {
        const array = [...originalPositions];
        array.splice(to, 0, array.splice(from, 1)[0]);
        return array; // for testing
    };

    const dragStart = (position) => {
        if(origin !== position){
            setDragActive(true)
            setOrigin(position);
            setElementOrigin(orders[position]);
            setOriginalPositions([...orders]);
        }
        /* let newData = orders.filter(item => item.pos !== position);
        setOrder(newData); */
    }

    const overEnd = () => {
        setHover(null);
        setDragActive(false)
        if(origin !== destination){
            let forReorder = orders.map((item,idx) =>{
                item.pos = idx;
                return item
            })
            setOrder(forReorder)
            setOriginalPositions(forReorder);
        }else{
            setOrder(originalPositions)
        }
        
        /* setOrder(originalPositions); */
    }

    /* const setGhostPosition = (pos) => {
        orders.map((item, idx) => {

        })
    } */

    useEffect(() => {
        let order = [
            {
                id:1,
                pos:0,
                key:'marvel',
                hover: false,
                taken: false,
                content:  <Image style={{maxWidth:200, maxHeight:100}} src="https://st2.depositphotos.com/3867453/8895/v/600/depositphotos_88954826-stock-illustration-number-one-1-logo-icon.jpg" />
                        
            },
            {
                id:2,
                pos:1,
                key:'dc',
                hover: false,
                taken: false,
                content: <Image style={{maxWidth:200, maxHeight:100}} src="https://image.shutterstock.com/image-vector/number-2-logo-icon-design-260nw-479898580.jpg" />
            },
            {   id:3,
                pos:2,
                key:'db',
                hover: false,
                taken: false,
                content: <Image style={{maxWidth:200, maxHeight:100}} src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvq2WTEQpLaI8cek2JBAVDcyU8zswf2IYDqQ&usqp=CAU" />
            },
            {
                id:4,
                pos:3,
                key:'naruto',
                hover: false,
                taken: false,
                content: <Image style={{maxWidth:200, maxHeight:100}} src="https://png.pngtree.com/png-clipart/20200727/original/pngtree-logo-icon-circle-letter-4-vector-png-image_5222234.jpg" />
            },
            {
                id:5,
                pos:4,
                key:'power',
                hover: false,
                taken: false,
                content: <Image style={{maxWidth:200, maxHeight:100}} src="https://c8.alamy.com/zoomses/9/e77b436b7c7f49adbbe059653b65b38a/rt45m8.jpg" />
            }]
        setOrder(order)
        setTempOrder(order)
    }, [])

    const onLeave = (position) =>{
        setOrder(originalPositions);
    }

    const deleteItemCard = (position) => {
        console.log('position',position);
        let newOrder = [...orders];
        newOrder.splice(position,1)
        setOrder(newOrder);
        setOriginalPositions(newOrder);
    }

    const MenuDropDown = (position) => (
        <Menu>
            <Menu.Item onClick={() => deleteItemCard(position) } >
                <DeleteOutlined />
                Eliminar
            </Menu.Item>
        </Menu>
    );

    const CardTools = ({position}) => (
        <Dropdown overlay={MenuDropDown(position)} placement="bottomRight" arrow>
            <MoreOutlined style={{cursor:'pointer'}} />
        </Dropdown>
    )


    return (
        <>
            <Global
                styles={css`
                    /* .ant-card{
                        height: 100%;
                    } */
                    .card-dragable .ant-card{
                        cursor: grab;
                    }
                    .card-dragable{
                        padding: 20px !important;
                    }
                    .card-hover .ant-card{
                        border: 3px red dotted;
                    }
                    .card-drag .ant-card{
                        cursor: grabbing;
                    }
                `}
            />
        <MainLayout currentKey={["persons"]}>
            <Row justify="space-between">
                <Col>
                    <Title>
                        Origin: {origin}
                    </Title>
                </Col>
                <Col>
                    <Title>
                        Destination: {destination}
                    </Title>
                </Col>
            </Row>
            <Row>
                {
                    orders && orders.length > 0 && orders.map((item,idx) =>  (
                            <Col className={`card-dragable ${hover === idx ? 'card-hover' : origin === idx ? 'card-drag' : '' }`} md={12}  >
                                <Card 
                                    title={idx === 0 ? '0' : idx}
                                    extra={<CardTools position={idx} />}
                                    draggable 
                                    onDragStart={() => dragStart(idx) } 
                                    /* onDragLeave={() => onLeave(idx)} */
                                    onDragEnter={() => setOverDrag(idx) } 
                                    onDragEnd={() => overEnd() }
                                >
                                    {item['content']}
                                </Card>
                            </Col>
                        )
                    )
                }
            </Row>
            
        </MainLayout>
        </>
    )
}

export default dashboard
