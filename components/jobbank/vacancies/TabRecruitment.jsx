import React, { useState } from 'react';
import {
  Form,
  Row,
  Col,
  Input,
  InputNumber,
  List,
  Button
} from 'antd';
import { validateNum, validateMaxLength } from '../../../utils/functions';
import { PlusOutlined, CloseOutlined } from '@ant-design/icons';
import {
  ruleRequired,
  ruleWhiteSpace
} from '../../../utils/rules';

const TabRecruitment = ({
  setListInterviewers,
  listInterviewers
}) => {

  const rule_validate = {status: '', text: ''};
  const [person, setPerson] = useState('');
  const [position, setPosition] = useState('');
  const [ruleValidate, setRuleValidate] = useState(rule_validate);

  const addInterview = () =>{
    if(!person.trim()){
      setRuleValidate({
        status: 'error',
        text: 'El nombre es requerido'
      })
      setPerson('')
      return;
    }
    if(!position.trim()){
      setRuleValidate({
        status: 'error',
        text: 'La posicion es requerida'
      })
      setPosition('')
      return;
    }
    setRuleValidate(rule_validate)
    let newList = [...listInterviewers, { name: person, position }];
    setListInterviewers(newList);
    setPerson('')
    setPosition('') 
  }

  const deleteItem = (idx) =>{
    let newList = [...listInterviewers];
    newList.splice(idx, 1);
    setListInterviewers(newList)
  }

  return (
    <Row gutter={[24,24]}>
      <Col xs={24} xl={8} span={8} className='list_interviewers'>
        <List
          header='Entrevistadores'
          itemLayout='horizontal'
          dataSource={listInterviewers}
          locale={{emptyText: 'No se encontraron resultados'}}
          size='small'
          renderItem={(item, idx) => (
            <List.Item
              key={`item_${idx}`}
              actions={[<CloseOutlined onClick={()=> deleteItem(idx)}/>]}
            >
                <List.Item.Meta
                  title={item.name}
                  description={item.position}
                />
            </List.Item>
          )}
        />
      </Col>
      <Col xs={24} xl={16}>
        <Row gutter={[24,0]}>
          <Col xs={24} md={12}>
            <Form.Item
              name='interviewers'
              label='¿Quién(es) entrevista(n)?'
              validateStatus={ruleValidate.status}
              help={ruleValidate.text}
            >
              <Input.Group compact>
                <Input
                  placeholder='Nombre'
                  maxLength={50}
                  value={person}
                  onChange={e => setPerson(e.target.value)}
                  style={{
                    width: 'calc(50% - 16px)',
                    borderTopLeftRadius: '10px',
                    borderBottomLeftRadius: '10px'
                  }}
                />
                <Input
                  placeholder='Posición'
                  maxLength={50}
                  value={position}
                  onChange={e=> setPosition(e.target.value)}
                  style={{
                    width: 'calc(50% - 16px)',
                  }}
                />
                <Button
                  icon={<PlusOutlined/>}
                  onClick={()=> addInterview()}
                  style={{
                    borderTopRightRadius: '10px',
                    borderBottomRightRadius: '10px'
                  }}
                />
              </Input.Group>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name='interviews_number'
              label='Número de entrevistas'
            >
              <InputNumber
                type='number'
                maxLength={2}
                controls={false}
                placeholder='¿Cuántas entrevistas se realizarán?'
                onKeyDown={validateNum}
                onKeyPress={validateMaxLength}
                style={{
                  width: '100%',
                  border: '1px solid black'
                }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name='observations'
              label='Durante la entrevista'
              // rules={[ruleWhiteSpace]}
            >
              <Input.TextArea
                autoSize={{minRows: 3, maxRows: 3}}
                placeholder='Describa las particularidades a observar'
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name='rejection_reasons'
              label='Motivos potenciales al rechazo'
              // rules={[ruleWhiteSpace]}
            >
              <Input.TextArea
                autoSize={{minRows: 3, maxRows: 3}}
                placeholder='Especificar los motivos'
              />
            </Form.Item>
          </Col>
          {/* <Col xs={24} md={12} xl={8} xxl={6}>
            <Form.Item label='Observaciones y comentarios adicionales'>
              <Input placeholder='Observaciones y comentarios adicionales'/>
            </Form.Item>
          </Col> */}
        </Row>
      </Col>
    </Row>
  )
}

export default TabRecruitment