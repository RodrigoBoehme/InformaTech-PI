import { useCallback, useMemo, useRef, useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { WebView } from "react-native-webview";
import axios from "axios";

import { Input } from "@/components/Input";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/services/api";
import { NivelInundacao, Pedido, ZonaRiscoV2 } from "@/types";
import { colors } from "@/constants/theme";


const emptyForm = {
  name: "",
  description: "",
  floodLevel: "ALTO" as NivelInundacao,
  coords: "", //Alterar no zod para ser uma string com todos os pontos
  riverLevelMeters: "0",
};

type RiskLevel = "BAIXO" | "MODERADO" | "ALTO" | "CRITICO";
const levels: Array<{ label: string; value: NivelInundacao }> = [
  { label: 'BAIXO', value: 'BAIXO' },
  { label: 'MODERADO', value: 'MODERADO' },
  { label: 'ALTO', value: 'ALTO' },
  { label: 'CRÍTICO', value: 'CRITICO' },
]

export default function MapScreen() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const [requests, setRequests] = useState<Pedido[]>([]);
  const [zones, setZones] = useState<ZonaRiscoV2[]>([]);
  const [selected, setSelected] = useState<ZonaRiscoV2 | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const web = useRef<WebView>(null);
  const [zoneMode, setZoneMode] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState<RiskLevel>("ALTO");
  const [isFormsOpen,setIsFormsOpen]=useState(true)

  const load = useCallback(async () => {
    try {
      const [requestsResponse,zonesResponse ] = await Promise.all([//add zonesResponse back after getting it right
        api.get("/pedidos"),
        api.get("/zonas-risco-v2"),
      ]);
      setRequests(requestsResponse.data);
      setZones(zonesResponse.data);
      
    } catch {
      Alert.alert("Erro", "Não foi possível carregar o mapa.");
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  function sendToMap(data: object) {
    web.current?.postMessage(JSON.stringify(data));
  }

  function handleHidingForms(){
    const newValue=!isFormsOpen
    setIsFormsOpen(newValue)
  }

  function handleCreateZone() {
    const newValue = !zoneMode;
    setZoneMode(newValue);

    sendToMap({
      type: "SET_ZONE_MODE",
      active: newValue,
      risk: selectedRisk,
    });
  }

  function resetForm() {
    setSelected(null);
    setDrawing(false);
    setForm(emptyForm);
    sendToMap({ type: "CANCEL_DRAW" });
    handleRiskChange(form.floodLevel)
    
  }

  async function save() {
    const riverLevel = Number(form.riverLevelMeters.replace(",", "."));

    if (form.name.trim().length < 3) {
      return Alert.alert(
        "Nome obrigatório",
        "Informe um nome com pelo menos 3 caracteres.",
      );
    }
    if (!form.coords) {
      return Alert.alert(
        "Localização obrigatória",
        "Clique no mapa para definir a zona.",
      );
    }
    if (!Number.isFinite(riverLevel) || riverLevel < 0 || riverLevel > 100) {
      return Alert.alert(
        "Nível do rio inválido",
        "Informe um nível entre 0 e 100 metros.",
      );
    }
    

    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      floodLevel: form.floodLevel,
      coords: form.coords,
      riverLevelMeters: riverLevel,
      active: true,
    };

    try {
      setSaving(true);
      if (selected) await api.put(`/zonas-risco-v2/${selected.id}`, payload);
      else await api.post("/zonas-risco-v2", payload);
      Alert.alert(
        "Sucesso",
        selected
          ? "Zona atualizada com sucesso."
          : "Zona salva no banco com sucesso.",
      );
      resetForm();
      await load();
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message ||
          error.response?.data?.details?.fieldErrors?.riverLevelMeters?.[0]
        : undefined;
      Alert.alert(
        "Erro ao salvar",
        message || "Não foi possível salvar a zona de risco.",
      );
    } finally {
      setSaving(false);
    }
  }

  function remove() {
    if (!selected) return;
    Alert.alert("Excluir zona", "Confirma a exclusão?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/zonas-risco-v2/${selected.id}`);
            resetForm();
            await load();
          } catch {
            Alert.alert("Erro", "Não foi possível excluir a zona.");
          }
        },
      },
    ]);
  }

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  function handleMapMessage(event: any) {
    const data = JSON.parse(event.nativeEvent.data);

    if (data.type === "POLYGON_CREATED") {
      form.coords=JSON.stringify(data.coordinates)

      Alert.alert(
        "Zona criada",
        `Risco: ${data.risk}\nPontos: ${data.coordinates.length}`,
      );
    }

    if (data.type === "POLYGON_ERROR") {
      Alert.alert("Atenção", data.message);
    }

    if (data.type === 'ZONE_SELECTED' && isAdmin) {
        const zone = zones.find(item => item.id === data.id)
        if (zone) {
          setSelected(zone)
          setForm({
            name: zone.name,
            description: zone.description || '',
            floodLevel: zone.floodLevel,
            coords: zone.coords,
            riverLevelMeters: String(zone.riverLevelMeters ?? 0),
          })
        }
      }
  }

  function handleRiskChange(risk: RiskLevel) {
    setSelectedRisk(risk);

    sendToMap({
      type: "SET_RISK",
      risk,
    });
  }

  function handleFinishPolygon() {
    setZoneMode(false)
    sendToMap({
      type: "FINISH_POLYGON",
    });
  }

  function handleClearPolygon() {
    sendToMap({
      type: "CLEAR_CURRENT_POLYGON",
    });
  }

  const markers = JSON.stringify(
    requests.map((request) => ({
      ...request,
      latitude: Number(request.latitude),
      longitude: Number(request.longitude),
    })),
  );
  const zonesMap=JSON.stringify(
    zones.map((zone)=>({
      ...zone,
      coords:String(zone.coords)
    }))
  )

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

      

      <script>
        const requests = ${markers};
        const zones=${zonesMap};

        


        let zoneMode = false;
        let selectedRisk = 'BAIXO';

        let polygonPoints = [];
        let pointMarkers = [];
        let temporaryLine = null;

        function getRiskColor(risk) {
          if (risk === 'CRITICO') return '#1a1919';
          if (risk === 'ALTO') return '#da3232';
          if (risk === 'MODERADO') return '#eab308';
          if (risk === 'BAIXO') return '#16a34a';
          return 'blue';
        }

        const color=l=>l==='CRITICO'?'#1a1919':l==='ALTO'?'#da3232':l==='MODERADO'?'#eab308':'#16a34a';




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

        zones.filter(z=>z.active!==false).forEach(z=>{
        try{
          var latlngs=JSON.parse(z.coords)
          const polygon=L.polygon(latlngs,
                {
                color:color(z.floodLevel),
                fillColor:color(z.floodLevel),
                fillOpacity:.28,weight:3
                },
              )
              .addTo(map)
              .bindPopup(
                '<b>'+z.name+'</b><br>Nível de inundação: '+
                z.floodLevel+'<br>Nível do rio: '+
                Number(z.riverLevelMeters||0).toFixed(2)+
                ' m<br>'
              );
            polygon.on('click',()=>window.ReactNativeWebView.postMessage(JSON.stringify({type:'ZONE_SELECTED',id:z.id})))
        }catch(e){
          window.ReactNativeWebView.postMessage(JSON.stringify(
            {type:"POLYGON_ERROR",message:z.coords+" "+e.message}
          ))
        }   
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
          if (polygonPoints.length < 3||polygonPoints.length>6) {
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
  `;

  return (
    <View style={{ flex: 1 }}>
      {!isAdmin && <View style={{ padding: 10, backgroundColor: '#fff',paddingTop:40,borderRadius:10 }}><Text style={{ fontWeight: '800' }}>Mapa de pedidos e zonas de risco</Text><Text style={{ color: '#66778A' }}>As áreas coloridas indicam o nível estimado de inundação.</Text></View>}
      {isAdmin && (
      <View
        style={{
          maxHeight: 350,//alterar pra sla, 400 dps
          position: "absolute",
          top: 40,
          left: 16,
          right: 16,
          zIndex: 10,
          backgroundColor: "#FFFFFF",
          borderRadius: 16,
          padding: 12,
          gap: 10,
          elevation: 4,
        }}
      >
        <View style={{ backgroundColor: "#fff", padding: 7, paddingTop: 5 }}>
          <ScrollView
            contentContainerStyle={{ gap: 8 }}
            keyboardShouldPersistTaps="handled"
          >
            {isFormsOpen&& <View style={{gap:8}}>
            <Text style={{ fontSize: 17, fontWeight: "800" }}>
              Administração das zonas de risco
            </Text>
            <Text style={{ color: "#66778A" }}>
              Informe os dados, escolha o raio e toque no mapa para posicionar a
              zona.
            </Text>

            <Input
              placeholder="Nome da zona"
              value={form.name}
              onChangeText={(name) =>
                setForm((current) => ({ ...current, name }))
              }
            />
            <Input
              placeholder="Descrição opcional"
              value={form.description}
              onChangeText={(description) =>
                setForm((current) => ({ ...current, description }))
              }
            />
            <View style={{ flexDirection: "row", gap: 8 }}>
              <Input
                style={{
                  flex: 1,
                  backgroundColor: "#fff",
                  borderWidth: 1,
                  borderColor: "#d1d5db",
                  borderRadius: 12,
                  padding: 14,
                }}
                keyboardType="decimal-pad"
                placeholder="Nível do rio (m)"
                value={form.riverLevelMeters}
                onChangeText={(riverLevelMeters) =>
                  setForm((current) => ({ ...current, riverLevelMeters }))
                }
              />
            </View>


            <Text style={{ fontWeight: "700" }}>Nível de inundação</Text>
          </View>}
            
          <Pressable onPress={handleHidingForms} style={
                {
                    borderColor:colors.muted,
                    alignSelf:"center",
                    backgroundColor:"#fff",
                    borderRadius:20,
                    flex:1,
                    borderWidth:1,
                    padding:14,
                }
            }>
            <Text>
              {isFormsOpen ? "Esconder Formulario":"Mostrar Formulario"}
            </Text>
            
          </Pressable>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <Pressable
                disabled={saving}
                onPress={save}
                style={{
                  flex: 1,
                  padding: 11,
                  borderRadius: 10,
                  backgroundColor: saving ? "#6b7280" : "#16a34a",
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    textAlign: "center",
                    fontWeight: "800",
                  }}
                >
                  {saving ? "Salvando..." : selected ? "Atualizar" : "Salvar"}
                </Text>
              </Pressable>
              {selected && (
                <Pressable
                  onPress={remove}
                  style={{
                    padding: 11,
                    borderRadius: 10,
                    backgroundColor: "#dc2626",
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "800" }}>
                    Excluir
                  </Text>
                </Pressable>
              )}{selected &&(
                <Pressable
                 onPress={resetForm}
                 style={{
                    padding: 11,
                    borderRadius: 10,
                    backgroundColor: "#dee042",
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "800" }}>Limpar</Text>
                </Pressable>
              )

              }
            </View>
            <Text style={{ fontSize: 16, fontWeight: "700" }}>
              Criar zona de risco
            </Text>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                {levels.map(level => (
                  <Pressable key={level.value} onPress={() => {handleRiskChange(level.value);setForm(current => ({ ...current, floodLevel: level.value }))}} style={{ padding: 9, borderRadius: 18, backgroundColor: form.floodLevel === level.value ? '#111827' : '#e5e7eb' }}>
                    <Text style={{ color: form.floodLevel === level.value ? '#fff' : '#111827', fontWeight: '700' }}>{level.label}</Text>
                  </Pressable>
                ))}
            </View>

            <Pressable
              onPress={handleCreateZone}
              style={{
                backgroundColor: zoneMode ? "#DC2626" : "#2563EB",
                padding: 12,
                borderRadius: 12,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#FFFFFF", fontWeight: "700" }}>
                {zoneMode ? "Cancelar criação" : "Criar zona"}
              </Text>
            </Pressable>

            {zoneMode && (
              <View style={{ flexDirection: "row", gap: 8 }}>
                <Pressable
                  onPress={handleFinishPolygon}
                  style={{
                    flex: 1,
                    backgroundColor: "#16A34A",
                    padding: 12,
                    borderRadius: 12,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "#FFFFFF", fontWeight: "700" }}>
                    Finalizar
                  </Text>
                </Pressable>

                <Pressable
                  onPress={handleClearPolygon}
                  style={{
                    flex: 1,
                    backgroundColor: "#6B7280",
                    padding: 12,
                    borderRadius: 12,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "#FFFFFF", fontWeight: "700" }}>
                    Limpar
                  </Text>
                </Pressable>
              </View>
            )}
          </ScrollView>
        </View>
      </View>)}
      <WebView
        ref={web}
        originWhitelist={["*"]}
        source={{ html }}
        onMessage={handleMapMessage}
      />
    </View>
  );
}
