import {
    View,
    Text,
    Image,
    Document,
    Page,
    PDFViewer,
    StyleSheet
} from '@react-pdf/renderer';

export const theme = {
    color: {
        purple: '#7B25F1',
        orange: '#F36E37',
        purpleBold: '#631AC8',
        purpleSemiLight: '#A360FF',
        purpleLight: '#EBE9FF',
        purpleRegular: '#D2A4FF',
        purpleNormal: '#cac6ed',
        black: '#000000d9',
        gray: '#F0F2F5'
    }
}

export const CardTable = ({
    pos = 0,
    item = {},
    marginTop = 0,
    tip = 'Resultado no encontrado'
}) => (
    <View style={{
        border: '1px solid #d9d9d9',
        borderRadius: 4,
        backgroundColor: '#fafafa',
        marginTop: marginTop
    }} wrap={false}>
        <View style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            textAlign: 'center',
            borderBottom: '1px solid #d9d9d9',
            paddingVertical: 4,
            paddingHorizontal: 8
        }}>
            <Text style={{
                fontSize: 10,
                color: theme.color.black
            }}>{pos+1}.- {item?.name}</Text>
            <Text style={{
                fontSize: 10,
                color: theme.color.black
            }}>
                {item?.compatibility}
            </Text>
        </View>
        <View style={{
            display: 'flex',
            flexDirection: 'row',
        }}>
            <View style={{
                flex: '1',
                textAlign: 'center',
                paddingVertical: 4,
                paddingHorizontal: 8
            }}>
                <Text style={{
                    fontSize: 10,
                    color: theme.color.black
                }}>
                    Nivel persona ({item?.level_person})
                </Text>
            </View>
            <View style={{
                flex: '1',
                textAlign: 'center',
                paddingVertical: 4,
                paddingHorizontal: 8,
                borderLeft: '1px solid #d9d9d9'
            }}>
                <Text style={{
                    fontSize: 10,
                    color: theme.color.black
                }}>
                    Nivel perfil ({item?.level_profile})
                </Text>
            </View>
        </View>
        <View style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'stretch',
            borderTop: '1px solid #d9d9d9'
        }}>
            {item?.description_person ? (
                <View style={{
                    flex: '1',
                    textAlign: 'justify',
                    paddingVertical: 4,
                    paddingHorizontal: 8
                }}>
                    <Text style={{
                        fontSize: 10,
                        color: theme.color.black
                    }}>
                        {item?.description_person}
                    </Text>
                </View>
            ) : (
                <View style={{
                    flex: '1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 4,
                    paddingHorizontal: 8
                }}>
                    <Text style={{
                        fontSize: 10,
                        color: '#d9d9d9'
                    }}>
                        {tip}
                    </Text>
                </View>
            )}
            <View style={{
                flex: '1',
                textAlign: 'justify',
                paddingVertical: 4,
                paddingHorizontal: 8,
                borderLeft: '1px solid #d9d9d9'
            }}>
                <Text style={{
                    fontSize: 10,
                    color: theme.color.black
                }}>
                    {item?.description_profile}
                </Text>
            </View>
        </View>
    </View>
)

export const Table = ({
    data = [],
    columns = []
}) => {

    const accessValue = (key, item) =>{
        return key.reduce((acc, current) =>{
            if(!acc) return null;
            return acc[current] ?? null;
        }, item)
    }

    return (
        <View style={{
            display: 'flex',
            flexDirection: 'column'
        }}>
            <View style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'stretch',
                border: '0.5px solid #d9d9d9',
                backgroundColor: '#fafafa'
            }}>
                {columns?.map((item, idx) => (
                    <View key={idx} style={{
                        paddingVertical: 4,
                        paddingHorizontal: 10,
                        borderLeft: idx > 0 ? '0.5px solid #d9d9d9' : 'none',
                        flex: `1 0 ${item.width ? item.width : `${100/columns.length}%`}`
                    }}>
                        <Text style={{
                            fontSize: 10,
                            color: theme.color.black
                        }}>
                            {item.label}
                        </Text>
                    </View>
                ))}
            </View>
            {data.length > 0 && (
                <View style={{
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    {data.map((record, idx) => (
                        <View key={idx} style={{
                            display: 'flex',
                            flexDirection: 'row',
                            border: '0.5px solid #d9d9d9'
                        }} wrap={false}>
                            {columns.map((item, index) => (
                                <View key={index} style={{
                                    paddingVertical: 4,
                                    paddingHorizontal: 10,
                                    flex: `1 0 ${item.width ? item.width : `${100/columns.length}%`}`,
                                    borderLeft: index > 0 ? '0.5px solid #d9d9d9' : 'none'
                                }}>
                                    <Text style={{
                                        fontSize: 10,
                                        color: theme.color.black
                                    }}>
                                        {Array.isArray(item.key)
                                            ? accessValue(item.key, record)
                                            : record[item.key]
                                            ? record[item.key]
                                            : null
                                        }
                                    </Text>
                                </View>
                            ))}
                        </View>
                    ))}
                </View>
            )}
        </View>
    )
}