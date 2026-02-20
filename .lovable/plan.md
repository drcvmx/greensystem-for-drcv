
# Plan: Optimización de Rendimiento del Sistema

## Problema Diagnosticado

El sistema se "traba" en todos los roles debido a **sobrecarga de consultas y suscripciones en tiempo real**. He identificado los siguientes cuellos de botella:

### Causa Raíz 1: Cascada de Re-fetch en Tiempo Real
Cada vez que **cualquier pedido cambia**, TODOS los clientes conectados re-descargan TODA la lista de pedidos con 6 joins (customers, stores, warehouses, drivers, order_payments, order_items).

Con 31 usuarios operando simultáneamente, si hay 10 pedidos en una hora:
- 10 cambios × 31 usuarios = **310 consultas pesadas por hora** (mínimo)
- Cada consulta trae múltiples tablas relacionadas

### Causa Raíz 2: Múltiples Suscripciones Redundantes
Cada dashboard crea **2-3 canales de realtime** independientes:
- TesoreroDashboard: 2 hooks useOrders (pending + validated)
- BodegaDashboard: 2 hooks useOrders (pending + in_transit)
- DriverDashboard: 3 queries separadas
- SuperAdminDashboard: useAdminStats con recálculo masivo

### Causa Raíz 3: Cálculos Pesados en Frontend
El hook `useAdminStats` recalcula estadísticas complejas (promedios, sumas, filtros) en el navegador cada vez que hay un cambio, bloqueando el hilo principal.

---

## Solución Propuesta

### Fase 1: Optimizar Suscripciones Realtime (Impacto Alto)

**Cambio A: Debounce en actualizaciones**
Agregar un delay de 500ms para agrupar múltiples cambios en una sola recarga.

```text
Archivo: src/hooks/useOrders.ts

Antes:
  .on('postgres_changes', ..., () => { fetchOrders(); })

Despues:
  .on('postgres_changes', ..., () => { 
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(fetchOrders, 500);
  })
```

**Cambio B: Canal único compartido**
Usar un solo canal de realtime por sesión en lugar de múltiples canales por componente.

```text
Archivo: src/hooks/useOrders.ts

Antes:
  const channel = supabase.channel('orders-changes')

Despues:
  // Usar channel ID basado en los filtros para evitar duplicados
  const channelId = `orders-${warehouseId}-${storeId}-${status}`;
```

---

### Fase 2: Reducir Carga de Datos (Impacto Alto)

**Cambio C: Limitar campos en consultas**
No traer todas las columnas de todas las tablas relacionadas.

```text
Archivo: src/hooks/useOrders.ts

Antes:
  customer:customers(*)

Despues:
  customer:customers(id, name, customer_code, phone)
```

**Cambio D: Paginar resultados**
Limitar a los últimos 50 pedidos activos en lugar de cargar todo.

```text
Archivo: src/hooks/useOrders.ts

Agregar: .limit(50)
```

---

### Fase 3: Mover Cálculos al Backend (Impacto Medio)

**Cambio E: Crear función SQL para estadísticas**
Mover los cálculos de `useAdminStats` a una función de base de datos que retorne estadísticas pre-calculadas.

```text
Nueva función SQL: get_dashboard_stats(warehouse_id, date_start, date_end)

Retorna:
- orders_by_status: JSON con conteos
- revenue_by_payment: JSON con totales
- avg_times: JSON con promedios

Esto elimina el recálculo en frontend de ~200 líneas de JavaScript.
```

---

### Fase 4: Optimizar Hooks de Roles Específicos

**Cambio F: Hook unificado para Bodega**
Combinar las 2 llamadas de BodegaDashboard en una sola consulta.

```text
Antes:
  useOrders({ status: ['validated', 'in_preparation', ...] })  // Query 1
  useOrders({ status: 'in_transit' })                           // Query 2

Despues:
  useOrders({ status: ['validated', 'in_preparation', ..., 'in_transit'] })
  // Filtrar localmente
```

**Cambio G: Hook optimizado para Driver**
El DriverDashboard hace 3 queries separadas. Combinar en una.

```text
Antes: 3 queries (assigned, in_transit, count delivered)
Despues: 1 query con todos los estados + conteo local
```

---

## Archivos a Modificar

| Archivo | Cambios |
|---------|---------|
| `src/hooks/useOrders.ts` | Debounce, canal único, campos limitados, paginación |
| `src/hooks/useDriverOrders.ts` | Combinar queries, debounce |
| `src/hooks/useAdminStats.ts` | Usar función SQL en lugar de cálculos locales |
| `src/components/dashboard/BodegaDashboard.tsx` | Un solo hook useOrders |
| `src/components/dashboard/TesoreroDashboard.tsx` | Combinar queries |
| `supabase/migrations/` | Nueva función `get_dashboard_stats` |

---

## Impacto Esperado

| Métrica | Antes | Después |
|---------|-------|---------|
| Consultas por cambio de pedido | 31+ (todos los clientes) | 1 (cliente afectado) |
| Datos transferidos por refresh | ~500KB (6 joins completos) | ~50KB (campos selectos) |
| Tiempo de recálculo en admin | ~2s (bloquea UI) | ~50ms (desde SQL) |
| Canales realtime por sesión | 2-4 | 1 |

---

## Orden de Implementación

1. **Debounce en realtime** (solución inmediata, 5 min)
2. **Limitar campos en SELECT** (rápido, 10 min)
3. **Combinar hooks en dashboards** (15 min)
4. **Función SQL para estadísticas** (30 min)
5. **Paginación** (10 min)

---

## Consideraciones

- Los cambios son retrocompatibles
- No afectan la lógica de negocio existente
- El debounce de 500ms es imperceptible para el usuario
- La función SQL puede ejecutarse en paralelo mientras se migra
