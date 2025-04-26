import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Sky } from 'three/addons/objects/Sky.js';
import  Stats  from 'three/addons/libs/stats.module.js'
const RAPIER = await import('https://cdn.skypack.dev/@dimforge/rapier3d-compat@0.11.2');
await RAPIER.init();

let uiCanvas=document.getElementById('ui-canvas')
let ui_ctx=uiCanvas.getContext('2d')
uiCanvas.width = window.innerWidth
uiCanvas.height = window.innerHeight

const pi = Math.PI;