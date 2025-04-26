const RAPIER = await import('https://cdn.skypack.dev/@dimforge/rapier3d-compat@0.11.2');
await RAPIER.init();

window.app = {}

app.uiCanvas=document.getElementById('ui-canvas')
app.ui_ctx=uiCanvas.getContext('2d')
app.uiCanvas.width = window.innerWidth
app.uiCanvas.height = window.innerHeight

app.pi = Math.PI;