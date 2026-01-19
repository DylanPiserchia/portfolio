# Sistema de Gamificación - Portfolio

## ✨ Resumen Implementado

Se ha implementado un **sistema completo de niveles y XP estilo videojuego** en tu portfolio estático. El progreso se persiste en `localStorage` y los usuarios ganará XP al visitar nuevas páginas.

---

## 📋 Archivos Creados/Modificados

### 1. **css/level-system.css** ✅ (NUEVO)
- **Estilos ciberpunk/espaciales** para el sistema de gamificación
- **Badge de Nivel**: Circular con gradiente cyan-azul, pulsación luminosa
- **Barra de XP**: Efecto shimmer y brillo animado
- **Notificaciones Flotantes**: Animaciones de entrada/salida, efectos pop-in
- **Responsive**: Adaptado para mobile (cambia a layout vertical)

**Características CSS:**
- `pulse-ring`: Animación del aura del badge
- `shine`: Efecto de brillo en la barra
- `shimmer`: Destello continuo de la barra de XP
- `slideIn/slideOut`: Animaciones de notificación
- `popIn`: Animación del ícono de notificación
- `bounce`: Animación del ícono de Level Up

### 2. **js/navbar.js** ✅ (MODIFICADO)
Integración completa del sistema de gamificación:

#### Configuración Global:
```javascript
const LEVEL_CONFIG = {
    xpPerPage: 25,      // XP por visitar nueva página
    baseXP: 100,        // XP base para el cálculo de niveles
    storageKey: 'portfolio_data'
};
```

#### Métodos Nuevos Agregados:

| Método | Descripción |
|--------|-------------|
| `loadProgress()` | Carga datos desde localStorage al iniciar |
| `saveProgress()` | Guarda stats en localStorage |
| `getXPForLevel(level)` | Calcula XP necesario (fórmula: `level * 100`) |
| `addXP(amount)` | Suma XP y maneja subidas de nivel |
| `showXPNotification(amount)` | Muestra notificación de XP ganado |
| `showLevelUpNotification(level)` | Muestra notificación de Level Up |
| `updateLevelUI()` | Actualiza badge, barra y valores en tiempo real |
| `checkPageExperience()` | Detecta si es primera visita y otorga XP |

#### Flujo de Datos:
```
Usuario entra a página
    ↓
checkPageExperience() verifica si es nueva página
    ↓
Si es primera vez → addXP(25)
    ↓
Verificar si sube de nivel
    ↓
updateLevelUI() actualiza display
    ↓
saveProgress() persiste en localStorage
```

### 3. **Archivos HTML Actualizados** ✅
Se agregó `<link rel="stylesheet" href="../css/level-system.css">` en:
- `pages/index.html`
- `pages/about.html`
- `pages/star-trek-infinite.html`
- `pages/project-shelter.html`

---

## 🎮 Sistema de Progresión

### Fórmula de Niveles
```
XP necesario para siguiente nivel = nivel_actual × 100

Ejemplo:
- Nivel 1 → Nivel 2: Necesita 100 XP
- Nivel 2 → Nivel 3: Necesita 200 XP
- Nivel 3 → Nivel 4: Necesita 300 XP
```

### Ganancias de XP
- **Primera visita a cualquier página**: +25 XP
- **Re-visita a página conocida**: No da XP (evita spam)
- **Historial rastreado**: Se guarda array de páginas visitadas

### Persistencia
- **Storage Key**: `portfolio_data` en localStorage
- **Datos guardados**:
  ```javascript
  {
    xp: 0,              // XP actual en el nivel
    level: 1,           // Nivel alcanzado
    visitedPages: []    // Array de páginas visitadas
  }
  ```

---

## 🎨 Componentes Visuales

### Level Badge
```
┌─────────┐
│    3    │  ← Nivel actual
└─────────┘
  ✨ Aura pulsante
  🔵 Gradiente cyan-azul
  💫 Texto brillante
```

### XP Bar
```
XP        25/100  ← XP actual / Necesario
▓▓▓▓░░░░░░       ← Barra con efecto shimmer
```

### Notificaciones

**XP Ganado:**
- Ícono: ⚡
- Color: Cyan
- Duración: 3 segundos
- Animación: Slide desde derecha

**Level Up:**
- Ícono: ⭐ (bounce animation)
- Color: Verde neón
- Duración: 4 segundos
- Animación: Slide desde derecha con mayor énfasis

---

## 📱 Responsividad

### Desktop (≥768px)
- Level container **horizontal** en navbar
- Posicionado a la **derecha** (con `margin-left: auto`)
- Notificaciones en **esquina superior derecha**

### Mobile (<768px)
- Level container **vertical** en navbar
- Ancho completo adaptado
- Notificaciones en **esquina inferior** (mejor visibilidad)
- Animaciones optimizadas para pantalla pequeña

---

## 🚀 Cómo Usar

### Para Usuarios
1. Abre cualquier página del portfolio
2. Recibirás **+25 XP** en tu primera visita
3. Observa las **notificaciones** de progreso
4. El progreso se **persiste automáticamente** en tu navegador
5. Sube de nivel ganando XP en nuevas páginas

### Para Desarrolladores

#### Agregar XP Manual (Consola Navegador)
```javascript
// Si tienes acceso a la instancia de Navbar
const navbar = new Navbar();
navbar.addXP(50);  // Agregar 50 XP
```

#### Modificar Configuración
Edita `js/navbar.js`:
```javascript
const LEVEL_CONFIG = {
    xpPerPage: 50,      // Cambiar XP por página
    baseXP: 100,        // Cambiar base de cálculo de niveles
    storageKey: 'portfolio_data'
};
```

#### Limpiar Progreso (Consola)
```javascript
localStorage.removeItem('portfolio_data');
location.reload();
```

---

## ✅ Verificación de Funcionamiento

### Checklist de Prueba:
- [ ] Navega a `pages/index.html` → Deberías ver +25 XP
- [ ] Abre otra página (about, star-trek, etc.) → Otro +25 XP
- [ ] Vuelve a `index.html` → No da XP nuevamente (página visitada)
- [ ] Badge muestra nivel actual (debería ser 1)
- [ ] XP bar se llena según progreso
- [ ] Notificaciones aparecen en esquina derecha/inferior
- [ ] Al alcanzar 100 XP → Subes a Nivel 2
- [ ] Recarga página → Progreso persiste
- [ ] Abre DevTools → `localStorage.portfolio_data` contiene JSON con datos

### URLs de Prueba (desde raíz del servidor):
```
/pages/index.html          → Home (primera vista: +25 XP)
/pages/about.html          → About (primera vista: +25 XP)
/pages/star-trek-infinite.html → Star Trek (primera vista: +25 XP)
/pages/project-shelter.html    → Project Shelter (primera vista: +25 XP)
```

---

## 🎯 Rutas Funcionan Correctamente

### ✅ Rutas CSS
- Desde `pages/*.html`: `../css/level-system.css` ✓
- Importadas en todos los archivos HTML

### ✅ Rutas JS
- Desde `pages/*.html`: `../js/navbar.js` ✓
- Script cargado correctamente en todos los HTML

### ✅ Assets
- Imágenes: `../assets/img/*` ✓
- Favicon: `../` (si aplica) ✓

---

## 🔧 Detalles Técnicos

### Detección de Ubicación
El navbar detecta automáticamente si está en `/pages/` para ajustar las rutas:
```javascript
this.isInPages = pathname.includes('/pages/');
```

### Prevención de Spam
Se valida que la página no esté en el historial:
```javascript
if (!userStats.visitedPages.includes(currentPage)) {
    // Dar XP solo una vez por página
}
```

### Animaciones Suave
Se usa `cubic-bezier(0.34, 1.56, 0.64, 1)` para efecto "bounce" natural en transiciones.

---

## 📊 Datos Almacenados en localStorage

```json
{
  "xp": 50,
  "level": 1,
  "visitedPages": ["index.html", "about.html"]
}
```

---

## 🎉 ¡Sistema Completamente Implementado!

El sistema está listo para usar. Los usuarios podrán:
- ✅ Ganador XP por explorar
- ✅ Subir de nivel
- ✅ Ver progreso en tiempo real
- ✅ Persistir datos entre sesiones
- ✅ Disfrutar de notificaciones visuales atractivas

**Bienvenido al futuro del portfolio gamificado** 🚀✨
