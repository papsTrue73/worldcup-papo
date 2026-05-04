# Centro de Mando del Mundial 2026 de Papo
## Guía de Instalación — Paso a Paso

---

### REQUISITOS PREVIOS

Necesitas **Node.js** instalado en tu Mac. Si no lo tienes:

1. Abre **Terminal** (búscalo en Spotlight con Cmd + Espacio → escribe "Terminal")
2. Pega esto y presiona Enter:

```bash
node --version
```

3. Si ves un número como `v18.17.0` o superior, ya lo tienes. Salta al paso siguiente.
4. Si dice "command not found", ve a **https://nodejs.org** → descarga la versión LTS → instala → reinicia Terminal.

---

### PASO 1: Descarga el proyecto

Descarga el archivo `worldcup2026-project.zip` que te di en Claude.

---

### PASO 2: Descomprime

Haz doble clic en el .zip. Se creará una carpeta llamada `worldcup-project`.

Muévela a donde quieras (ej. tu Escritorio o Documentos).

---

### PASO 3: Abre Terminal en esa carpeta

**Opción A (más fácil):**
1. Abre Terminal
2. Escribe `cd ` (con el espacio al final)
3. Arrastra la carpeta `worldcup-project` desde Finder hacia la ventana de Terminal
4. Presiona Enter

**Opción B:**
1. Abre Terminal
2. Escribe:
```bash
cd ~/Desktop/worldcup-project
```
(o la ruta donde la pusiste)

---

### PASO 4: Instala las dependencias

Pega esto en Terminal y presiona Enter:

```bash
npm install
```

Espera ~30 segundos. Verás texto corriendo. Cuando termine y vuelva a aparecer el cursor, está listo.

Si ves "vulnerabilities" al final, ignóralo — es normal.

---

### PASO 5: Ejecuta la app

Pega esto en Terminal:

```bash
npm run dev
```

Verás algo como:

```
  VITE v5.x.x  ready in 300ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
```

---

### PASO 6: Abre en el navegador

Abre Chrome (o cualquier navegador) y ve a:

```
http://localhost:5173
```

¡Ya está! La app corre en tu máquina. La API funciona desde aquí.

---

### PASO 7: Probar la API

1. En la app, busca la barra **"API EN VIVO"** en el header
2. Pega tu API key de football-data.org
3. Haz clic en **"Obtener Marcadores"**
4. Si dice "Sin resultados nuevos" → ¡la conexión funciona! (no hay datos aún porque el torneo inicia el 11 de junio)

---

### PARA DETENER LA APP

En Terminal, presiona **Ctrl + C**

### PARA VOLVER A INICIARLA

1. Abre Terminal
2. `cd` a la carpeta del proyecto
3. `npm run dev`
4. Abre `http://localhost:5173`

---

### PARA CURSOR

Si quieres abrir el proyecto en Cursor:

1. Abre Cursor
2. File → Open Folder → selecciona `worldcup-project`
3. Abre la Terminal integrada (Ctrl + `)
4. Escribe `npm run dev`
5. Haz clic en el link `http://localhost:5173` que aparece

---

### ESTRUCTURA DE ARCHIVOS

```
worldcup-project/
├── index.html          ← Página HTML principal
├── package.json        ← Configuración del proyecto
├── vite.config.js      ← Configuración de Vite
└── src/
    ├── main.jsx        ← Punto de entrada
    └── App.jsx         ← LA APP COMPLETA (todo está aquí)
```

Si quieres hacer cambios a la app, edita `src/App.jsx`.

---

### NOTAS

- No necesitas internet para ver la app (solo para la API)
- Los cambios en el código se reflejan automáticamente en el navegador (hot reload)
- Para producción: `npm run build` genera una carpeta `dist/` lista para subir a cualquier hosting
