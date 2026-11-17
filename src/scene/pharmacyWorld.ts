import * as THREE from 'three';
import { getPharmacyQueueNumber, type SceneMoment, type SceneProduct } from './shiftScene';
import type { GameStage } from '../types/game.types';

type Point = [number, number, number];
const colors = {
  pine: 0x22655b, jade: 0x72b4a1, dark: 0x142f34, light: 0xe9eee1,
  wall: 0xdce4dd, floor: 0xe2e7e1, steel: 0x9aaea8, paper: 0xf7f6eb,
  sand: 0xead1a9, amber: 0xf6c76c, metal: 0x6c8d87, blue: 0x557e9b,
};

export const stationViews = {
  receiving: { target: [-4.65, 1.35, 1.23], marker: [-4.4, 1.42, 1.55], zoom: 3.7 },
  typing: { target: [-1.3, 1.5, -2.3], marker: [-0.55, 1.53, -1.95], zoom: 3.6 },
  picking: { target: [3.65, 2.03, -3.30], marker: [3.35, 2.1, -2.25], zoom: 2.65 },
  dispensing: { target: [4.63, 1.4, 1.53], marker: [6.23, 2.18, 1.24], zoom: 3.5 },
} satisfies Record<GameStage, { target: Point; marker: Point; zoom: number }>;

export type PharmacyView = GameStage | 'overview';

export function buildPharmacy(scene: THREE.Scene) {
  const unitBox = new THREE.BoxGeometry();
  const orb = new THREE.SphereGeometry(1, 20, 13);
  const tube = new THREE.CylinderGeometry(1, 0.86, 1, 16);
  const materials = new Map<number, THREE.MeshStandardMaterial>();

  function surface(color: number) {
    let material = materials.get(color);
    if (!material) {
      material = new THREE.MeshStandardMaterial({ color, roughness: 0.82 });
      materials.set(color, material);
    }
    return material;
  }

  function shape(geometry: THREE.BufferGeometry, parent: THREE.Object3D, dims: Point, position: Point, material: THREE.Material) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.scale.set(...dims);
    mesh.position.set(...position);
    parent.add(mesh);
    return mesh;
  }

  const box = (parent: THREE.Object3D, dims: Point, position: Point, color: number) =>
    shape(unitBox, parent, dims, position, surface(color));
  const ball = (parent: THREE.Object3D, dims: Point, position: Point, color: number) =>
    shape(orb, parent, dims, position, surface(color));
  const cylinder = (parent: THREE.Object3D, dims: Point, position: Point, color: number) =>
    shape(tube, parent, dims, position, surface(color));

  function group(parent: THREE.Object3D, position: Point) {
    const node = new THREE.Group();
    node.position.set(...position);
    parent.add(node);
    return node;
  }

  function textPanel(parent: THREE.Object3D, position: Point, width: number, height: number, text: string, background: string, foreground: string) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = Math.round(512 * height / width);
    const paint = canvas.getContext('2d');
    if (!paint) return;
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(width, height), new THREE.MeshBasicMaterial({ map: texture }));
    panel.position.set(...position);
    parent.add(panel);

    function write(label: string) {
      if (!paint) return;
      paint.fillStyle = background;
      paint.fillRect(0, 0, canvas.width, canvas.height);
      paint.fillStyle = foreground;
      paint.textAlign = 'center';
      paint.textBaseline = 'middle';
      paint.font = `700 ${Math.floor(canvas.height * 0.46)}px sans-serif`;
      paint.fillText(label, canvas.width / 2, canvas.height / 2, canvas.width - 22);
      texture.needsUpdate = true;
    }

    write(text);
    return write;
  }

  function plant(x: number, z: number, scale: number) {
    const pot = group(scene, [x, 0, z]);
    pot.scale.setScalar(scale);
    cylinder(pot, [0.34, 0.52, 0.34], [0, 0.26, 0], colors.sand);
    cylinder(pot, [0.31, 0.035, 0.31], [0, 0.53, 0], 0x605643);
    for (let leaf = 0; leaf < 9; leaf++) {
      const angle = leaf * 2.399;
      const length = 0.29 + (leaf % 3) * 0.04;
      const tuft = ball(pot, [0.135, length, 0.065], [Math.cos(angle) * 0.23, 0.85 + (leaf % 4) * 0.115, Math.sin(angle) * 0.2], leaf % 2 ? 0x3e7951 : 0x649355);
      tuft.rotation.z = Math.cos(angle) * 0.84;
      tuft.rotation.x = Math.sin(angle) * 0.75;
    }
  }

  function contact(parent: THREE.Object3D, x: number, z: number, width: number, depth: number) {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 64;
    const paint = canvas.getContext('2d');
    if (!paint) return;
    const shade = paint.createRadialGradient(32, 32, 4, 32, 32, 31);
    shade.addColorStop(0, 'rgba(24,47,45,.32)');
    shade.addColorStop(1, 'rgba(24,47,45,0)');
    paint.fillStyle = shade;
    paint.fillRect(0, 0, 64, 64);
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(width, depth), new THREE.MeshBasicMaterial({
      map: new THREE.CanvasTexture(canvas), transparent: true, depthWrite: false,
    }));
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.set(x, 0.014, z);
    parent.add(shadow);
  }

  const sky = new THREE.HemisphereLight(0xf5fcf2, 0x7e9c94, 2.2);
  const key = new THREE.DirectionalLight(0xffe2ba, 2.5);
  key.position.set(-6, 10, 4);
  const rim = new THREE.DirectionalLight(0xa5e2ea, 0.85);
  rim.position.set(6, 6, -7);
  scene.add(sky, key, rim);

  box(scene, [15.3, 0.46, 10.15], [0, -0.25, 0.03], colors.pine);
  box(scene, [15.15, 0.14, 10], [0, -0.075, 0.03], colors.floor);
  for (let index = -7; index <= 7; index++) box(scene, [0.012, 0.006, 9.96], [index, 0, 0.03], 0xbcc7b7);
  for (let index = -4; index <= 4; index++) box(scene, [15.1, 0.007, 0.012], [0, 0, index], 0xbcc7b7);
  box(scene, [15.1, 0.12, 0.14], [0, 0.055, 4.93], colors.jade);
  for (const [x, z, length] of [[-1.2, -0.5, 3.4], [3, -0.48, 2.7]]) {
    box(scene, [length, 0.009, 0.085], [x, 0.009, z], colors.jade);
  }

  // The public waiting area is on the opposite side of the service line from the dispensary.
  box(scene, [14.95, 0.012, 3.3], [0, 0.002, 3.22], 0xd2e1de);
  for (const x of [-4.45, 4.67]) {
    box(scene, [2.7, 0.008, 0.08], [x, 0.013, 3.25], colors.jade);
  }

  const back = group(scene, [0, 0, -4.73]);
  box(back, [15.1, 1.04, 0.29], [0, 0.49, 0], colors.wall);
  box(back, [15.1, 0.88, 0.29], [0, 3.73, 0], colors.wall);
  box(back, [15.12, 0.16, 0.36], [0, 4.16, 0], colors.pine);
  for (const x of [-7.4, -4.6, -1.7, 1.15, 4.05, 7.4]) box(back, [0.22, 2.7, 0.28], [x, 2.21, 0], colors.wall);

  // The clinic windows look out onto nearby housing blocks.
  box(scene, [15, 2.8, 0.06], [0, 2.3, -5.02], 0xb7d6d5);
  for (let block = 0; block < 7; block++) {
    const x = -6.5 + block * 1.94;
    const height = 1.08 + ((block * 7) % 4) * 0.29;
    box(scene, [1.48, height, 0.065], [x, 1.04 + height / 2, -4.96], block % 2 ? 0xf9e7bd : 0xe5edd9);
    box(scene, [0.28, height, 0.069], [x - 0.52, 1.04 + height / 2, -4.954], block % 2 ? 0xcd906d : 0x79a89c);
    for (let row = 0; row < 5; row++) {
      const y = 1.14 + row * (height / 5);
      for (let col = 0; col < 3; col++) box(scene, [0.16, 0.12, 0.02], [x - 0.23 + col * 0.35, y, -4.915], 0x83a3a4);
    }
    ball(scene, [0.55, 0.31, 0.1], [x + 0.43, 1.11, -4.81], block % 2 ? 0x689b79 : 0x79a886);
  }
  for (const x of [-5.95, -3.15, -0.27, 2.6, 5.75]) box(back, [0.06, 2.36, 0.16], [x, 2.17, 0.08], colors.metal);

  const wing = group(scene, [-7.48, 0, -2.32]);
  box(wing, [0.25, 3.96, 4.75], [0, 1.98, 0], colors.wall);
  box(wing, [0.30, 0.13, 4.75], [0, 3.98, 0], colors.pine);
  const wayfinding = group(scene, [-7.32, 2.7, -1.2]);
  wayfinding.rotation.y = Math.PI / 2;
  textPanel(wayfinding, [0, 0, 0], 2.28, 0.45, 'PHARMACY', '#21574f', '#fff2ce');

  function consoleDesk(x: number, z: number, width: number, frontColor: number) {
    const desk = group(scene, [x, 0, z]);
    contact(desk, 0, 0.15, width + 1.5, 2.2);
    box(desk, [width - 0.2, 1.08, 0.95], [0, 0.54, 0], frontColor);
    box(desk, [width, 0.15, 1.20], [0, 1.13, 0], colors.paper);
    box(desk, [width - 0.13, 0.105, 1.02], [0, 0.045, 0.025], colors.dark);
    for (const side of [-1, 1]) {
      box(desk, [0.075, 0.88, 0.055], [side * (width / 2 - 0.18), 0.50, 0.483], colors.steel);
    }
    box(desk, [width - 0.2, 0.065, 0.065], [0, 0.98, 0.49], colors.steel);
    return desk;
  }

  function monitor(desk: THREE.Group, x: number, z: number, facesStaff = false) {
    const terminal = group(desk, [x, 1.2, z]);
    terminal.rotation.y = facesStaff ? Math.PI : 0;
    box(terminal, [0.52, 0.055, 0.27], [0, 0.03, 0], colors.dark);
    box(terminal, [0.105, 0.24, 0.095], [0, 0.18, 0], colors.metal);
    box(terminal, [0.82, 0.53, 0.09], [0, 0.46, 0], colors.dark);
    box(terminal, [0.72, 0.43, 0.012], [0, 0.46, 0.05], colors.jade);
    textPanel(terminal, [0, 0.46, 0.059], 0.71, 0.39, 'Rx', '#203d4a', '#a7eed6');
    box(terminal, [0.50, 0.03, 0.18], [0, 0.032, 0.30], colors.metal);
  }

  function envelope(parent: THREE.Object3D, position: Point, tint: number) {
    const paper = group(parent, position);
    box(paper, [0.52, 0.025, 0.39], [0, 0, 0], tint);
    for (let row = 0; row < 3; row++) box(paper, [0.29 - row * 0.035, 0.003, 0.012], [-0.038, 0.014, -0.075 + row * 0.068], 0x7a9c92);
    return paper;
  }

  const privacyGlass = new THREE.MeshStandardMaterial({
    color: 0xb5d8d5, roughness: 0.46, transparent: true, opacity: 0.36, depthWrite: false,
  });

  function privacyDivider(desk: THREE.Group, x: number, counter: string) {
    const screen = group(desk, [x, 1.21, 0.14]);
    box(screen, [0.075, 0.54, 1.33], [0, 0.26, 0], colors.wall);
    shape(unitBox, screen, [0.038, 0.53, 1.33], [0, 0.80, 0], privacyGlass);
    for (const z of [-0.64, 0.64]) {
      box(screen, [0.065, 1.07, 0.05], [0, 0.52, z], colors.steel);
    }
    box(screen, [0.40, 0.33, 0.09], [0, 1.17, 0.61], colors.dark);
    textPanel(screen, [0, 1.17, 0.66], 0.35, 0.28, counter, '#1d4b4a', '#ffffff');
    return indicator(screen, [0, 1.36, 0.65], [0.28, 0.033, 0.028]);
  }

  function indicator(parent: THREE.Object3D, position: Point, size: Point) {
    const material = new THREE.MeshBasicMaterial({ color: 0x385755 });
    shape(unitBox, parent, size, position, material);
    return material.color;
  }

  const staffBoundary = group(scene, [0.17, 0, 1.13]);
  for (const x of [-1.75, 1.75]) {
    box(staffBoundary, [1.35, 1.36, 0.20], [x, 0.68, 0], colors.wall);
    box(staffBoundary, [1.41, 0.075, 0.265], [x, 1.36, 0], colors.steel);
  }
  box(staffBoundary, [2.12, 1.10, 0.19], [0, 0.62, 0], 0x819e97);
  box(staffBoundary, [0.08, 0.27, 0.056], [0.82, 0.80, 0.125], colors.dark);
  textPanel(staffBoundary, [0, 0.68, 0.101], 1.02, 0.23, 'STAFF ONLY', '#45665f', '#ffffff');

  const queueBoard = group(staffBoundary, [0.02, 2.05, 0.015]);
  for (const x of [-0.67, 0.67]) {
    box(queueBoard, [0.09, 1.17, 0.11], [x, -0.38, -0.10], colors.steel);
  }
  box(queueBoard, [2.58, 0.79, 0.16], [0, 0, 0], colors.dark);
  textPanel(queueBoard, [0, 0.19, 0.085], 2.34, 0.29, 'PHARMACY QUEUE', '#172f39', '#d6e9ea');
  const showQueue = textPanel(queueBoard, [0, -0.155, 0.085], 2.34, 0.38, 'P101   →   01', '#172f39', '#ffe596');


  const intake = consoleDesk(-4.45, 1.03, 3.9, colors.pine);
  textPanel(intake, [0, 0.63, 0.524], 2.45, 0.36, '01  PRESCRIPTION CHECK', '#225e53', '#fff0c0');
  monitor(intake, -0.94, -0.15, true);
  const intakeLamp = privacyDivider(intake, 1.86, '01');
  const slip = envelope(intake, [0.18, 1.22, 0.37], colors.paper);
  envelope(intake, [0.74, 1.217, 0.23], 0xedc6c3).rotation.y = -0.23;

  const labels = consoleDesk(-1.26, -2.56, 3.25, colors.jade);
  textPanel(labels, [0, 0.62, 0.524], 2.15, 0.33, 'LABEL STATION', '#376e62', '#fff0c0');
  monitor(labels, -0.76, -0.1);
  const printer = group(labels, [0.67, 1.38, 0]);
  box(printer, [0.68, 0.34, 0.48], [0, 0, 0], colors.light);
  box(printer, [0.59, 0.08, 0.5], [0, 0.15, 0], colors.dark);
  box(labels, [0.44, 0.047, 0.04], [0.67, 1.4, 0.255], colors.dark);
  const printout = envelope(labels, [0.67, 1.36, 0.30], colors.paper);
  printout.rotation.x = 1.18;
  const printerLamp = indicator(labels, [0.88, 1.48, 0.257], [0.071, 0.045, 0.028]);
  const printerDisplay = textPanel(labels, [0.66, 1.338, 0.255], 0.42, 0.072, 'READY', '#203d4a', '#c5f2de');
  envelope(labels, [-0.13, 1.215, 0.36], colors.paper);

  const stock = group(scene, [3.65, 0, -3.74]);
  contact(stock, 0, 0.5, 5.9, 2.5);
  box(stock, [5.4, 3.5, 0.13], [0, 1.74, -0.33], 0xb9c8c2);
  for (const x of [-2.67, -0.91, 0.91, 2.67]) box(stock, [0.115, 3.52, 0.81], [x, 1.74, 0], colors.steel);
  const stockDecor = group(stock, [0, 0, 0]);
  const stockTints = [0x70b190, 0xcf876e, 0xdda45f, 0x788bb4, 0x9d82a3, 0x5a9fb1];
  for (let shelf = 0; shelf < 4; shelf++) {
    const base = 0.23 + shelf * 0.79;
    box(stock, [5.4, 0.12, 0.90], [0, base, 0.043], colors.steel);
    for (let product = 0; product < 15; product++) {
      const x = (Math.floor(product / 5) - 1) * 1.79 + ((product % 5) - 2) * 0.27;
      const height = 0.29 + ((shelf + product * 3) % 5) * 0.069;
      const front = product % 3 === 0 ? 0.246 : 0.277;
      box(stockDecor, [0.22, height, 0.31], [x, base + 0.061 + height / 2, front - 0.155], colors.paper);
      box(stockDecor, [0.224, 0.085, 0.015], [x, base + 0.113, front + 0.005], stockTints[(product + shelf) % stockTints.length]);
      box(stockDecor, [0.12, 0.021, 0.015], [x, base + 0.215, front + 0.005], colors.metal);
    }
  }
  box(stock, [5.42, 0.34, 0.29], [0, 3.54, -0.16], colors.pine);
  textPanel(stock, [0, 3.54, -0.012], 3.6, 0.29, 'MEDICINE STOCK', '#286557', '#fff0c0');
  const packing = consoleDesk(3.1, -1.67, 2.7, colors.jade);
  box(packing, [0.45, 0.08, 0.27], [-0.62, 1.245, 0.12], colors.metal);
  box(packing, [0.12, 0.21, 0.09], [-0.62, 1.35, 0.12], colors.dark);
  box(packing, [0.93, 0.29, 0.12], [-0.62, 1.53, 0.12], colors.dark);
  const trayDisplay = textPanel(packing, [-0.62, 1.53, 0.182], 0.85, 0.22, 'PICKING TRAY', '#203d4a', '#c5f2de');
  box(packing, [0.83, 0.075, 0.62], [0.24, 1.23, 0.15], colors.blue);
  for (const x of [-0.18, 0.66]) box(packing, [0.06, 0.15, 0.62], [x, 1.27, 0.15], colors.blue);
  for (const z of [-0.13, 0.44]) box(packing, [0.83, 0.15, 0.05], [0.24, 1.27, z], colors.blue);

  const packedCartons = [0, 1, 2, 3].map((index) => {
    const carton = group(packing, [-0.02 + (index % 2) * 0.32, 1.34 + Math.floor(index / 2) * 0.14, 0.16]);
    box(carton, [0.28, 0.13, 0.39], [0, 0, 0], colors.paper);
    box(carton, [0.065, 0.135, 0.39], [0.072, 0, 0], stockTints[index]);
    return carton;
  });

  const dispensing = consoleDesk(4.67, 1.24, 3.75, colors.pine);
  textPanel(dispensing, [0, 0.63, 0.524], 2.72, 0.36, '02  MEDICINE COLLECTION', '#225e53', '#fff0c0');
  monitor(dispensing, 0.99, -0.16, true);
  const collectionLamp = privacyDivider(dispensing, -1.78, '02');
  box(dispensing, [1.09, 0.11, 0.52], [1.06, 0.89, 0.67], colors.light);
  const bag = group(dispensing, [-0.37, 1.2, 0.24]);
  box(bag, [0.49, 0.65, 0.29], [0, 0.325, 0], colors.sand);
  box(bag, [0.32, 0.21, 0.012], [0, 0.36, 0.149], colors.paper);
  box(bag, [0.21, 0.027, 0.012], [0, 0.36, 0.158], colors.jade);
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.025, 8, 16, Math.PI), surface(colors.sand));
  handle.position.set(0, 0.65, 0);
  bag.add(handle);
  const interactionRing = new THREE.Mesh(
    new THREE.RingGeometry(0.38, 0.42, 42),
    new THREE.MeshBasicMaterial({ color: 0xffd381, transparent: true, opacity: 0.85, depthWrite: false }),
  );
  interactionRing.rotation.x = -Math.PI / 2;
  const interactionSurface = new THREE.Mesh(
    new THREE.CircleGeometry(0.42, 32),
    new THREE.MeshBasicMaterial({ color: 0xffd381, transparent: true, opacity: 0.11, depthWrite: false }),
  );
  interactionSurface.position.z = -0.002;
  interactionRing.add(interactionSurface);
  scene.add(interactionRing);

  function waitingSeat(x: number) {
    const seat = group(scene, [x, 0, 4.19]);
    seat.rotation.y = Math.PI;
    contact(seat, 0, 0, 1.1, 0.92);
    box(seat, [0.80, 0.14, 0.66], [0, 0.46, 0], colors.blue);
    box(seat, [0.80, 0.50, 0.12], [0, 0.74, -0.288], colors.blue);
    for (const edge of [-0.32, 0.32]) box(seat, [0.055, 0.45, 0.45], [edge, 0.225, 0], colors.metal);
  }
  for (const x of [-2.08, -1.24, -0.4, 0.72, 1.56, 2.4]) waitingSeat(x);
  box(scene, [2.58, 0.07, 0.08], [-1.24, 0.31, 4.2], colors.metal);
  box(scene, [2.58, 0.07, 0.08], [1.56, 0.31, 4.2], colors.metal);

  const staffStorage = group(scene, [-4.63, 0, -4.02]);
  box(staffStorage, [2.86, 0.96, 0.93], [0, 0.48, 0], colors.light);
  box(staffStorage, [2.98, 0.095, 0.97], [0, 1.0, 0], colors.steel);
  for (const x of [-0.95, 0, 0.95]) {
    box(staffStorage, [0.91, 0.8, 0.095], [x, 0.49, 0.46], colors.wall);
    box(staffStorage, [0.24, 0.035, 0.05], [x, 0.76, 0.52], colors.steel);
  }
  plant(-6.68, -3.72, 1.25);
  plant(7.01, 3.31, 1.1);
  plant(-6.76, 2.90, 0.87);

  function person(position: Point, shirt: number, skin: number, hair: number, rotation: number, options: { staff?: boolean; longHair?: boolean; glasses?: boolean } = {}) {
    const actor = group(scene, position);
    actor.rotation.y = rotation;
    contact(actor, 0, 0, 0.95, 0.86);
    const legs = [-1, 1].map(side => {
      const hip = group(actor, [side * 0.16, 0.88, 0]);
      ball(hip, [0.149, 0.28, 0.17], [0, -0.19, 0], colors.dark);
      const knee = group(hip, [0, -0.38, 0]);
      ball(knee, [0.13, 0.25, 0.14], [0, -0.18, 0], colors.dark);
      ball(knee, [0.137, 0.105, 0.22], [0, -0.39, 0.069], colors.dark);
      return { hip, knee };
    });
    const body = group(actor, [0, 0.87, 0]);
    ball(body, [0.38, 0.52, 0.24], [0, 0.34, 0], shirt);
    ball(body, [0.145, 0.20, 0.14], [0, 0.79, 0], skin);
    if (options.staff) box(body, [0.105, 0.13, 0.024], [-0.19, 0.56, 0.219], colors.paper);
    const arms = [-1, 1].map(side => {
      const shoulder = group(body, [side * 0.316, 0.6, 0]);
      ball(shoulder, [0.13, 0.22, 0.14], [0, -0.12, 0], shirt);
      const elbow = group(shoulder, [0, -0.28, 0]);
      ball(elbow, [0.098, 0.16, 0.093], [0, -0.11, 0.021], skin);
      const hand = ball(elbow, [0.09, 0.11, 0.09], [0, -0.26, 0.04], skin);
      return { shoulder, elbow, hand };
    });
    const head = group(body, [0, 1.0, 0.025]);
    ball(head, [0.29, 0.34, 0.27], [0, 0.12, 0], skin);
    ball(head, [0.30, 0.225, 0.27], [0, 0.27, -0.032], hair);
    if (options.longHair) ball(head, [0.26, 0.28, 0.21], [0, 0.01, -0.14], hair);
    ball(head, [0.145, 0.10, 0.062], [-0.12, 0.262, 0.183], hair).rotation.z = 0.26;
    const eyes = [-1, 1].map(side => {
      ball(head, [0.044, 0.068, 0.047], [side * 0.28, 0.10, -0.016], skin);
      if (options.glasses) {
        const frame = new THREE.Mesh(glassesFrame, surface(0x50564f));
        frame.position.set(side * 0.095, 0.125, 0.269);
        head.add(frame);
      }
      return ball(head, [0.022, 0.03, 0.012], [side * 0.093, 0.123, 0.249], colors.dark);
    });
    if (options.glasses) box(head, [0.065, 0.013, 0.01], [0, 0.131, 0.274], 0x50564f);
    ball(head, [0.046, 0.037, 0.049], [0, 0.073, 0.255], skin);
    const mouth = ball(head, [0.047, 0.011, 0.015], [0, 0.006, 0.252], 0x754842);
    return { actor, body, head, arms, legs, eyes, mouth };
  }

  const glassesFrame = new THREE.TorusGeometry(0.068, 0.009, 6, 16);
  const pharmacist = person([-4.71, 0, -0.12], colors.pine, 0xd69f7b, 0x302b2d, 0.13, { staff: true, longHair: true });
  const technician = person([-0.25, 0, -1.38], 0x658caa, 0xa86c50, 0x252c2c, -2.83, { staff: true });
  const dispenser = person([4.30, 0, 0.17], colors.pine, 0xe5ae89, 0x3e3530, 0.06, { staff: true });
  const patientLooks = [
    { shirt: 0x9b684b, skin: 0xd7a483, hair: 0x5b5859, glasses: true },
    { shirt: 0x596d94, skin: 0xb77c58, hair: 0x202b2a },
    { shirt: 0x9b684b, skin: 0xd7a483, hair: 0x5b5859, glasses: true },
    { shirt: 0x95728c, skin: 0x9f684d, hair: 0x29252a, glasses: true },
  ];
  const patients = patientLooks.map(({ shirt, skin, hair, glasses }) =>
    person([-4.95, 0, 2.43], shirt, skin, hair, Math.PI, { glasses }));
  const visitors = [
    person([-0.40, 0, 4.13], 0xb48759, 0xd4aa89, 0x484343, -2.98, { glasses: true }),
    person([2.40, 0, 4.13], 0x597e75, 0xb67b62, 0x3b3033, 2.91, { longHair: true }),
  ];

  const inventory = group(stock, [0, 0, 0]);
  let visibleProducts: SceneProduct[] = [];
  let hoveredProductId: string | undefined;
  let stockIds = '';
  let cartons: { model: THREE.Group; band: THREE.Mesh }[] = [];

  function setProducts(products: SceneProduct[]) {
    visibleProducts = products.slice(0, 12);
    const ids = visibleProducts.map(({ id }) => id).join(',');
    if (stockIds !== ids) {
      stockIds = ids;
      inventory.traverse((object) => {
        if (object instanceof THREE.Mesh && object.material instanceof THREE.MeshBasicMaterial) {
          object.geometry.dispose();
          object.material.map?.dispose();
          object.material.dispose();
        }
      });
      inventory.clear();
      cartons = visibleProducts.map(({ id, name, strength }, index) => {
        const row = 3 - Math.floor(index / 3);
        const x = (index % 3 - 1) * 1.77;
        const carton = group(inventory, [x, 0.30 + row * 0.79, 0.02]);
        carton.userData.productId = id;
        box(carton, [1.29, 0.54, 0.54], [0, 0.29, 0], colors.paper);
        const band = box(carton, [1.30, 0.075, 0.55], [0, 0.12, 0], colors.jade);
        textPanel(carton, [0, 0.34, 0.276], 1.24, 0.19, name, '#fff6d9', '#173e37');
        if (strength) textPanel(carton, [0, 0.215, 0.276], 1.24, 0.14, strength, '#fff6d9', '#35594e');
        return { model: carton, band };
      });
    }
    cartons.forEach(({ model, band }, index) => {
      const { selected } = visibleProducts[index];
      band.material = surface(selected ? colors.pine : stockTints[index % stockTints.length]);
      model.position.z = selected ? 0.15 : 0.02;
    });
  }

  function pickProduct(raycaster: THREE.Raycaster) {
    if (!inventory.visible) return undefined;
    const hit = raycaster.intersectObjects(inventory.children)[0];
    let node: THREE.Object3D | undefined = hit?.object;
    while (node && node !== inventory) {
      if (node.userData.productId) return visibleProducts.find(({ id }) => id === node?.userData.productId);
      node = node.parent ?? undefined;
    }
    return undefined;
  }

  function setHoveredProduct(id?: string) {
    hoveredProductId = id;
  }


  type Person = ReturnType<typeof person>;
  type Waypoint = [x: number, z: number];
  const intakeSpot: Waypoint = [-4.95, 2.43];
  const waitSpot: Waypoint = [-1.2, 3.18];
  const pickupSpot: Waypoint = [4.62, 2.38];
  const staffRoute: Waypoint[] = [[-0.25, -1.38], [0.89, -1.45], [1.05, -2.51]];
  const printerSpot = [staffRoute[0]];
  const routeToCollection: Waypoint[] = [staffRoute[staffRoute.length - 1], [1.35, -0.63], [3.38, -0.55], [4.02, 0.15]];
  const returnToPrinter = [...routeToCollection.slice(1).reverse(), staffRoute[1], staffRoute[0]];
  const patientRoutes: Record<GameStage, Waypoint[]> = {
    receiving: [[-6.2, 4.48], [-5.26, 3.32], intakeSpot],
    typing: [intakeSpot, [-4.48, 3.12], waitSpot],
    picking: [waitSpot],
    dispensing: [waitSpot, [3.36, 3.22], pickupSpot],
  };
  const exitRoute: Waypoint[] = [pickupSpot, [5.94, 3.4], [6.8, 4.49]];
  const transferCarton = group(scene, [0, 0, 0]);
  box(transferCarton, [0.31, 0.17, 0.42], [0, 0, 0], colors.paper);
  const transferBand = box(transferCarton, [0.075, 0.174, 0.425], [0.084, 0, 0], colors.jade);
  const shelfPosition = new THREE.Vector3();
  const trayPosition = new THREE.Vector3();
  const handPosition = new THREE.Vector3();
  const ease = (value: number) => THREE.MathUtils.smoothstep(value, 0, 1);
  let queueStatus = '';
  let printerStatus = '';
  let trayStatus = '';
  let previousStage: GameStage | undefined;
  let previousCase = -1;
  let stageStarted = 0;
  let selectionMoment: SceneMoment | undefined;
  let previousSelection: string[] = [];
  let transferSlot = -1;
  let transferStarted = 0;

  function walk(rig: Person, route: Waypoint[], seconds: number, duration: number, facing: number) {
    const progress = THREE.MathUtils.clamp(seconds / duration, 0, 1);
    const last = route.length - 1;
    if (progress >= 1 || last === 0) {
      rig.actor.position.set(route[last][0], 0, route[last][1]);
      rig.actor.rotation.y = facing;
      return 0;
    }

    const at = progress * last;
    const index = Math.floor(at);
    const [x, z] = route[index];
    const [nextX, nextZ] = route[index + 1];
    const step = at - index;
    rig.actor.position.set(THREE.MathUtils.lerp(x, nextX, step), 0, THREE.MathUtils.lerp(z, nextZ, step));
    const direction = Math.atan2(nextX - x, nextZ - z);
    const turn = Math.atan2(Math.sin(facing - direction), Math.cos(facing - direction));
    rig.actor.rotation.y = direction + turn * ease((progress - 0.79) / 0.21);
    return Math.min(1, progress * 12, (1 - progress) * 12);
  }

  function pose(rig: Person, time: number, phase: number, stride = 0, seated = false) {
    const { body, head, eyes, mouth, arms, legs } = rig;
    const idle = time ? Math.sin(time * 1.9 + phase) : 0;
    const step = stride ? Math.sin(time * 13) : 0;
    body.position.y = (seated ? 0.54 : 0.87) + idle * 0.015 + Math.abs(step) * stride * 0.035;
    body.position.z = 0;
    body.rotation.set(stride * 0.09, 0, step * stride * 0.06);
    head.rotation.set(seated ? 0.17 : idle * 0.045, idle * 0.13, 0);
    const blink = time ? 1 - 0.94 * Math.max(0, 1 - Math.abs((time + phase) % 4.4 - 2.2) / 0.13) : 1;
    eyes.forEach(eye => { eye.scale.y = 0.03 * blink; });
    mouth.scale.y = 0.011;
    arms.forEach(({ shoulder, elbow }, index) => {
      const side = index === 0 ? -1 : 1;
      shoulder.rotation.set(seated ? -0.46 : step * side * stride * 0.46 + idle * 0.06, 0, side * 0.17);
      elbow.rotation.x = seated ? -0.72 : -0.12;
    });
    legs.forEach(({ hip, knee }, index) => {
      const swing = step * (index === 0 ? 1 : -1);
      hip.position.y = seated ? 0.52 : 0.88;
      hip.rotation.x = seated ? -Math.PI / 2 : swing * stride * 0.51;
      knee.rotation.x = seated ? Math.PI / 2 : Math.max(0, -swing) * stride * 0.44;
    });
  }

  function illuminate(color: THREE.Color, active: boolean, elapsed: number, still: boolean) {
    color.setHex(active ? 0xffd786 : 0x385755);
    if (active && !still && elapsed < 1.2) color.multiplyScalar(0.78 + 0.22 * Math.cos(elapsed * 15));
  }

  function animate(time: number, stage: PharmacyView, moment: SceneMoment | undefined, gestureElapsed: number, caseNumber: number, activeStage: GameStage, actionAvailable: boolean) {
    const still = time === 0;
    const stageChanged = previousStage !== activeStage || previousCase !== caseNumber;
    if (stageChanged) {
      previousStage = activeStage;
      previousCase = caseNumber;
      stageStarted = time;
      previousSelection = [];
      transferSlot = -1;
    }
    const inStage = still ? 10 : time - stageStarted;
    const ticket = getPharmacyQueueNumber(caseNumber);
    const currentMoment = moment?.stage === activeStage ? moment : undefined;
    const gesture = currentMoment?.gesture;
    const handover = gesture === 'handover';
    const status = handover ? `${ticket}   ·   COLLECTED`
      : activeStage === 'dispensing' ? `${ticket}   →   02`
      : activeStage === 'receiving' ? `${ticket}   →   01`
        : `${ticket}   ·   PLEASE WAIT`;
    if (queueStatus !== status) {
      queueStatus = status;
      showQueue?.(status);
    }
    illuminate(intakeLamp, activeStage === 'receiving', inStage, still);
    illuminate(collectionLamp, activeStage === 'dispensing' && !handover, inStage, still);
    interactionRing.visible = actionAvailable && stage !== 'picking' && stage !== 'overview';
    if (interactionRing.visible) {
      if (stage === 'receiving') interactionRing.position.set(-4.27, 1.239, 1.40);
      else if (stage === 'typing') interactionRing.position.set(-0.59, 1.214, -2.56);
      else interactionRing.position.set(4.30, 1.215, 1.59);
      const pulse = still || inStage > 2.5 ? 1 : 1 + 0.1 * Math.sin(inStage * 7);
      interactionRing.scale.setScalar(pulse);
    }

    inventory.visible = stage === 'picking' && visibleProducts.length > 0;
    stockDecor.visible = !inventory.visible;
    if (inventory.visible) {
      cartons.forEach(({ model }, index) => {
        const product = visibleProducts[index];
        const depth = product.selected ? 0.15 : 0.02;
        const target = depth + (product.id === hoveredProductId ? 0.09 : 0);
        model.position.z = still ? target : THREE.MathUtils.lerp(model.position.z, target, 0.32);
      });
    }
    const client = patients[(Math.max(1, caseNumber) - 1) % patients.length];
    patients.forEach(patient => { patient.actor.visible = false; });
    const departing = handover && gestureElapsed > 1.05;
    const patientFacing = activeStage === 'receiving' ? 2.38 : activeStage === 'dispensing' ? 2.32 : -1.4;
    const patientStride = departing
      ? walk(client, exitRoute, still ? 0 : gestureElapsed - 1.05, 2.5, 0.7)
      : walk(client, patientRoutes[activeStage], inStage, activeStage === 'dispensing' ? 2.55 : 1.75, patientFacing);
    client.actor.visible = !departing || still || gestureElapsed < 3.55;
    pose(client, time, 1.8, patientStride);

    const atShelves = activeStage === 'picking';
    const delivering = activeStage === 'dispensing' && !handover;
    const technicianStride = atShelves
      ? walk(technician, staffRoute, inStage, 1.95, 0.86)
      : activeStage === 'dispensing'
        ? inStage < 2.75
          ? walk(technician, routeToCollection, inStage, 2.3, 1.2)
          : walk(technician, returnToPrinter, inStage - 2.75, 2.8, -2.83)
        : walk(technician, printerSpot, inStage, 1, -2.83);
    pose(technician, time, 2.5, technicianStride);
    pose(pharmacist, time, 0.2);
    pose(dispenser, time, 4.2);
    visitors.forEach((visitor, index) => pose(visitor, time, 2.1 * index + 1.2, 0, true));

    const counterStaff = activeStage === 'receiving' ? pharmacist : activeStage === 'dispensing' ? dispenser : technician;
    const speaker = currentMoment?.speakerRole === 'staff' ? counterStaff : client;
    const speaking = !still && gestureElapsed < 2.9 && (gesture === 'talk' || gesture === 'consider');
    if (speaking) {
      const emphasis = Math.sin(gestureElapsed * 6);
      speaker.head.rotation.y -= 0.18;
      speaker.mouth.scale.y += Math.abs(Math.sin(gestureElapsed * 17)) * 0.027;
      speaker.arms[1].elbow.rotation.x -= 0.65 + emphasis * 0.23;
      speaker.arms[1].shoulder.rotation.z += 0.15;
    }
    if (gesture === 'nod' && !still && gestureElapsed < 1) {
      speaker.head.rotation.x += Math.sin(gestureElapsed * 11) * 0.21 * (1 - gestureElapsed);
    }
    if (gesture === 'consider') speaker.head.rotation.z = -0.13;

    const presenting = activeStage === 'receiving' ? ease((inStage - 0.9) / 0.5) * (1 - ease((inStage - 1.6) / 0.55)) : 0;
    client.arms[0].shoulder.rotation.x -= 0.76 * presenting;
    client.arms[0].elbow.rotation.x -= 0.42 * presenting;
    slip.position.z = 0.37 + 0.21 * presenting;
    slip.rotation.y = 0.14 * presenting;
    pharmacist.arms[1].shoulder.rotation.x -= 0.37 * presenting;
    pharmacist.arms[1].elbow.rotation.x -= 0.62 * presenting;

    const printing = gesture === 'print';
    const printed = gesture === 'printed';
    if (printing) {
      technician.arms[0].shoulder.rotation.x -= 0.94;
      technician.arms[0].elbow.rotation.x -= 0.34;
      technician.head.rotation.x += 0.2;
    }
    const printerMessage = printing ? 'PRINTING' : printed ? 'LABEL READY' : 'READY';
    if (printerMessage !== printerStatus) {
      printerStatus = printerMessage;
      printerDisplay?.(printerMessage);
    }
    printerLamp.setHex(printing ? 0xffc265 : printed ? 0x77efad : 0x568577);
    if (printing && !still) printerLamp.multiplyScalar(0.73 + Math.sin(gestureElapsed * 26) * 0.27);
    const feed = printed ? 1 : printing ? ease((gestureElapsed - 0.13) / 0.86) : 0;
    printout.position.z = 0.30 + feed * 0.32;
    printout.position.y = 1.36 - feed * 0.085;
    printout.rotation.x = 1.18 - feed * 0.58;

    if (currentMoment !== selectionMoment || stageChanged) {
      selectionMoment = currentMoment;
      const selected = currentMoment?.products?.filter(product => product.selected).map(product => product.id) ?? [];
      const added = selected.find(id => !previousSelection.includes(id));
      if (still || selected.length < previousSelection.length) transferSlot = -1;
      if (added && !still && selected.length <= packedCartons.length) {
        transferSlot = selected.length - 1;
        const stockIndex = visibleProducts.findIndex(product => product.id === added);
        const source = cartons[stockIndex]?.model;
        if (source) {
          source.getWorldPosition(shelfPosition);
          shelfPosition.y += 0.28;
          transferBand.material = surface(stockTints[stockIndex % stockTints.length]);
          packedCartons[transferSlot].getWorldPosition(trayPosition);
          transferStarted = time;
        } else {
          transferSlot = -1;
        }
      }
      previousSelection = selected;
    }
    const flight = (time - transferStarted) / 0.68;
    const transferring = atShelves && stage === 'picking' && transferSlot >= 0 && flight < 1 && !still;
    transferCarton.visible = transferring;
    if (transferring) {
      transferCarton.position.lerpVectors(shelfPosition, trayPosition, ease(flight));
      transferCarton.position.y += Math.sin(flight * Math.PI) * 0.64;
      transferCarton.rotation.set(0, flight * Math.PI, Math.sin(flight * Math.PI) * 0.24);
      technician.head.rotation.x = 0.18;
      technician.arms[1].shoulder.rotation.x -= 0.8 * Math.sin(flight * Math.PI);
    }
    packedCartons.forEach((carton, index) => {
      carton.visible = index < previousSelection.length && (!transferring || index !== transferSlot);
    });
    const trayMessage = gesture === 'basket-match' ? 'BASKET CHECKED'
      : gesture === 'basket-review' ? 'CHECK PRESCRIPTION'
        : previousSelection.length ? `${previousSelection.length} IN TRAY` : 'PICKING TRAY';
    if (trayMessage !== trayStatus) {
      trayStatus = trayMessage;
      trayDisplay?.(trayMessage);
    }

    const offered = handover ? ease((gestureElapsed - 0.03) / 0.7) : 0;
    const reach = offered * (1 - ease((gestureElapsed - 0.87) / 0.38));
    dispenser.arms[0].shoulder.rotation.x -= reach * 1.14;
    dispenser.body.position.z += reach * 0.19;
    dispenser.body.rotation.x += reach * 0.19;
    client.arms[0].shoulder.rotation.x -= offered * (departing && !still ? 0.14 : 0.79);
    client.arms[0].elbow.rotation.x -= offered * 0.49;
    bag.visible = activeStage === 'dispensing' && (client.actor.visible || !handover);
    bag.position.set(-0.37, 1.2 + Math.sin(offered * Math.PI) * 0.24, 0.24 + offered * 0.75);
    bag.rotation.z = 0;
    if (delivering && !still && inStage < 2.65) {
      const carry = 1 - ease((inStage - 2.13) / 0.52);
      technician.arms[1].elbow.rotation.x -= 0.72 * carry;
      technician.arms[1].hand.getWorldPosition(handPosition);
      handPosition.y -= 0.66;
      bag.position.lerp(dispensing.worldToLocal(handPosition), carry);
      bag.rotation.z = Math.sin(time * 13) * 0.09 * carry;
    }
    if (departing && !still) {
      client.arms[0].hand.getWorldPosition(handPosition);
      bag.position.lerp(dispensing.worldToLocal(handPosition), ease((gestureElapsed - 1.05) / 0.22));
      bag.position.y -= 0.67 * ease((gestureElapsed - 1.05) / 0.22);
      bag.rotation.z = Math.sin(time * 13) * 0.075;
    }
  }

  function hitsStationAction(raycaster: THREE.Raycaster, stage: GameStage) {
    const patient = patients.find(({ actor }) => actor.visible);
    const targets: THREE.Object3D[] = stage === 'receiving' ? [slip, ...(patient ? [patient.body] : [])]
      : stage === 'typing' ? [printer]
        : stage === 'dispensing' ? [bag, ...(patient ? [patient.body] : [])] : [];
    if (interactionRing.visible) targets.push(interactionRing);
    return raycaster.intersectObjects(targets.filter(target => target.visible), true).length > 0;
  }
  function dispose() {
    const geometries = new Set<THREE.BufferGeometry>();
    const surfaces = new Set<THREE.Material>();
    scene.traverse(object => {
      if (object instanceof THREE.Mesh) {
        geometries.add(object.geometry);
        surfaces.add(object.material);
      }
    });
    geometries.forEach(geometry => geometry.dispose());
    surfaces.forEach(material => {
      if (material instanceof THREE.MeshBasicMaterial) material.map?.dispose();
      material.dispose();
    });
  }

  return { animate, dispose, setProducts, setHoveredProduct, pickProduct, hitsStationAction };
}
