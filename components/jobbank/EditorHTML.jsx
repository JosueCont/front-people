import React, {
    useEffect,
    useState
} from 'react';
import dynamic from 'next/dynamic';
import {
    convertToRaw,
    EditorState,
    ContentState
} from 'draft-js';
import draftToHtml from "draftjs-to-html";
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
const Editor = dynamic(() => import('react-draft-wysiwyg').then(mod => mod.Editor), { ssr: false })

const EditorHTML = ({
    label = '',
    placeholder = '',
    textHTML = '',
    setValueHTML,
    editorState,
    setEditorState,
    options = ['inline', 'list', 'textAlign'],
    editorStyle = {},
    toolbarStyle = {},
    wrapperStyle = {},
    isReadOnly = false
}) => {

    const noValid = [undefined, null, "", " "];
    // ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'image', 'remove', 'history']

    useEffect(() => {
        if (noValid.includes(textHTML)) return;
        convertHTML();
    }, [textHTML])

    const convertHTML = () => {
        const blocksFromHtml = htmlToDraft(textHTML);
        const { contentBlocks, entityMap } = blocksFromHtml;
        let html = ContentState.createFromBlockArray(contentBlocks, entityMap);
        setEditorState(EditorState.createWithContent(html));
        setValueHTML(textHTML)
    }

    const onChangeEditor = (value) => {
        let current = value.getCurrentContent();
        let msg = draftToHtml(convertToRaw(current));
        setValueHTML(msg)
        setEditorState(value)
    }

    return (
        <>
            {label && (
                <label style={{ display: 'block', padding: '0px 0px 8px' }}>
                    {label}
                </label>
            )}
            <Editor
                readOnly={isReadOnly}
                editorState={editorState}
                onEditorStateChange={onChangeEditor}
                toolbar={{
                    options: options,
                    inline: { options: ['bold', 'italic', 'underline', 'strikethrough', 'monospace'] },
                    list: { options: ['unordered', 'ordered'] }
                }}
                placeholder={placeholder}
                editorClassName='scroll-bar'
                localization={{
                    locale: 'es'
                }}
                wrapperStyle={{
                    backgroundColor: isReadOnly ? '#f5f5f5' : '#ffff',
                    borderRadius: 10,
                    ...wrapperStyle
                }}
                editorStyle={{
                    padding: '0px 12px',
                    minHeight: '150px',
                    maxHeight: '150px',
                    overflow: 'auto',
                    backgroundColor: isReadOnly ? '#f5f5f5' : '#ffff',
                    cursor: isReadOnly ? 'not-allowed' : 'default',
                    borderRadius: 10,
                    ...editorStyle,
                }}
                toolbarStyle={{
                    borderRadius: 10,
                    backgroundColor: isReadOnly ? '#f5f5f5' : '#ffff',
                    ...toolbarStyle
                }}
            />
        </>
    )
}

export default EditorHTML