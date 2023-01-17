import React, { Fragment } from 'react';
import { Row, Col, Skeleton, Tooltip, message } from 'antd';
import { useSelector } from 'react-redux';
import Clipboard from 'react-clipboard.js';
import _ from 'lodash';
import { ContentState, convertFromHTML, convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";

const TagsNotify = ({
    copyTag = ()=>{}
}) => {

    const {
        list_tags_notification,
        load_tags_notification
    } = useSelector(state => state.jobBankStore);

    const onSucess = (value) =>{

    }

    return (
        <Skeleton loading={load_tags_notification} active>
            <Row gutter={[8,8]} className='vacant-list-fields'>
                <Col span={24}>
                    <div style={{background: '#f0f0f0', padding: '8px', borderRadius: '12px'}}>
                        {list_tags_notification.length > 0 ? (
                            <Row gutter={[8,0]} className='section-list-fields'>
                                {_.chunk(list_tags_notification, Math.ceil(list_tags_notification.length/4)).map((record, idx) => (
                                    <Col
                                        xs={24} md={12} lg={8} xl={6}
                                        key={"record_"+idx}
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 8
                                        }}
                                    >
                                        {record.map((item, idx) => (
                                            <Tooltip title={item.tag_name} key={"tag_"+idx}>
                                                <div
                                                    className='btn-tag-copy'
                                                    onClick={()=> copyTag(item.tag_name)}
                                                >
                                                    {item.tag_name}
                                                </div> 
                                            </Tooltip>
                                        ))}
                                    </Col>
                                ))}
                            </Row>
                        ):(
                            <div className='placeholder-list-items'>
                                <p>Ningún campo disponible</p>
                            </div>
                        )}
                    </div>
                </Col>
            </Row>
        </Skeleton>
    )
}

export default TagsNotify