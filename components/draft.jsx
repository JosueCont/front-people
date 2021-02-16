import React, {useEffect, useState} from "react"
import {ContentState, convertFromHTML, convertToRaw, EditorState} from "draft-js";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {Col, Form, Row} from "antd";

import dynamic from 'next/dynamic'

const Editor = dynamic(() => {
        return import('react-draft-wysiwyg').then((mod) => mod.Editor);
    },
    {
        loading: () => null,
        ssr: false
    }
);

const FormItemHTMLPlace = ({html = "", setHTML}) => {
    const cols = {
        padding: 10,
        marginBottom:10
    }

    const [editorState, setEditorState] = useState(EditorState.createEmpty());

    useEffect(() => {

        let value = EditorState.createWithContent(
            ContentState.createFromBlockArray(
                convertFromHTML(html)
            ));
        setEditorState(value)
    }, []);


    const onEditorStateChange = editorState => {
        setEditorState(editorState)
        let val = draftToHtml(convertToRaw(editorState.getCurrentContent()))
        setHTML(val);
    };


    return (
        <Row>
            <Col lg={24} xs={24} style={cols}>
                <Form.Item name="html" label={'HTML'}>
                    <Editor
                        toolbarClassName="toolbarClassName"
                        wrapperClassName="wrapperClassName"
                        editorClassName="editorClassName"
                        onEditorStateChange={onEditorStateChange}
                        editorState={editorState}
                        editorStyle={{
                            borderBottom: '0.1px solid #ccc',
                            borderLeft: '0.1px solid #ccc',
                            borderRight: '0.1px solid #ccc',

                        }}

                    />
                </Form.Item>
            </Col>
        </Row>
    )

}


export default FormItemHTMLPlace;