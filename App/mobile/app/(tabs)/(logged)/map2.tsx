import { useCallback, useRef, useState } from 'react'
import { Alert, Pressable, Text, View } from 'react-native'
import { WebView } from 'react-native-webview'
import { useFocusEffect } from 'expo-router'

import { NivelInundacao, Pedido, ZonaRisco } from '@/types'
import { api } from '@/services/api'

type RescueRequest = {
  id: string
  title: string
  category: string
  status: string
  priority: string
  latitude: string
  longitude: string
}

type RiskLevel = 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA'

export default function MapScreen() {
  const [requests, setRequests] = useState<RescueRequest[]>([])
  const [zoneMode, setZoneMode] = useState(false)
  const [selectedRisk, setSelectedRisk] = useState<RiskLevel>('ALTA')
    const [zones, setZones] = useState<ZonaRisco[]>([])

  const webViewRef = useRef<WebView>(null)

  useFocusEffect(
    useCallback(() => {
      api
        .get('/requests')
        .then(res => setRequests(res.data))
        .catch(() => {
        })
    }, [])
  )

  const markers = JSON.stringify(
    requests.map(request => ({
      ...request,
      latitude: Number(request.latitude),
      longitude: Number(request.longitude)
    }))
  )

  function sendToMap(data: object) {
    webViewRef.current?.postMessage(JSON.stringify(data))
  }

  function handleCreateZone() {
    const newValue = !zoneMode
    setZoneMode(newValue)

    sendToMap({
      type: 'SET_ZONE_MODE',
      active: newValue,
      risk: selectedRisk
    })
  }

  function handleRiskChange(risk: RiskLevel) {
    setSelectedRisk(risk)

    sendToMap({
      type: 'SET_RISK',
      risk
    })
  }

  function handleFinishPolygon() {
    sendToMap({
      type: 'FINISH_POLYGON'
    })
    
  }

  function handleClearPolygon() {
    sendToMap({
      type: 'CLEAR_CURRENT_POLYGON'
    })
  }
    const load = useCallback(async () => {
    try {
      const [requestsResponse, zonesResponse] = await Promise.all([
        api.get('/pedidos'),
        api.get('/zonas-risco'),
      ])
      setRequests(requestsResponse.data)
      setZones(zonesResponse.data)
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar o mapa.')
    }
  }, [])
    useFocusEffect(useCallback(() => { void load() }, [load]))

  function handleMapMessage(event: any) {
    const data = JSON.parse(event.nativeEvent.data)

    if (data.type === 'POLYGON_CREATED') {
      Alert.alert(
        'Zona criada',
        `Risco: ${data.risk}\nPontos: ${data.coordinates.length}`
      )

    }

    if (data.type === 'POLYGON_ERROR') {
      Alert.alert('Atenção', data.message)
    }
  }

  const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">

      <link 
        rel="stylesheet" 
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" 
      />

      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

      <style>
        html, body, #map {
          height: 100%;
          margin: 0;
        }

        .zone-message {
          position: absolute;
          top: 20px;
          left: 20px;
          right: 20px;
          background: #111827;
          color: white;
          padding: 12px;
          border-radius: 8px;
          font-family: Arial;
          font-size: 14px;
          text-align: center;
          z-index: 1000;
          display: none;
        }
      </style>
    </head>

    <body>
      <div id="map"></div>

      <div id="zoneMessage" class="zone-message">
        Toque no mapa para adicionar pontos ao polígono
      </div>

      <script>
        const requests = ${markers};



        let zoneMode = false;
        let selectedRisk = 'ALTA';

        let polygonPoints = [];
        let pointMarkers = [];
        let temporaryLine = null;

        function getRiskColor(risk) {
          if (risk === 'CRITICA') return 'red';
          if (risk === 'ALTA') return 'orange';
          if (risk === 'MEDIA') return 'gold';
          if (risk === 'BAIXA') return 'green';
          return 'blue';
        }

        function updateZoneMessage() {
          const message = document.getElementById('zoneMessage');
          message.style.display = zoneMode ? 'block' : 'none';
        }

        const center = requests.length
          ? [requests[0].latitude, requests[0].longitude]
          : [-29.7604, -51.1472];

        const map = L.map('map').setView(center, 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19
        }).addTo(map);

        requests.forEach(item => {
          L.marker([item.latitude, item.longitude])
            .addTo(map)
            .bindPopup(
              '<b>' + item.title + '</b><br>' +
              'Categoria: ' + item.category + '<br>' +
              'Status: ' + item.status + '<br>' +
              'Prioridade do pedido: ' + item.priority
            );
        });

        function redrawTemporaryLine() {
          if (temporaryLine) {
            map.removeLayer(temporaryLine);
          }

          if (polygonPoints.length >= 2) {
            temporaryLine = L.polyline(polygonPoints, {
              color: getRiskColor(selectedRisk),
              weight: 3,
              dashArray: '6, 6'
            }).addTo(map);
          }
        }

        function addPolygonPoint(lat, lng) {
          polygonPoints.push([lat, lng]);

          const marker = L.circleMarker([lat, lng], {
            radius: 6,
            color: getRiskColor(selectedRisk),
            fillColor: getRiskColor(selectedRisk),
            fillOpacity: 1
          }).addTo(map);

          pointMarkers.push(marker);
          redrawTemporaryLine();
        }

        function finishPolygon() {
          if (polygonPoints.length < 3) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'POLYGON_ERROR',
              message: 'Selecione pelo menos 3 pontos para criar uma zona.'
            }));
            return;
          }

          const color = getRiskColor(selectedRisk);

          L.polygon(polygonPoints, {
            color: color,
            fillColor: color,
            fillOpacity: 0.30,
            weight: 3
          })
          .addTo(map)
          .bindPopup(
            '<b>Zona de risco</b><br>' +
            'Risco: ' + selectedRisk + '<br>' +
            'Pontos: ' + polygonPoints.length
          )
          .openPopup();

          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'POLYGON_CREATED',
            risk: selectedRisk,
            coordinates: polygonPoints
          }));

          clearCurrentDrawing();
        }

        function clearCurrentDrawing() {
          polygonPoints = [];

          pointMarkers.forEach(marker => {
            map.removeLayer(marker);
          });

          pointMarkers = [];

          if (temporaryLine) {
            map.removeLayer(temporaryLine);
            temporaryLine = null;
          }
        }

        map.on('click', function(event) {
          if (!zoneMode) return;

          addPolygonPoint(event.latlng.lat, event.latlng.lng);
        });

        function receiveMessage(event) {
          const data = JSON.parse(event.data);

          if (data.type === 'SET_ZONE_MODE') {
            zoneMode = data.active;
            selectedRisk = data.risk;
            updateZoneMessage();

            if (!zoneMode) {
              clearCurrentDrawing();
            }
          }

          if (data.type === 'SET_RISK') {
            selectedRisk = data.risk;
            redrawTemporaryLine();
          }

          if (data.type === 'FINISH_POLYGON') {
            finishPolygon();
          }

          if (data.type === 'CLEAR_CURRENT_POLYGON') {
            clearCurrentDrawing();
          }
        }

        document.addEventListener('message', receiveMessage);
        window.addEventListener('message', receiveMessage);
      </script>
    </body>
  </html>
  `

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          position: 'absolute',
          top: 40,
          left: 16,
          right: 16,
          zIndex: 10,
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          padding: 12,
          gap: 10,
          elevation: 4
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: '700' }}>
          Criar zona de risco
        </Text>

        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          {(['BAIXA', 'MEDIA', 'ALTA', 'CRITICA'] as RiskLevel[]).map(risk => (
            <Pressable
              key={risk}
              onPress={() => handleRiskChange(risk)}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 20,
                backgroundColor:
                  selectedRisk === risk ? '#111827' : '#E5E7EB'
              }}
            >
              <Text
                style={{
                  color: selectedRisk === risk ? '#FFFFFF' : '#111827',
                  fontWeight: '600'
                }}
              >
                {risk}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          onPress={handleCreateZone}
          style={{
            backgroundColor: zoneMode ? '#DC2626' : '#2563EB',
            padding: 12,
            borderRadius: 12,
            alignItems: 'center'
          }}
        >
          <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>
            {zoneMode ? 'Cancelar criação' : 'Criar zona'}
          </Text>
        </Pressable>

        {zoneMode && (
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Pressable
              onPress={handleFinishPolygon}
              style={{
                flex: 1,
                backgroundColor: '#16A34A',
                padding: 12,
                borderRadius: 12,
                alignItems: 'center'
              }}
            >
              <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>
                Finalizar
              </Text>
            </Pressable>

            <Pressable
              onPress={handleClearPolygon}
              style={{
                flex: 1,
                backgroundColor: '#6B7280',
                padding: 12,
                borderRadius: 12,
                alignItems: 'center'
              }}
            >
              <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>
                Limpar
              </Text>
            </Pressable>
          </View>
        )}
      </View>

      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html }}
        onMessage={handleMapMessage}
      />
    </View>
  )
}