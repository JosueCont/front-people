import React, { useEffect, useState } from "react";
import {
  ContentState,
  convertFromHTML,
  convertToRaw,
  EditorState,
} from "draft-js";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Col, Form, Row, Typography } from "antd";

import dynamic from "next/dynamic";

const Editor = dynamic(
  () => {
    return import("react-draft-wysiwyg").then((mod) => mod.Editor);
  },
  {
    loading: () => null,
    ssr: false,
  }
);

const FormItemHTMLPlace = ({ html = "", setHTML, ...props }) => {
  const { Text } = Typography;

  const cols = {
    padding: 10,
    marginBottom: 10,
  };

  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  useEffect(() => {
    let value = EditorState.createWithContent(
      ContentState.createFromBlockArray(convertFromHTML(html))
    );
    setEditorState(value);
  }, []);

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
    let val = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    if (val.length > 8) {
      props.setMessageAlert(false);
    } else {
      props.setMessageAlert(true);
    }
    setHTML(val);
  };

  const styleError = {
    borderBottom: "0.1px solid #fa4c4f",
    borderLeft: "0.1px solid #fa4c4f",
    borderRight: "0.1px solid #fa4c4f",
    borderTop: "0.1px solid #fa4c4f",
    height: "200px",
  };

  const styeDefault = {
    borderBottom: "0.1px solid #ccc",
    borderLeft: "0.1px solid #ccc",
    borderRight: "0.1px solid #ccc",
    height: "200px",
  };

  return (
    <Row>
      <Col lg={24} xs={24} style={cols}>
        <Form.Item name="html" label={"Mensaje"} labelAlign={"left"}>
          <Editor
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            onEditorStateChange={onEditorStateChange}
            editorState={editorState}
            editorStyle={props.messageAlert ? styleError : styeDefault}
          />
          {props.messageAlert ? (
            <Text type="danger">Este campo es requerido</Text>
          ) : null}
        </Form.Item>
      </Col>
    </Row>
  );
};

export default FormItemHTMLPlace;
