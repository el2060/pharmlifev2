import * as THREE from 'three';
import type { SceneMoment, SceneProduct } from './shiftScene';
import type { GameStage } from '../types/game.types';

type Point = [number, number, number];
const colors = {
  pine: 0x22655b, jade: 0x72b4a1, dark: 0x142f34, light: 0xe9eee1,
  wall: 0xd5dfcc, floor: 0xdfdfce, oak: 0xc19164, paper: 0xfff6d9,
  sand: 0xead1a9, amber: 0xf6c76c, metal: 0x6c8d87, blue: 0x557e9b,
};

export const stationViews = {
  receiving: { target: [-4.2, 1.45, 0.55], marker: [-4.4, 1.42, 1.55], zoom: 3.9 },
  typing: { target: [-1.3, 1.5, -2.3], marker: [-0.55, 1.53, -1.95], zoom: 3.6 },
  picking: { target: [3.6, 1.6, -2.6], marker: [3.35, 2.1, -2.25], zoom: 3.6 },
  dispensing: { target: [4.7, 1.45, 1.05], marker: [5.50, 2.25, 2.34], zoom: 3.65 },
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
    paint.fillStyle = background;
    paint.fillRect(0, 0, canvas.width, canvas.height);
    paint.fillStyle = foreground;
    paint.textAlign = 'center';
    paint.textBaseline = 'middle';
    paint.font = `700 ${Math.floor(canvas.height * 0.46)}px sans-serif`;
    paint.fillText(text, canvas.width / 2, canvas.height / 2, canvas.width - 22);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(width, height), new THREE.MeshBasicMaterial({ map: texture }));
    panel.position.set(...position);
    parent.add(panel);
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
  for (const [x, z, length] of [[-4.4, 3.2, 2.4], [4.65, 3.2, 2.6], [-1.2, -0.5, 3.4], [3, -0.48, 2.7]]) {
    box(scene, [length, 0.009, 0.085], [x, 0.009, z], colors.jade);
  }

  const back = group(scene, [0, 0, -4.73]);
  box(back, [15.1, 1.04, 0.29], [0, 0.49, 0], colors.wall);
  box(back, [15.1, 0.88, 0.29], [0, 3.73, 0], colors.wall);
  box(back, [15.12, 0.16, 0.36], [0, 4.16, 0], colors.pine);
  for (const x of [-7.4, -4.6, -1.7, 1.15, 4.05, 7.4]) box(back, [0.22, 2.7, 0.28], [x, 2.21, 0], colors.wall);

  // Shophouse-height clinic windows overlook the nearby housing blocks and greenery.
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
  textPanel(wayfinding, [0, 0, 0], 2.28, 0.45, 'POLYCLINIC PHARMACY', '#21574f', '#fff2ce');

  function consoleDesk(x: number, z: number, width: number, frontColor: number) {
    const desk = group(scene, [x, 0, z]);
    contact(desk, 0, 0.15, width + 1.5, 2.2);
    box(desk, [width - 0.2, 1.08, 0.95], [0, 0.54, 0], frontColor);
    box(desk, [width, 0.15, 1.20], [0, 1.13, 0], colors.paper);
    box(desk, [width - 0.13, 0.105, 1.02], [0, 0.045, 0.025], colors.dark);
    for (let slat = 0; slat < Math.round(width * 5); slat++) {
      box(desk, [0.035, 0.93, 0.045], [-width / 2 + 0.15 + slat * 0.183, 0.54, 0.49], frontColor === colors.pine ? 0x3d8979 : 0x8ec0af);
    }
    box(desk, [width - 0.18, 0.045, 0.095], [0, 1.035, 0.507], colors.amber);
    return desk;
  }

  function monitor(desk: THREE.Group, x: number, z: number) {
    const terminal = group(desk, [x, 1.2, z]);
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

  const intake = consoleDesk(-4.45, 1.03, 3.9, colors.pine);
  textPanel(intake, [0, 0.63, 0.524], 2.45, 0.36, '01   PRESCRIPTION INTAKE', '#225e53', '#fff0c0');
  monitor(intake, -0.94, -0.15);
  const slip = envelope(intake, [0.18, 1.22, 0.37], colors.paper);
  envelope(intake, [0.74, 1.217, 0.23], 0xedc6c3).rotation.y = -0.23;

  const labels = consoleDesk(-1.26, -2.56, 3.25, colors.jade);
  textPanel(labels, [0, 0.62, 0.524], 2.15, 0.33, 'LABEL STATION', '#376e62', '#fff0c0');
  monitor(labels, -0.76, -0.1);
  box(labels, [0.68, 0.34, 0.48], [0.67, 1.38, 0], colors.light);
  box(labels, [0.59, 0.08, 0.5], [0.67, 1.53, 0], colors.dark);
  box(labels, [0.44, 0.047, 0.04], [0.67, 1.4, 0.255], colors.dark);
  const printout = envelope(labels, [0.67, 1.36, 0.30], colors.paper);
  printout.rotation.x = 1.18;
  box(labels, [0.055, 0.035, 0.025], [0.88, 1.48, 0.257], 0x59d097);
  envelope(labels, [-0.13, 1.215, 0.36], colors.paper);

  const stock = group(scene, [3.65, 0, -3.74]);
  contact(stock, 0, 0.5, 5.9, 2.5);
  box(stock, [5.4, 3.5, 0.13], [0, 1.74, -0.33], 0xa7ba9f);
  for (const x of [-2.67, -0.91, 0.91, 2.67]) box(stock, [0.115, 3.52, 0.81], [x, 1.74, 0], colors.oak);
  const stockDecor = group(stock, [0, 0, 0]);
  const stockTints = [0x70b190, 0xcf876e, 0xdda45f, 0x788bb4, 0x9d82a3, 0x5a9fb1];
  for (let shelf = 0; shelf < 4; shelf++) {
    const base = 0.23 + shelf * 0.79;
    box(stock, [5.4, 0.12, 0.90], [0, base, 0.043], colors.oak);
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
  textPanel(stock, [0, 3.54, -0.012], 3.6, 0.29, 'MEDICATION STORAGE', '#286557', '#fff0c0');
  const packing = consoleDesk(3.1, -1.67, 2.7, colors.jade);
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
  textPanel(dispensing, [0, 0.63, 0.524], 2.72, 0.36, '02   MEDICATION COLLECTION', '#225e53', '#fff0c0');
  monitor(dispensing, 0.99, -0.16);
  const bag = group(dispensing, [-0.37, 1.2, 0.24]);
  box(bag, [0.49, 0.65, 0.29], [0, 0.325, 0], colors.sand);
  box(bag, [0.32, 0.21, 0.012], [0, 0.36, 0.149], colors.paper);
  box(bag, [0.21, 0.027, 0.012], [0, 0.36, 0.158], colors.jade);
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.025, 8, 16, Math.PI), surface(colors.oak));
  handle.position.set(0, 0.65, 0);
  bag.add(handle);

  function chair(x: number, z: number) {
    const seat = group(scene, [x, 0, z]);
    contact(seat, 0, 0, 1.1, 0.92);
    box(seat, [0.80, 0.14, 0.66], [0, 0.46, 0], colors.blue);
    box(seat, [0.80, 0.50, 0.12], [0, 0.74, -0.288], colors.blue);
    for (const edge of [-0.32, 0.32]) box(seat, [0.055, 0.45, 0.45], [edge, 0.225, 0], colors.metal);
  }
  for (const x of [-6.68, -5.77, -4.86]) chair(x, -2.72);
  plant(-6.68, -3.72, 1.25);
  plant(6.68, 2.96, 1.6);
  plant(-6.76, 2.90, 0.87);

  function person(position: Point, scrubs: number, skin: number, hair: number, rotation: number, longHair = false) {
    const actor = group(scene, position);
    actor.rotation.y = rotation;
    contact(actor, 0, 0, 0.95, 0.86);
    for (const side of [-1, 1]) {
      ball(actor, [0.16, 0.44, 0.17], [side * 0.17, 0.51, 0], colors.dark);
      ball(actor, [0.16, 0.115, 0.235], [side * 0.17, 0.11, 0.064], colors.dark);
    }
    const body = group(actor, [0, 0.87, 0]);
    ball(body, [0.38, 0.52, 0.24], [0, 0.34, 0], scrubs);
    ball(body, [0.145, 0.20, 0.14], [0, 0.79, 0], skin);
    box(body, [0.105, 0.13, 0.024], [-0.19, 0.56, 0.219], colors.paper);
    const arms = [-1, 1].map(side => {
      const arm = group(body, [side * 0.32, 0.6, 0]);
      arm.rotation.z = side * 0.17;
      ball(arm, [0.13, 0.24, 0.14], [0, -0.13, 0], scrubs);
      ball(arm, [0.098, 0.215, 0.093], [0, -0.40, 0.028], skin);
      ball(arm, [0.09, 0.12, 0.092], [0, -0.54, 0.07], skin);
      return arm;
    });
    const head = group(body, [0, 1.0, 0.025]);
    ball(head, [0.29, 0.34, 0.27], [0, 0.12, 0], skin);
    ball(head, [0.30, 0.225, 0.27], [0, 0.27, -0.032], hair);
    if (longHair) ball(head, [0.26, 0.28, 0.21], [0, 0.01, -0.14], hair);
    ball(head, [0.145, 0.10, 0.062], [-0.12, 0.262, 0.183], hair).rotation.z = 0.26;
    for (const side of [-1, 1]) {
      ball(head, [0.044, 0.068, 0.047], [side * 0.28, 0.10, -0.016], skin);
      ball(head, [0.022, 0.03, 0.012], [side * 0.093, 0.123, 0.249], colors.dark);
    }
    ball(head, [0.046, 0.037, 0.049], [0, 0.073, 0.255], skin);
    const mouth = ball(head, [0.047, 0.011, 0.015], [0, 0.006, 0.252], 0x754842);
    return { actor, body, head, arms, mouth };
  }

  const pharmacist = person([-3.98, 0, -0.12], colors.pine, 0xd69f7b, 0x302b2d, 0.23, true);
  const technician = person([-0.42, 0, -1.52], 0x658caa, 0xa86c50, 0x252c2c, -2.4);
  const dispenser = person([4.26, 0, 0.09], colors.pine, 0xe5ae89, 0x3e3530, -0.35);
  const patientLooks = [
    { shirt: 0x9b684b, skin: 0xd7a483, hair: 0x5b5859 },
    { shirt: 0x596d94, skin: 0xb77c58, hair: 0x202b2a },
    { shirt: 0x9b684b, skin: 0xd7a483, hair: 0x5b5859 },
    { shirt: 0x95728c, skin: 0x9f684d, hair: 0x29252a },
  ];
  const patients = patientLooks.map(({ shirt, skin, hair }) => ({
    intake: person([-4.95, 0, 2.43], shirt, skin, hair, 1.92),
    collection: person([4.65, 0, 2.45], shirt, skin, hair, 2.02),
  }));

  const inventory = group(stock, [0, 0, 0]);
  let visibleProducts: SceneProduct[] = [];
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


  function animate(time: number, stage: PharmacyView, elapsed: number, moment: SceneMoment | undefined, gestureElapsed: number, caseNumber: number) {
    inventory.visible = stage === 'picking' && visibleProducts.length > 0;
    stockDecor.visible = !inventory.visible;
    const showIntake = stage === 'receiving' || stage === 'overview';
    const patient = patients[(Math.max(1, caseNumber) - 1) % patients.length];
    patients.forEach(({ intake, collection }) => {
      intake.actor.visible = intake === patient.intake && showIntake;
      collection.actor.visible = collection === patient.collection && stage === 'dispensing';
    });
    const { intake: client, collection: collectionClient } = patient;
    technician.actor.position.x = stage === 'picking' ? 2.12 : -0.42;
    technician.actor.position.z = stage === 'picking' ? -2.23 : -1.52;
    technician.actor.rotation.y = stage === 'picking' ? 0.4 : -2.4;
    const people = [pharmacist, technician, dispenser, client, collectionClient];
    const arrival = Math.max(0, 1 - elapsed / 0.85) ** 2;
    client.actor.position.z = 2.43 + arrival * 1.5;
    collectionClient.actor.position.z = 2.45 + arrival * 1.4;
    const gesture = moment?.stage === stage ? moment.gesture : undefined;
    const speaker = stage === 'dispensing' ? collectionClient : client;
    const speech = gesture === 'talk' && gestureElapsed < 3;
    const reassuringNod = gesture === 'nod' && gestureElapsed < 1.1;
    const concern = gesture === 'consider';
    const handover = gesture === 'handover';
    const handoverProgress = handover ? Math.min(gestureElapsed / 0.65, 1) : 0;
    const handoverEase = handoverProgress ** 2 * (3 - 2 * handoverProgress);
    people.forEach((person, index) => {
      const { body, head, arms, mouth } = person;
      const wave = Math.sin(time * 1.8 + index * 1.7);
      body.position.y = 0.87 + wave * 0.013;
      head.rotation.y = wave * 0.10;
      arms[0].rotation.x = index === 0 || index === 2 ? -0.43 + wave * 0.14 : wave * 0.06;
      arms[1].rotation.x = index === 1 ? -0.62 + wave * 0.11 : wave * 0.09;
      head.rotation.x = 0;
      head.rotation.z = 0;
      mouth.scale.y = 0.011;
      if (person === speaker) {
        if (speech && time) {
          head.rotation.y -= 0.2;
          mouth.scale.y += Math.abs(Math.sin(time * 11)) * 0.022;
          arms[1].rotation.x -= 0.27 + wave * 0.12;
        }
        if (reassuringNod && time) head.rotation.x = Math.sin(gestureElapsed * 12) * 0.20;
        if (concern) head.rotation.z = -0.11;
        if (handover) arms[0].rotation.x -= 0.72 * handoverEase;
      }
      if (person === technician && time && (gesture === 'pack' || gesture === 'print') && gestureElapsed < 0.65) {
        arms[1].rotation.x -= Math.sin(gestureElapsed / 0.65 * Math.PI) * 0.84;
      }
    });
    slip.position.y = 1.22 + arrival * (stage === 'receiving' ? 0.08 : 0);
    bag.position.z = 0.24 + handoverEase * 0.79;
    bag.position.y = 1.2 + Math.sin(handoverEase * Math.PI) * 0.22;
    bag.rotation.y = Math.sin(time * 1.4) * 0.032;
    printout.position.z = 0.30 + (gesture === 'print' ? Math.min(gestureElapsed, 0.88) * 0.33 : 0);
    packedCartons.forEach((carton, index) => {
      carton.visible = index < (moment?.cartons ?? 0);
      const level = 1.34 + Math.floor(index / 2) * 0.14;
      carton.position.y = carton.visible && index === (moment?.cartons ?? 0) - 1 && gestureElapsed < 0.38
        ? level + 0.47 * (1 - gestureElapsed / 0.38) ** 2
        : level;
    });
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

  return { animate, dispose, setProducts, pickProduct };
}
