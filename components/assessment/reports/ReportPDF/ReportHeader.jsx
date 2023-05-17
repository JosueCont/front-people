import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image
} from '@react-pdf/renderer';
import { theme } from './ReportUtils';

const ReportHeader = ({
    name,
    description,
    title,
    info,
    photo,
    showPhoto
}) => {

    const noValid = [undefined, null, "", " "];

    return (
        <View style={styles.header}>
            <View style={styles.user_content}>
                {showPhoto && (
                    <Image
                        src={!noValid.includes(photo) ? { 
                            uri: photo, 
                            method: "GET", 
                            headers: {"Cache-Control": "no-cache"}, 
                            body: ""
                        } : '/images/usuario.png'}
                        style={styles.user_profile}
                    />
                )}
                <View style={[
                    styles.user_info,
                    {borderLeft: showPhoto ? '2px solid #d9d9d9' : 'none',
                    paddingLeft: showPhoto ? 8 : 0}
                ]}>
                    <Text style={styles.user_name}>{name}</Text>
                    {description && (
                        <Text style={styles.user_extra}>
                            {description}
                        </Text>
                    )}
                </View>
            </View>
            {(title || info) && (
                <View style={styles.extra_content}>
                    {title && (
                        <Text style={styles.user_name}>
                            {title}
                        </Text>
                    )}
                    {info && (
                        <Text style={styles.user_extra}>
                            {info}
                        </Text>
                    )}
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 50,
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: '#f0f0f0',
        border: '1px solid #d9d9d9',
        borderRadius: 4,
    },
    user_content: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    user_info: {
        display: 'flex',
        flexDirection: 'column',
        width: 375
    },
    user_profile: {
        height: 34,
        minWidth: 34,
        borderRadius: '50%',
        marginRight: 8
    },
    user_name: {
        fontSize: 12,
        color: theme.color.black,
        maxWidth: 300
    },
    user_extra: {
        fontSize: 10,
        color: '#00000080',
        maxWidth: 375,
        marginTop: 2
    },
    extra_content: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end'
    },
    extra_text: {
        fontSize: 12,
        color: theme.color.black
    }
})

export default ReportHeader