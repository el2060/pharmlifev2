import * as THREE from 'three';
import { buildPharmacy, stationViews, type PharmacyView } from './pharmacyWorld';
import type { SceneMoment, SceneProduct } from './shiftScene';
import type { GameStage } from '../types/game.types';

interface ViewState {
  view: PharmacyView;
  deskInset: number;
  activeStage: GameStage;
  caseNumber: number;
  markers: Partial<Record<GameStage, HTMLButtonElement>>;
  ambient: boolean;
  rotationRequest: number;
  stationAction?: () => void;
  moment?: SceneMoment;
  choose: (id: string) => void;
}

export function mountPharmacy(host: HTMLElement, state: ViewState, onAvailable: (available: boolean) => void, onHoverProduct: (product: SceneProduct | undefined) => void) {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.04;
  const canvas = renderer.domElement;
  canvas.setAttribute('aria-hidden', 'true');
  host.append(canvas);

  const scene = new THREE.Scene();
  const world = buildPharmacy(scene);
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 120);
  const look = new THREE.Vector3();
  const offset = new THREE.Vector3();
  const goal = new THREE.Vector3();
  const goalOffset = new THREE.Vector3();
  const position = new THREE.Vector3();
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let view: PharmacyView | undefined;
  let caseNumber = -1;
  let zoom = 5;
  let inset = 0;
  let lastDeskInset = -1;
  let desiredZoom = 5;
  let angle = 0;
  let lastRotationRequest = state.rotationRequest;
  let width = 1;
  let height = 1;
  let lastFrame = 0;
  let gestureStarted = 0;
  let lastMoment: SceneMoment | undefined;
  let frame = 0;
  let visible = true;
  let lost = false;
  let firstFrame = true;
  let previousPointer: number | null = null;
  let startPointer: { x: number; y: number } | null = null;
  let lastProduct: SceneProduct | undefined;

  function updateView() {
    const viewWidth = Math.max(width - state.deskInset, width * 0.4);
    const overview = state.view === 'overview';
    const preset = overview ? null : stationViews[state.view as GameStage];
    goal.set(...(preset?.target ?? [0.05, 1.15, -0.15]));
    if (overview) {
      goalOffset.set(8.8, 12, 17.2);
      desiredZoom = Math.max(6.95, 9.4 * height / width);
    } else if (state.view === 'picking') {
      goalOffset.set(1.1, 2.7, 9.8);
      desiredZoom = Math.max(stationViews.picking.zoom, 3.18 * height / viewWidth);
    } else {
      goalOffset.set(4.6, state.view === 'dispensing' ? 4.3 : 5.1, 9.8);
      desiredZoom = Math.max(preset!.zoom, 3.2 * height / viewWidth);
    }
    const viewAngle = state.view === 'picking' ? angle * 0.46 : angle;
    goalOffset.applyAxisAngle(THREE.Object3D.DEFAULT_UP, viewAngle);
  }

  function projectMarkers() {
    for (const key of Object.keys(state.markers) as GameStage[]) {
      const marker = state.markers[key];
      if (!marker) continue;
      position.set(...stationViews[key].marker).project(camera);
      const visibleWidth = width - inset;
      const margin = Math.min(marker.offsetWidth / 2 + 10, visibleWidth / 2);
      const x = THREE.MathUtils.clamp((position.x + 1) * width / 2, margin, visibleWidth - margin);
      marker.style.setProperty('--marker-x', `${x}px`);
      marker.style.setProperty('--marker-y', `${THREE.MathUtils.clamp((1 - position.y) * 50, 17, 79)}%`);
    }
  }

  function draw(now: number, snap = false) {
    if (!visible || lost || width < 2 || height < 2) return;
    const changed = view !== state.view || caseNumber !== state.caseNumber;
    const rotated = state.rotationRequest !== lastRotationRequest;
    if (!snap && !changed && !rotated && state.moment === lastMoment && state.deskInset === lastDeskInset && reducedMotion.matches && !firstFrame) {
      projectMarkers();
      lastFrame = now;
      return;
    }
    if (changed) {
      view = state.view;
      caseNumber = state.caseNumber;
      angle = 0;
    }
    if (rotated) {
      lastRotationRequest = state.rotationRequest;
      angle = angle < -0.18 ? 0 : angle > 0.18 ? -0.43 : 0.43;
    }

    if (state.moment !== lastMoment) {
      gestureStarted = now;
      lastMoment = state.moment;
      world.setProducts(state.moment?.products ?? []);
      hover(undefined);
    }

    updateView();
    const still = reducedMotion.matches;
    const delta = Math.min((now - lastFrame) / 1000, 0.09);
    lastFrame = now;
    const blend = snap || still || firstFrame ? 1 : 1 - Math.exp(-6 * delta);
    look.lerp(goal, blend);
    offset.lerp(goalOffset, blend);
    zoom = THREE.MathUtils.lerp(zoom, desiredZoom, blend);
    lastDeskInset = state.deskInset;
    inset = THREE.MathUtils.lerp(inset, Math.min(state.deskInset, width * 0.6), blend);
    const aspect = width / height;
    const shift = zoom * inset / height;
    camera.left = -zoom * aspect + shift;
    camera.right = zoom * aspect + shift;
    camera.top = zoom;
    camera.bottom = -zoom;
    camera.position.copy(look).add(offset);
    camera.lookAt(look);
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
    world.animate(still ? 0 : now / 1000, state.view, state.moment, still ? 2 : (now - gestureStarted) / 1000, caseNumber, state.activeStage);
    renderer.render(scene, camera);

    projectMarkers();
    if (firstFrame) {
      firstFrame = false;
      onAvailable(true);
    }
  }

  function tick(now: number) {
    if (now - lastFrame >= 31) draw(now);
    frame = requestAnimationFrame(tick);
  }

  function resize() {
    width = host.clientWidth;
    height = host.clientHeight;
    renderer.setSize(width, height, false);
    draw(performance.now(), true);
  }

  const resizeObserver = new ResizeObserver(resize);
  const visibilityObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) draw(performance.now(), true);
  });
  reducedMotion.addEventListener('change', resize);
  resizeObserver.observe(host);
  visibilityObserver.observe(host);

  function aimAt(event: PointerEvent) {
    const bounds = canvas.getBoundingClientRect();
    const x = event.clientX - bounds.x;
    const y = event.clientY - bounds.y;
    pointer.set(x / bounds.width * 2 - 1, 1 - y / bounds.height * 2);
    host.style.setProperty('--stock-tip-x', `${THREE.MathUtils.clamp(x, 90, bounds.width - 90)}px`);
    host.style.setProperty('--stock-tip-y', `${y}px`);
    raycaster.setFromCamera(pointer, camera);
  }

  function interactionAt(event: PointerEvent) {
    if (state.view !== state.activeStage) return {};
    aimAt(event);
    const product = state.view === 'picking' ? world.pickProduct(raycaster) : undefined;
    const action = state.stationAction && world.hitsStationAction(raycaster, state.view) ? state.stationAction : undefined;
    return { product, action };
  }

  function hover(product: SceneProduct | undefined) {
    if (lastProduct === product) return;
    lastProduct = product;
    world.setHoveredProduct(product?.id);
    onHoverProduct(product);
  }

  const startDrag = (event: PointerEvent) => {
    if (state.ambient || event.button !== 0) return;
    previousPointer = event.clientX;
    startPointer = { x: event.clientX, y: event.clientY };
    canvas.setPointerCapture(event.pointerId);
  };
  const moveDrag = (event: PointerEvent) => {
    if (startPointer && previousPointer !== null && !reducedMotion.matches) {
      if (Math.abs(event.clientX - startPointer.x) > 5) canvas.classList.add('is-dragging');
      if (canvas.classList.contains('is-dragging')) {
        angle = THREE.MathUtils.clamp(angle - (event.clientX - previousPointer) * 0.006, -0.55, 0.62);
        canvas.classList.remove('is-over-interaction');
        hover(undefined);
      }
      previousPointer = event.clientX;
    } else if (event.pointerType === 'mouse') {
      const { product, action } = interactionAt(event);
      canvas.classList.toggle('is-over-interaction', Boolean(product || action));
      hover(product);
    }
  };
  const endDrag = (event: PointerEvent) => {
    if (startPointer && Math.hypot(startPointer.x - event.clientX, startPointer.y - event.clientY) < 7) {
      const { product, action } = interactionAt(event);
      if (product) state.choose(product.id);
      else action?.();
    }
  };
  const stopDrag = () => {
    previousPointer = null;
    startPointer = null;
    canvas.classList.remove('is-dragging');
  };
  const leaveStock = () => {
    canvas.classList.remove('is-over-interaction');
    hover(undefined);
  };
  const contextLost = (event: Event) => {
    event.preventDefault();
    lost = true;
    onAvailable(false);
  };
  const contextRestored = () => {
    lost = false;
    draw(performance.now(), true);
    onAvailable(true);
  };

  canvas.addEventListener('pointerdown', startDrag);
  canvas.addEventListener('pointermove', moveDrag);
  canvas.addEventListener('pointerup', endDrag);
  canvas.addEventListener('pointerleave', leaveStock);
  canvas.addEventListener('lostpointercapture', stopDrag);
  canvas.addEventListener('webglcontextlost', contextLost);
  canvas.addEventListener('webglcontextrestored', contextRestored);
  resize();
  frame = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(frame);
    reducedMotion.removeEventListener('change', resize);
    resizeObserver.disconnect();
    visibilityObserver.disconnect();
    canvas.removeEventListener('pointerdown', startDrag);
    canvas.removeEventListener('pointermove', moveDrag);
    canvas.removeEventListener('pointerup', endDrag);
    canvas.removeEventListener('pointerleave', leaveStock);
    canvas.removeEventListener('lostpointercapture', stopDrag);
    canvas.removeEventListener('webglcontextlost', contextLost);
    canvas.removeEventListener('webglcontextrestored', contextRestored);
    world.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
    canvas.remove();
  };
}
