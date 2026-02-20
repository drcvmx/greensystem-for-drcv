# Green Alchemy | SGI Demo

Este proyecto es una demostración técnica del **Sistema de Gestión de Inventarios (SGI)** para Green Alchemy. 

> [!IMPORTANT]
> **ESTA ES UNA VERSIÓN DEMO:** El sistema funciona de manera autónoma en el navegador. No utiliza bases de datos externas (como Supabase) y **no cuenta con datos oficiales**. El objetivo principal es mostrar el flujo de trabajo, la interfaz y las capacidades funcionales del sitio.

## Funcionamiento del Sistema

El SGI está diseñado para gestionar el flujo completo de pedidos, desde la creación hasta la entrega, integrando diferentes roles operativos:

- **Vendedora**: Creación de pedidos, gestión de clientes y registro de pagos.
- **Tesorería**: Validación de comprobantes de pago y conciliación.
- **Bodega**: Preparación de pedidos, gestión de stock y asignación de rutas.
- **Driver**: Seguimiento de rutas, confirmación de entregas y carga de evidencias.
- **Admin/Consultor**: Monitoreo de KPIs, estadísticas de venta y pulso de almacenes en tiempo real.

### Gestión de Datos Local
Para esta demo, utilizamos `localStorage` a través de un motor personalizado (`demoStorage`). Esto permite que:
- Los cambios realizados (crear pedidos, validar pagos, etc.) persistan en tu navegador.
- El sistema sea totalmente funcional sin necesidad de una conexión a internet o servidor externo.
- Se pueda reiniciar el estado de la demo en cualquier momento limpiando el caché del navegador.

## Tecnologías Utilizadas

- **Fronend**: React 18 con TypeScript y Vite.
- **UI Components**: shadcn/ui con Tailwind CSS.
- **Estado/Datos**: TanStack Query para gestión de datos asíncronos simulados.
- **Iconografía**: Lucide React.

## Instalación Local

Si deseas ejecutar esta demo en tu entorno local:

```sh
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev
```

Abra [http://localhost:8080](http://localhost:8080) para ver el resultado.

---
© 2026 Green Alchemy. Desarrollado con el objetivo de demostrar la operatividad del sistema SGI.
