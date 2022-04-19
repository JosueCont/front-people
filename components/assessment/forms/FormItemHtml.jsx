import React, { useEffect, useState } from "react"
import { ContentState, convertFromHTML, convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Form } from "antd";

import dynamic from 'next/dynamic'

const Editor = dynamic(async() => 
    {
        return import('react-draft-wysiwyg').then((mod) => mod.Editor);
    },
    {
        loading: () => null,
        ssr: false
    }
);

const FormItemHTML = ({ html = "", setHTML, getLabel,  getName, getRule, ...props }) => {

    const [editorState, setEditorState] = useState(EditorState.createEmpty());

    useEffect(() => {
        if ( html !== "" ){
            let value = EditorState.createWithContent(
                ContentState.createFromBlockArray(
                    convertFromHTML(html)
                )
            );
            setEditorState(value)
        }
    }, []);

    useEffect(() => {
      if(html === "<p></p>"){
          let value = EditorState.createWithContent(
                ContentState.createFromBlockArray(
                    convertFromHTML(html)
                )
            );
            setEditorState(value)
      }
    }, [html])
    

    const onEditorStateChange = (editorState) => {
        const MAX_LENGTH = 1000; 
        const lenght = editorState.getCurrentContent().getPlainText().length;
        if ( lenght < MAX_LENGTH){
            setEditorState(editorState)
            let val = draftToHtml(convertToRaw(editorState.getCurrentContent()))
            setHTML(val);
        }
    };

    const styeDefault = {
        borderBottom: '0.1px solid #ccc',
        borderLeft: '0.1px solid #ccc',
        borderRight: '0.1px solid #ccc',
        height: '200px'
    }

    return (
        <Form.Item name={getName} label={getLabel}>
            <Editor
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={onEditorStateChange}
                editorState={editorState}
                editorStyle={styeDefault}
            />
        </Form.Item>
    )
}

export default FormItemHTML;