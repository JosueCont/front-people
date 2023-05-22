import React, {useEffect} from "react"
import {
    EditorState,
    ContentState,
    convertToRaw,
    convertFromHTML,
} from 'draft-js'
import { StyleSheet, View, Text, Link, Image} from '@react-pdf/renderer'
import redraft from 'redraft'

import PDFStyles from "./PDFStyles";
import auto from "chart.js/auto";

const HeadingOne = ({ children }) => {
    return (
        <View>
            <Text style={PDFStyles.headingOne}>{children}</Text>
        </View>
    );
};

const UnorderedList = ({ children, depth }) => {
    return <View style={PDFStyles.list}>{children}</View>
};

const UnorderedListItem = ({ children }) => {
    return (
        <View style={PDFStyles.listItem}>
            <Text style={{ marginHorizontal: 8 }}>•</Text>
            <Text style={PDFStyles.listItemText}>{children}</Text>
        </View>
    );
};

const OrderedList = ({ children, depth }) => {
    return <View style={PDFStyles.list}>{children}</View>
};

const OrderedListItem = ({ children, index }) => {
    return (
        <View style={PDFStyles.listItem}>
            <Text style={{ marginHorizontal: 8 }}>{index + 1}.</Text>
            <Text style={PDFStyles.listItemText}>{children}</Text>
        </View>
    );
};

const renderers = {
    inline: {
        // The key passed here is just an index based on rendering order inside a block
        BOLD: (children, { key }) => {
            let fontWeight = PDFStyles.textBold
            children.forEach(e =>{
                if(e && e.type === 'TEXT' && (e.key.split('-')).includes('italic')){
                    fontWeight = PDFStyles.textBoldItalic
                }
            })
            return (
                <Text key={`bold-${key}`} style={fontWeight}>
                    {children}
                </Text>
            );
        },
        ITALIC: (children, { key }) => {
            let fontWeight = PDFStyles.textBold
            children.forEach(e =>{
                if(e && e.type === 'TEXT' && (e.key.split('-')).includes('bold')){
                    fontWeight = PDFStyles.textBoldItalic
                }
            })
            return (
                <Text key={`italic-${key}`} style={{ fontFamily: 'Helvetica-Oblique' }}>
                    {children}
                </Text>
            );
        },
        UNDERLINE: (children, { key }) => {
            return (
                <Text key={`underline-${key}`} style={{ textDecoration: 'underline' }}>
                    {children}
                </Text>
            );
        }
    },
    /**
     * Blocks receive children and depth
     * Note that children are an array of blocks with same styling,
     */
    blocks: {
        unstyled: (children, { keys }) => {
            return children.map((child, index) => {
                if(child.type === 'IMAGE') {
                    return child
                }
                return <Text key={keys[index]} >{child}</Text>
            });
        },
        'header-one': (children, { keys }) => {
            return children.map((child, index) => {
                return <HeadingOne key={keys[index]}>{child}</HeadingOne>;
            });
        },
        'unordered-list-item': (children, { depth, keys }) => {
            return (
                <UnorderedList key={keys[keys.length - 1]} depth={depth}>
                    {children.map((child, index) => (
                        <UnorderedListItem key={keys[index]}>{child}</UnorderedListItem>
                    ))}
                </UnorderedList>
            );
        },
        'ordered-list-item': (children, { depth, keys }) => {
            return (
                <OrderedList key={keys.join('|')} depth={depth}>
                    {children.map((child, index) => (
                        <OrderedListItem key={keys[index]} index={index}>
                            {child}
                        </OrderedListItem>
                    ))}
                </OrderedList>
            );
        },
       /* 'atomic': children => {
            console.log('atomic', children)
            return <View>{children}</View>
        }*/

    },
    /**
     * Entities receive children and the entity data
     */
    entities: {
        // key is the entity key value from raw
        LINK: (children, data, {key}) => (
            <Link key={key} src={data.url}>
                {children}
            </Link>
        ),
      //  IMAGE: (children, data, {key}) => (<Image src={data.src}/>)
        IMAGE: (children, data, {key}) => {
           // return <Image src={data.src} style={{height: 200}}/>
            let _width = 200
            let _heigth = 200
            let _styles ={
                objectFit: 'contain',
                objectPosition: '0',
                maxWidth: '100%',
            }
            console.log('IMG',children, data)
            let img = <Image key={key} style={_styles}  src={async () => {
              //  console.log('renderImage', data.src)
                let res = await fetchImageWithTimeout(data.src)
                //let res = await renderImage(data.src)
                console.log(res)
                if(res.isOk){
                   _styles = {..._styles,width: res.width, height: res.height}
                    return { uri: data.src, method: 'GET' }
                }
                return { uri: '/images/missing-image2.png', method: 'GET' }
            }} />
            return img
        }
    },
}
const imageDimensions = url =>
    new Promise((resolve, reject) => {
        const img = new window.Image()

        img.onload = () => {
            const { naturalWidth: width, naturalHeight: height } = img
            resolve({ width, height })
        }

        img.onerror = () => {
            reject('There was some problem with the image.')
        }

        img.src = url
    })
async function fetchImageWithTimeout(imageUrl, options = {}) {
    const { timeout = 3000 } = options;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try{
        const res = await fetch(imageUrl, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(id);

        if(res.status === 404) {
            return {imageUrl, isOk: false}
        }
        const dimensions = await imageDimensions(imageUrl)
        return {imageUrl, isOk: true, ...dimensions}
        return {imageUrl, isOk: true}
    }catch(err){
        console.log(err)
        return {imageUrl, isOk: false}
    }
}



const RichTextParser = ({ content }) => {
   // const parsedContent = (content) =>{

        const blocksFromHTML = convertFromHTML(content)
        const initialState = ContentState.createFromBlockArray(
            blocksFromHTML.contentBlocks,
            blocksFromHTML.entityMap,
        );

        const editorState = EditorState.createWithContent(initialState)
        const rawContent = convertToRaw(editorState.getCurrentContent())

        let result = redraft(rawContent, renderers, { blockFallback: 'unstyled' })
    console.log(result)
    return result


  //  }

   // return content ? parsedContent(content) : null

}
export default RichTextParser;