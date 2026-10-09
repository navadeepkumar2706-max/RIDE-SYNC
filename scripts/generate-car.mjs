import fs from 'fs';
import path from 'path';
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

// Polyfill FileReader for Node.js
if (typeof global.FileReader === 'undefined') {
  global.FileReader = class FileReader {
    constructor() {
      this.result = null;
      this.onload = null;
      this.onloadend = null;
      this.onerror = null;
    }
    readAsArrayBuffer(blob) {
      blob.arrayBuffer().then((buf) => {
        this.result = buf;
        if (this.onload) this.onload({ target: this });
        if (this.onloadend) this.onloadend({ target: this });
      }).catch((err) => {
        if (this.onerror) this.onerror(err);
      });
    }
    readAsDataURL(blob) {
      blob.arrayBuffer().then((buf) => {
        const base64 = Buffer.from(buf).toString('base64');
        this.result = `data:${blob.type || 'application/octet-stream'};base64,${base64}`;
        if (this.onload) this.onload({ target: this });
        if (this.onloadend) this.onloadend({ target: this });
      }).catch((err) => {
        if (this.onerror) this.onerror(err);
      });
    }
  };
}

const assetsDir = path.resolve(process.cwd(), 'public', 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

console.log('Building High-Fidelity GT3 Model...');

const car = new THREE.Group();
car.name = 'GT3_Sports_Car';

// Materials
const paintMat = new THREE.MeshStandardMaterial({
  name: 'Car_Paint_GT3',
  color: 0xd6d8db,
  metalness: 0.88,
  roughness: 0.18,
});

const carbonMat = new THREE.MeshStandardMaterial({
  name: 'Carbon_Fiber',
  color: 0x141619,
  metalness: 0.25,
  roughness: 0.38,
});

const glassMat = new THREE.MeshPhysicalMaterial({
  name: 'Glass_Tinted',
  color: 0x0a0f18,
  metalness: 0.1,
  roughness: 0.05,
  transmission: 0.85,
  opacity: 0.85,
  transparent: true,
});

const redAccMat = new THREE.MeshStandardMaterial({
  name: 'Racing_Red_Accent',
  color: 0xe10600,
  metalness: 0.45,
  roughness: 0.25,
});

const rubberMat = new THREE.MeshStandardMaterial({
  name: 'Tire_Rubber',
  color: 0x131417,
  metalness: 0.05,
  roughness: 0.88,
});

const alloyMat = new THREE.MeshStandardMaterial({
  name: 'Alloy_Rim',
  color: 0x22262e,
  metalness: 0.95,
  roughness: 0.18,
});

const steelDiscMat = new THREE.MeshStandardMaterial({
  name: 'Steel_Brake_Disc',
  color: 0x9ca3af,
  metalness: 0.96,
  roughness: 0.2,
});

const exhaustMat = new THREE.MeshStandardMaterial({
  name: 'Exhaust_Titanium',
  color: 0x475569,
  metalness: 0.92,
  roughness: 0.28,
});

const glowRedMat = new THREE.MeshBasicMaterial({
  name: 'LED_Red_Taillight',
  color: 0xff0f0f,
});

const glowWhiteMat = new THREE.MeshBasicMaterial({
  name: 'LED_White_Headlight',
  color: 0xffffff,
});

// 1. Chassis Core / Monocoque
const chassis = new THREE.Group();
chassis.name = 'Chassis_Core';

const tub = new THREE.Mesh(new THREE.BoxGeometry(1.56, 0.26, 3.82), carbonMat);
tub.position.set(0, 0.28, 0);
tub.name = 'Carbon_Tub';
chassis.add(tub);

const engine = new THREE.Mesh(new THREE.BoxGeometry(0.94, 0.42, 0.86), alloyMat);
engine.position.set(0, 0.46, -0.92);
engine.name = 'Flat6_Powertrain';
chassis.add(engine);

const airbox = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.16, 0.62), carbonMat);
airbox.position.set(0, 0.72, -0.92);
airbox.name = 'Airbox';
chassis.add(airbox);

// Dual exhaust
for (let s of [-0.09, 0.09]) {
  const ex = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.048, 0.38, 20), exhaustMat);
  ex.rotation.x = Math.PI / 2;
  ex.position.set(s, 0.27, -2.14);
  ex.name = `Exhaust_${s > 0 ? 'R' : 'L'}`;
  chassis.add(ex);
}
car.add(chassis);

// 2. Front Hood
const frontHood = new THREE.Group();
frontHood.name = 'Front_Hood';

const hood = new THREE.Mesh(new THREE.BoxGeometry(1.54, 0.065, 1.46), paintMat);
hood.position.set(0, 0.67, 1.16);
hood.rotation.x = 0.09;
hood.name = 'Hood_Panel';
frontHood.add(hood);

for (let s of [-0.26, 0.26]) {
  const n = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.04, 0.5), carbonMat);
  n.position.set(s, 0.71, 1.26);
  n.rotation.x = 0.09;
  n.name = `Hood_Nostril_${s > 0 ? 'R' : 'L'}`;
  frontHood.add(n);
}
car.add(frontHood);

// 3. Front Bumper
const frontBumper = new THREE.Group();
frontBumper.name = 'Front_Bumper';

const fBump = new THREE.Mesh(new THREE.BoxGeometry(1.84, 0.35, 0.64), paintMat);
fBump.position.set(0, 0.38, 2.08);
fBump.name = 'Front_Bumper_Fascia';
frontBumper.add(fBump);

const fSplit = new THREE.Mesh(new THREE.BoxGeometry(1.96, 0.038, 0.48), carbonMat);
fSplit.position.set(0, 0.15, 2.3);
fSplit.name = 'Front_Carbon_Splitter';
frontBumper.add(fSplit);

for (let s of [-0.66, 0.66]) {
  const h = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.11, 0.3), glowWhiteMat);
  h.position.set(s, 0.62, 1.88);
  h.name = `Headlight_${s > 0 ? 'R' : 'L'}`;
  frontBumper.add(h);
}
car.add(frontBumper);

// 4. Doors
const doorL = new THREE.Group();
doorL.name = 'Door_Left';
const dL = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.52, 1.54), paintMat);
dL.position.set(-0.85, 0.58, 0.05);
dL.name = 'Door_Panel_Left';
doorL.add(dL);
const mirL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.075, 0.13), carbonMat);
mirL.position.set(-0.97, 0.82, 0.62);
mirL.name = 'Mirror_Left';
doorL.add(mirL);
car.add(doorL);

const doorR = new THREE.Group();
doorR.name = 'Door_Right';
const dR = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.52, 1.54), paintMat);
dR.position.set(0.85, 0.58, 0.05);
dR.name = 'Door_Panel_Right';
doorR.add(dR);
const mirR = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.075, 0.13), carbonMat);
mirR.position.set(0.97, 0.82, 0.62);
mirR.name = 'Mirror_Right';
doorR.add(mirR);
car.add(doorR);

// 5. Roof & Canopy
const roof = new THREE.Group();
roof.name = 'Roof_Canopy';
const rMesh = new THREE.Mesh(new THREE.BoxGeometry(1.34, 0.05, 1.48), carbonMat);
rMesh.position.set(0, 1.15, -0.05);
rMesh.name = 'Carbon_Roof';
roof.add(rMesh);

const wMesh = new THREE.Mesh(new THREE.BoxGeometry(1.36, 0.46, 0.74), glassMat);
wMesh.position.set(0, 0.93, 0.72);
wMesh.rotation.x = -0.45;
wMesh.name = 'Windshield';
roof.add(wMesh);

const rwMesh = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.44, 0.84), glassMat);
rwMesh.position.set(0, 0.95, -0.76);
rwMesh.rotation.x = 0.46;
rwMesh.name = 'Rear_Window';
roof.add(rwMesh);
car.add(roof);

// 6. Rear Wing
const rearWing = new THREE.Group();
rearWing.name = 'Rear_Wing';

for (let s of [-0.38, 0.38]) {
  const p = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.48, 0.15), carbonMat);
  p.position.set(s, 1.16, -1.68);
  p.rotation.x = -0.22;
  p.name = `Swan_Neck_${s > 0 ? 'R' : 'L'}`;
  rearWing.add(p);
}

const wingMesh = new THREE.Mesh(new THREE.BoxGeometry(2.06, 0.048, 0.5), carbonMat);
wingMesh.position.set(0, 1.38, -1.76);
wingMesh.rotation.x = 0.08;
wingMesh.name = 'Main_Wing';
rearWing.add(wingMesh);

for (let s of [-1.04, 1.04]) {
  const ep = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.32, 0.54), redAccMat);
  ep.position.set(s, 1.38, -1.76);
  ep.name = `Endplate_${s > 0 ? 'R' : 'L'}`;
  rearWing.add(ep);
}
car.add(rearWing);

// 7. Rear Bumper
const rearBumper = new THREE.Group();
rearBumper.name = 'Rear_Bumper';

const rBump = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.44, 0.7), paintMat);
rBump.position.set(0, 0.46, -1.88);
rBump.name = 'Rear_Bumper_Fascia';
rearBumper.add(rBump);

const diff = new THREE.Mesh(new THREE.BoxGeometry(1.76, 0.12, 0.66), carbonMat);
diff.position.set(0, 0.17, -1.98);
diff.name = 'Rear_Diffuser';
rearBumper.add(diff);

const lBar = new THREE.Mesh(new THREE.BoxGeometry(1.74, 0.042, 0.05), glowRedMat);
lBar.position.set(0, 0.69, -2.14);
lBar.name = 'LED_Taillight';
rearBumper.add(lBar);
car.add(rearBumper);

// 8. Wheels
function createWheel(name, x, y, z, isFront, isLeft) {
  const g = new THREE.Group();
  g.name = name;

  const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.28, 24), rubberMat);
  tire.rotation.z = Math.PI / 2;
  g.add(tire);

  const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.29, 20), alloyMat);
  rim.rotation.z = Math.PI / 2;
  g.add(rim);

  const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.21, 0.025, 20), steelDiscMat);
  disc.rotation.z = Math.PI / 2;
  disc.position.x = isLeft ? 0.07 : -0.07;
  g.add(disc);

  const cal = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.15, 0.12), redAccMat);
  cal.position.set(isLeft ? 0.07 : -0.07, 0.13, 0.06);
  g.add(cal);

  g.position.set(x, y, z);
  return g;
}

car.add(createWheel('Wheel_FL', -0.92, 0.35, 1.25, true, true));
car.add(createWheel('Wheel_FR', 0.92, 0.35, 1.25, true, false));
car.add(createWheel('Wheel_RL', -0.96, 0.37, -1.25, false, true));
car.add(createWheel('Wheel_RR', 0.96, 0.37, -1.25, false, false));

// 9. Interior
const interior = new THREE.Group();
interior.name = 'Interior_Cockpit';
for (let s of [-0.34, 0.34]) {
  const sb = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.58, 0.1), carbonMat);
  sb.position.set(s, 0.66, -0.06);
  sb.rotation.x = -0.22;
  interior.add(sb);

  const sBase = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.11, 0.42), carbonMat);
  sBase.position.set(s, 0.41, 0.13);
  interior.add(sBase);
}
for (let s of [-0.62, 0.62]) {
  const cage = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.95, 10), redAccMat);
  cage.position.set(s, 0.78, -0.42);
  cage.rotation.x = 0.42;
  interior.add(cage);
}
car.add(interior);

console.log('Exporting GLTF binary...');
const exporter = new GLTFExporter();
exporter.parse(
  car,
  function (result) {
    const outputPath = path.resolve(assetsDir, 'gt3rs.glb');
    fs.writeFileSync(outputPath, Buffer.from(result));
    console.log(`Updated GLB written successfully to ${outputPath} (${result.byteLength} bytes)`);
  },
  function (error) {
    console.error('Error exporting model:', error);
  },
  { binary: true }
);
