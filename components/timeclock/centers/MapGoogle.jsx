import React, {
    useRef,
    useEffect,
    useState,
    memo
} from 'react';
import { Space } from 'antd';
import GoogleMapReact from 'google-map-react';
import styled from '@emotion/styled';

const ContentVertical = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const ContentBetween = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const ContentMap = styled.div`
    height: 100vh;
    width: 100%;
    border: 2px solid #ffff;
`;

const Button = styled.button`
    font-weight: 400;
    border: 1px solid #d9d9d9;
    box-shadow: 0 2px 0 rgba(0,0,0,0.015);
    cursor: pointer;
    height: 32px;
    padding: 4px 8px;
    font-size: 14px;
    border-radius: 10px;
    color: rgba(0,0,0,0.85);
    background-color: #ffff;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    gap: 8px;
    :disabled{
        border-color: #f0f0f0;
        background: #f0f0f0;
        text-shadow: none;
        box-shadow: none;
        cursor: not-allowed;
    }
`;

const MapGoogle = ({
    action = 'add',
    setPolygon = () => { },
    polygonShape = {},
    showControls = true
}) => {

    const [manager, setManager] = useState({});
    const [instance, setInstance] = useState({});
    const [isDrawing, setIsDrawing] = useState(false);
    const [infoWindow, setInfoWindow] = useState(false);
    const [marker, setMarker] = useState({});
    const [shape, setShape] = useState({});

    useEffect(() => {
        let exist = Object.keys(instance)?.length > 0;
        if (exist) initialize();
    }, [instance])

    useEffect(() => {
        let exist = Object.keys(instance)?.length > 0;
        let check = Object.keys(polygonShape)?.length > 0;
        if (exist && check && action == 'edit') createPolygon();
    }, [instance, polygonShape])

    const initialize = () => {

        const { map, maps } = instance;
        
        const info = new maps.InfoWindow();
        const drawingManager = new maps.drawing.DrawingManager({
            drawingMode: maps.drawing.OverlayType.POLYGON,
            drawingControl: false,
            drawingControlOptions: {
                position: maps.ControlPosition.TOP_CENTER,
                drawingModes: [maps.drawing.OverlayType.POLYGON]
            },
            polygonOptions: {
                editable: true,
                draggable: true,
                strokeWeight: 0
            }
        })

        setInfoWindow(info)
        setManager(drawingManager)

        maps.event.addListener(
            drawingManager,
            "polygoncomplete",
            (e) => callbackPolygon(e, drawingManager)
        )
    }

    const getPoints = (polygon) => {
        const map_ = item => ({ lat: item.lat(), lng: item.lng() });
        let points = polygon?.getPath()?.getArray().map(map_);
        setPolygon(points)
    }

    const callbackPolygon = (polygon, drawingManager) => {
        callbackEvents(polygon)
        drawingManager.setDrawingMode(null);
    }

    const callbackEvents = (polygon) => {
        let isBeingDragged = false;
        const path = polygon.getPath();

        getPoints(polygon)
        setShape(polygon)

        polygon.addListener('dragstart', () => {
            isBeingDragged = true;
        })

        polygon.addListener('dragend', () => {
            isBeingDragged = false;
            getPoints(polygon)
        })

        path.addListener('insert_at', () => {
            getPoints(polygon)
        })

        path.addListener('set_at', () => {
            if (isBeingDragged) return;
            getPoints(polygon)
        })

        path.addListener('remove_at', () => {
            getPoints(polygon)
        })
    }

    const createPolygon = () => {
        setIsDrawing(false)
        if (Object.keys(shape)?.length > 0) {
            shape.setMap(null);
            setShape({})
        }
        const polygon = new instance.maps.Polygon({
            paths: polygonShape?.paths,
            strokeWeight: 0
        })
        polygon.setMap(instance.map)
        callbackEvents(polygon)
        getCenter(polygon)

        let exist = Object.keys(marker)?.length > 0;
        if (exist && polygonShape.marker) {
            marker.setOptions({
                position: polygonShape.marker
            })
            return;
        }
        if (polygonShape.marker) {
            const location = new instance.maps.Marker({
                position: polygonShape.marker
            });
            location.setMap(instance.map);
            setMarker(location)
            return;
        }

        setMarker({})
    }

    const startDrawing = () => {
        setIsDrawing(true)
        instance.map.setOptions({ draggable: false })
        manager.setMap(instance?.map)

        let exist = Object.keys(shape)?.length > 0;
        if (exist && action == 'edit') {
            manager.setDrawingMode(null)
            shape.setOptions({
                editable: true,
                draggable: true,
            })
            return;
        }

        let mode = instance?.maps.drawing.OverlayType.POLYGON;
        manager.setDrawingMode(mode)
    }

    const resetDrawing = () => {
        setIsDrawing(false)
        instance.map.setOptions({ draggable: true })
        manager.setMap(null)

        let exist = Object.keys(shape)?.length > 0;
        if (exist && action == 'edit') {
            shape.setOptions({
                paths: polygonShape?.paths,
                strokeWeight: 0,
                editable: false,
                draggable: false,
            })
            return;
        }

        setPolygon([])
        shape.setMap(null)
        setShape({})

    }

    const getCenter = (polygon) => {
        const bounds = new instance.maps.LatLngBounds();
        polygon?.getPath().forEach(item => { bounds.extend(item) });
        let center = bounds.getCenter();
        instance.map.setOptions({center})
    }

    const getLocation = () => {
        try {
            navigator.geolocation.getCurrentPosition(resp => {
                const pos = {
                    lat: resp.coords.latitude,
                    lng: resp.coords.longitude
                }
                infoWindow.setPosition(pos)
                infoWindow.setContent('Mi ubicación')
                infoWindow.open(instance.map)
                instance.map.setOptions({
                    center: pos,
                    zoom: 16
                })
            }, () => {
                locationError(true)
            }, { enableHighAccuracy: true })
        } catch (e) {
            locationError(false)
        }
    }

    const locationError = (hasGeolocation) => {
        const pos = instance.map.getCenter();
        let msg = hasGeolocation
            ? 'Error: El servicio de geolocalización falló'
            : 'Error: Su navegador no admite la geolocalización';
        infoWindow.setPosition(pos);
        infoWindow.setContent(msg);
        infoWindow.open(instance.map);
    }

    return (
        <ContentVertical>
            {showControls && (
                <ContentBetween>
                    <Space>
                        <Button disabled={isDrawing} onClick={() => startDrawing()}>
                            {action == 'edit' ? 'Actualizar área' : 'Seleccionar área'}
                        </Button>
                        <Button disabled={!isDrawing} onClick={() => resetDrawing()}>
                            Reiniciar
                        </Button>
                    </Space>
                    <Space>
                        <Button disabled={isDrawing} onClick={() => getLocation()}>
                            Obtener mi ubicación
                        </Button>
                    </Space>
                </ContentBetween>
            )}
            <ContentMap>
                <GoogleMapReact
                    options={{
                        draggable: true,
                        mapTypeId: 'roadmap'
                    }}
                    bootstrapURLKeys={{
                        key: 'AIzaSyD5J5pV_bXyGd_h-EfoHqDomx3jttyZELQ',
                        libraries: 'drawing'
                    }}
                    defaultCenter={{
                        lat: 21.005147,
                        lng: -89.6151482
                    }}
                    defaultZoom={13}
                    yesIWantToUseGoogleMapApiInternals
                    onGoogleApiLoaded={setInstance}
                >
                </GoogleMapReact>
            </ContentMap>
        </ContentVertical>
    )
}

export default memo(MapGoogle);