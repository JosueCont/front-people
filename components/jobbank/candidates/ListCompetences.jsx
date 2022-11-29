import React, {useState, useEffect} from 'react';
import MyModal from '../../../common/MyModal';
import { Row, Col, Button, List } from 'antd';
import { useSelector } from 'react-redux';

const ListCompetences = ({
    visible,
    close,
    itemSelected
}) => {

    const {
        load_competences,
        list_competences
    } = useSelector(state => state.jobBankStore);
    const [listItems, setListItems] = useState([]);

    useEffect(()=>{
        if(Object.keys(itemSelected).length <= 0) return;
        if(itemSelected.competences?.length <= 0) return;
        let results = list_competences.filter(item => itemSelected.competences.includes(item.id))
        setListItems(results);
    },[itemSelected])

    return (
        <MyModal
            visible={visible}
            close={close}
            title='Listado de competencias'
            widthModal={400}
        >
            <Row gutter={[24,24]}>
                <Col span={24} className='elements_delete scroll-bar'>
                    <List
                        size='small'
                        itemLayout='horizontal'
                        dataSource={listItems}
                        loading={load_competences}
                        renderItem={(item, idx) => (
                            <List.Item key={item.id}>
                                <List.Item.Meta title={item.name}/>
                            </List.Item>
                        )}
                    />
                </Col>
                <Col span={24}
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '16px'
                    }}
                >
                    <Button onClick={()=> close()}>
                        Cerrar
                    </Button>
                </Col>
            </Row>
        </MyModal>
    )
}

export default ListCompetences;