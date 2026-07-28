import { useCallback, useMemo, useRef, useState } from 'react'
import { Alert, Pressable, ScrollView, Text, View } from 'react-native'
import { useFocusEffect } from 'expo-router'
import { WebView } from 'react-native-webview'
import axios from 'axios'

import { Input } from '@/components/Input'
import { useAuth } from '@/contexts/AuthContext'
import { api } from '@/services/api'
import { NivelInundacao, Pedido, ZonaRisco } from '@/types'

const levels: Array<{ label: string; value: NivelInundacao }> = [
  { label: 'BAIXO', value: 'BAIXO' },
  { label: 'MODERADO', value: 'MODERADO' },
  { label: 'ALTO', value: 'ALTO' },
  { label: 'CRÍTICO', value: 'CRITICO' },
]

const emptyForm = {
  name: '',
  description: '',
  floodLevel: 'ALTO' as NivelInundacao,
  latitude: 0,
  longitude: 0,
  radiusMeters: '100',
  riverLevelMeters: '0',
}

export default function MapScreen() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'
  const [requests, setRequests] = useState<Pedido[]>([])
  const [zones, setZones] = useState<ZonaRisco[]>([])
  const [selected, setSelected] = useState<ZonaRisco | null>(null)
  const [drawing, setDrawing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const web = useRef<WebView>(null)

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

  function send(data: object) {
    web.current?.postMessage(JSON.stringify(data))
  }

  function startDrawing() {
    setSelected(null)
    setDrawing(true)
    setForm(current => ({ ...current, latitude: 0, longitude: 0 }))
    send({ type: 'START_DRAW', radiusMeters: Number(form.radiusMeters) || 100 })
  }

  function cancelDrawing() {
    setDrawing(false)
    send({ type: 'CANCEL_DRAW' })
  }

  function resetForm() {
    setSelected(null)
    setDrawing(false)
    setForm(emptyForm)
    send({ type: 'CANCEL_DRAW' })
  }

  async function save() {
    const radius = Number(form.radiusMeters.replace(',', '.'))
    const riverLevel = Number(form.riverLevelMeters.replace(',', '.'))

    if (form.name.trim().length < 3) {
      return Alert.alert('Nome obrigatório', 'Informe um nome com pelo menos 3 caracteres.')
    }
    if (!form.latitude || !form.longitude) {
      return Alert.alert('Localização obrigatória', 'Clique no mapa para definir o centro da zona.')
    }
    if (!Number.isFinite(radius) || radius < 10 || radius > 10000) {
      return Alert.alert('Raio inválido', 'Informe um raio entre 10 e 10.000 metros.')
    }
    if (!Number.isFinite(riverLevel) || riverLevel < 0 || riverLevel > 100) {
      return Alert.alert('Nível do rio inválido', 'Informe um nível entre 0 e 100 metros.')
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      floodLevel: form.floodLevel,
      latitude: Number(form.latitude),
      longitude: Number(form.longitude),
      radiusMeters: Math.round(radius),
      riverLevelMeters: riverLevel,
      active: true,
    }

    try {
      setSaving(true)
      if (selected) await api.put(`/zonas-risco/${selected.id}`, payload)
      else await api.post('/zonas-risco', payload)
      Alert.alert('Sucesso', selected ? 'Zona atualizada com sucesso.' : 'Zona salva no banco com sucesso.')
      resetForm()
      await load()
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || error.response?.data?.details?.fieldErrors?.riverLevelMeters?.[0]
        : undefined
      Alert.alert('Erro ao salvar', message || 'Não foi possível salvar a zona de risco.')
    } finally {
      setSaving(false)
    }
  }

  function remove() {
    if (!selected) return
    Alert.alert('Excluir zona', 'Confirma a exclusão?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/zonas-risco/${selected.id}`)
            resetForm()
            await load()
          } catch {
            Alert.alert('Erro', 'Não foi possível excluir a zona.')
          }
        },
      },
    ])
  }

  function onMessage(event: any) {
    try {
      const data = JSON.parse(event.nativeEvent.data)
      if (data.type === 'POINT_SELECTED') {
        setForm(current => ({
          ...current,
          latitude: Number(data.latitude),
          longitude: Number(data.longitude),
          radiusMeters: String(Math.max(10, Math.round(Number(data.radiusMeters) || Number(current.radiusMeters) || 100))),
        }))
        setDrawing(false)
      }
      if (data.type === 'CIRCLE_DRAWN') {
        setForm(current => ({
          ...current,
          latitude: Number(data.latitude),
          longitude: Number(data.longitude),
          radiusMeters: String(Math.max(10, Math.round(Number(data.radiusMeters)))),
        }))
        setDrawing(false)
      }
      if (data.type === 'ZONE_SELECTED' && isAdmin) {
        const zone = zones.find(item => item.id === data.id)
        if (zone) {
          setSelected(zone)
          setForm({
            name: zone.name,
            description: zone.description || '',
            floodLevel: zone.floodLevel,
            latitude: Number(zone.latitude),
            longitude: Number(zone.longitude),
            radiusMeters: String(zone.radiusMeters),
            riverLevelMeters: String(zone.riverLevelMeters ?? 0),
          })
        }
      }
    } catch {
      // Ignora mensagens inválidas do WebView.
    }
  }

  const html = useMemo(() => `<!doctype html>
<html><head><meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>html,body,#map{height:100%;margin:0}.hint{position:absolute;top:12px;left:12px;right:12px;z-index:999;background:#111827;color:#fff;padding:10px;border-radius:10px;text-align:center;font-family:Arial;display:none}</style>
</head><body><div id="map"></div><div id="hint" class="hint">Toque para posicionar ou clique e arraste para definir o raio</div><script>
const requests=${JSON.stringify(requests)};
const zones=${JSON.stringify(zones)};
let drawing=false, center=null, preview=null, defaultRadius=100;
const color=l=>l==='CRITICO'?'#b91c1c':l==='ALTO'?'#f97316':l==='MODERADO'?'#eab308':'#16a34a';
const map=L.map('map').setView(requests.length?[Number(requests[0].latitude),Number(requests[0].longitude)]:[-29.7604,-51.1472],12);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19}).addTo(map);
requests.forEach(r=>L.marker([Number(r.latitude),Number(r.longitude)]).addTo(map).bindPopup('<b>'+r.title+'</b><br>Categoria: '+r.category+'<br>Prioridade: '+r.priority));
zones.filter(z=>z.active!==false).forEach(z=>{const c=L.circle([Number(z.latitude),Number(z.longitude)],{radius:Number(z.radiusMeters),color:color(z.floodLevel),fillColor:color(z.floodLevel),fillOpacity:.28,weight:3}).addTo(map).bindPopup('<b>'+z.name+'</b><br>Nível de inundação: '+z.floodLevel+'<br>Nível do rio: '+Number(z.riverLevelMeters||0).toFixed(2)+' m<br>Raio: '+Math.round(Number(z.radiusMeters))+' m');c.on('click',()=>window.ReactNativeWebView.postMessage(JSON.stringify({type:'ZONE_SELECTED',id:z.id})))})
function receive(e){try{const d=JSON.parse(e.data);if(d.type==='START_DRAW'){drawing=true;defaultRadius=Number(d.radiusMeters)||100;document.getElementById('hint').style.display='block';map.dragging.disable()}if(d.type==='CANCEL_DRAW'){drawing=false;center=null;document.getElementById('hint').style.display='none';map.dragging.enable();if(preview){map.removeLayer(preview);preview=null}}}catch{}}
document.addEventListener('message',receive);window.addEventListener('message',receive);
map.on('mousedown',e=>{if(!drawing)return;center=e.latlng;if(preview)map.removeLayer(preview);preview=L.circle(center,{radius:defaultRadius,color:'#2563eb',fillOpacity:.2}).addTo(map)});
map.on('mousemove',e=>{if(!drawing||!center||!preview)return;preview.setRadius(Math.max(10,map.distance(center,e.latlng)))});
map.on('mouseup',e=>{if(!drawing||!center)return;const radius=Math.max(10,map.distance(center,e.latlng));drawing=false;map.dragging.enable();document.getElementById('hint').style.display='none';window.ReactNativeWebView.postMessage(JSON.stringify({type:'CIRCLE_DRAWN',latitude:center.lat,longitude:center.lng,radiusMeters:radius}));center=null});
map.on('click',e=>{if(!drawing||center)return;if(preview)map.removeLayer(preview);preview=L.circle(e.latlng,{radius:defaultRadius,color:'#2563eb',fillOpacity:.2}).addTo(map);drawing=false;map.dragging.enable();document.getElementById('hint').style.display='none';window.ReactNativeWebView.postMessage(JSON.stringify({type:'POINT_SELECTED',latitude:e.latlng.lat,longitude:e.latlng.lng,radiusMeters:defaultRadius}))});
</script></body></html>`, [requests, zones])

  return (
    <View style={{ flex: 1, backgroundColor: '#07111D' }}>
      {isAdmin && (
        <View style={{ maxHeight: 430, backgroundColor: '#fff', padding: 12 }}>
          <ScrollView contentContainerStyle={{ gap: 8 }} keyboardShouldPersistTaps="handled">
            <Text style={{ fontSize: 18, fontWeight: '800' }}>Administração das zonas de risco</Text>
            <Text style={{ color: '#66778A' }}>Informe os dados, escolha o raio e toque no mapa para posicionar a zona.</Text>
            <Input placeholder="Nome da zona" value={form.name} onChangeText={name => setForm(current => ({ ...current, name }))} />
            <Input placeholder="Descrição opcional" value={form.description} onChangeText={description => setForm(current => ({ ...current, description }))} />
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Input style={{ flex: 1, backgroundColor: '#fff', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 12, padding: 14 }} keyboardType="numeric" placeholder="Raio (m)" value={form.radiusMeters} onChangeText={radiusMeters => setForm(current => ({ ...current, radiusMeters }))} />
              <Input style={{ flex: 1, backgroundColor: '#fff', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 12, padding: 14 }} keyboardType="decimal-pad" placeholder="Nível do rio (m)" value={form.riverLevelMeters} onChangeText={riverLevelMeters => setForm(current => ({ ...current, riverLevelMeters }))} />
            </View>
            <Text style={{ fontWeight: '700' }}>Nível de inundação</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
              {levels.map(level => (
                <Pressable key={level.value} onPress={() => setForm(current => ({ ...current, floodLevel: level.value }))} style={{ padding: 9, borderRadius: 18, backgroundColor: form.floodLevel === level.value ? '#111827' : '#e5e7eb' }}>
                  <Text style={{ color: form.floodLevel === level.value ? '#fff' : '#111827', fontWeight: '700' }}>{level.label}</Text>
                </Pressable>
              ))}
            </View>
            <Text>Raio: {form.radiusMeters || '0'} m • Nível do rio: {form.riverLevelMeters || '0'} m</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Pressable onPress={drawing ? cancelDrawing : startDrawing} style={{ flex: 1, padding: 11, borderRadius: 10, backgroundColor: drawing ? '#6b7280' : '#2563eb' }}>
                <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '800' }}>{drawing ? 'Cancelar' : selected ? 'Reposicionar' : 'Posicionar no mapa'}</Text>
              </Pressable>
              <Pressable disabled={saving} onPress={save} style={{ flex: 1, padding: 11, borderRadius: 10, backgroundColor: saving ? '#6b7280' : '#16a34a' }}>
                <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '800' }}>{saving ? 'Salvando...' : selected ? 'Atualizar' : 'Salvar'}</Text>
              </Pressable>
              {selected && <Pressable onPress={remove} style={{ padding: 11, borderRadius: 10, backgroundColor: '#dc2626' }}><Text style={{ color: '#fff', fontWeight: '800' }}>Excluir</Text></Pressable>}
            </View>
          </ScrollView>
        </View>
      )}
      {!isAdmin && <View style={{ padding: 10, backgroundColor: '#fff' }}><Text style={{ fontWeight: '800' }}>Mapa de pedidos e zonas de risco</Text><Text style={{ color: '#66778A' }}>As áreas coloridas indicam o nível estimado de inundação.</Text></View>}
      <WebView ref={web} originWhitelist={['*']} source={{ html }} onMessage={onMessage} javaScriptEnabled domStorageEnabled />
    </View>
  )
}
