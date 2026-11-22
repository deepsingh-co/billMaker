import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const DISPLAY_FONT = '"Plus Jakarta Sans", "Segoe UI", sans-serif';
const BODY_FONT = '"Fira Sans", "Segoe UI", sans-serif';
const MONO_FONT = '"Fira Code", "Cascadia Code", Consolas, monospace';

function roundedShape(width, height, radius) {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;

  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);
  return shape;
}

function roundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

function drawBarcode(ctx, x, y, width, height, seed, color) {
  let value = seed;
  const random = () => {
    value = (value * 16807) % 2147483647;
    return value / 2147483647;
  };

  let cursor = x;
  ctx.fillStyle = color;
  while (cursor < x + width) {
    const barWidth = 2 + Math.floor(random() * 5);
    const barHeight = height * (0.62 + random() * 0.38);
    ctx.fillRect(cursor, y + height - barHeight, barWidth, barHeight);
    cursor += barWidth + 2 + Math.floor(random() * 5);
  }
}

function makeInvoiceTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 680;
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, 1024, 680);
  roundedRect(ctx, 0, 0, 1024, 680, 42);
  ctx.save();
  ctx.clip();

  const paper = ctx.createLinearGradient(0, 0, 0, 680);
  paper.addColorStop(0, "#ffffff");
  paper.addColorStop(0.55, "#f8fafc");
  paper.addColorStop(1, "#eef4fb");
  ctx.fillStyle = paper;
  ctx.fillRect(0, 0, 1024, 680);

  const glow = ctx.createRadialGradient(820, -80, 40, 820, -80, 440);
  glow.addColorStop(0, "rgba(14,165,233,0.12)");
  glow.addColorStop(1, "rgba(14,165,233,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, 1024, 680);

  const logo = ctx.createLinearGradient(58, 52, 114, 108);
  logo.addColorStop(0, "#38bdf8");
  logo.addColorStop(1, "#0284c7");
  ctx.fillStyle = logo;
  ctx.beginPath();
  ctx.arc(86, 80, 28, 0, Math.PI * 2);
  ctx.fill();
  drawBarcode(ctx, 73, 66, 26, 28, 37, "#ffffff");

  ctx.textBaseline = "middle";
  ctx.fillStyle = "#0f172a";
  ctx.font = `700 25px ${BODY_FONT}`;
  ctx.fillText("Barcode Suite", 128, 74);
  ctx.fillStyle = "#0284c7";
  ctx.font = `600 13px ${BODY_FONT}`;
  ctx.letterSpacing = "3px";
  ctx.fillText("RETAIL OS", 128, 99);
  ctx.letterSpacing = "0px";

  ctx.textAlign = "right";
  ctx.fillStyle = "#0f172a";
  ctx.font = `800 30px ${DISPLAY_FONT}`;
  ctx.fillText("INVOICE", 960, 60);
  ctx.fillStyle = "#64748b";
  ctx.font = `500 17px ${BODY_FONT}`;
  ctx.fillText("21 Nov 2026 · 6:42 PM", 960, 92);

  ctx.fillStyle = "#f97316";
  roundedRect(ctx, 852, 116, 108, 40, 12);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = `700 16px ${BODY_FONT}`;
  ctx.letterSpacing = "2px";
  ctx.textAlign = "center";
  ctx.fillText("PAID", 906, 137);
  ctx.letterSpacing = "0px";

  ctx.textAlign = "left";
  ctx.fillStyle = "#0f172a";
  ctx.font = `800 48px ${DISPLAY_FONT}`;
  ctx.fillText("#INV-2048", 64, 184);
  ctx.fillStyle = "#64748b";
  ctx.font = `500 17px ${BODY_FONT}`;
  ctx.fillText("Walk-in customer · Main Store", 64, 219);

  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(64, 252);
  ctx.lineTo(960, 252);
  ctx.stroke();

  ctx.fillStyle = "#94a3b8";
  ctx.font = `600 13px ${BODY_FONT}`;
  ctx.letterSpacing = "2px";
  ctx.fillText("ITEM", 64, 283);
  ctx.textAlign = "center";
  ctx.fillText("QTY", 850, 283);
  ctx.textAlign = "right";
  ctx.fillText("AMOUNT", 960, 283);
  ctx.letterSpacing = "0px";

  const rows = [
    ["Aashirvaad Atta 5kg", "1", "₹285.00"],
    ["Amul Butter 500g", "1", "₹265.00"],
  ];

  rows.forEach(([label, qty, amount], index) => {
    const y = 329 + index * 56;
    ctx.textAlign = "left";
    ctx.fillStyle = "#1e293b";
    ctx.font = `600 23px ${BODY_FONT}`;
    ctx.fillText(label, 64, y);
    ctx.fillStyle = "#94a3b8";
    ctx.font = `500 15px ${BODY_FONT}`;
    ctx.fillText(index === 0 ? "SKU 8901234567890" : "SKU 8901234567891", 64, y + 24);
    ctx.textAlign = "center";
    ctx.fillStyle = "#64748b";
    ctx.font = `500 19px ${BODY_FONT}`;
    ctx.fillText(qty, 850, y + 8);
    ctx.textAlign = "right";
    ctx.fillStyle = "#0f172a";
    ctx.font = `600 20px ${BODY_FONT}`;
    ctx.fillText(amount, 960, y + 8);
  });

  ctx.strokeStyle = "#e2e8f0";
  ctx.beginPath();
  ctx.moveTo(64, 428);
  ctx.lineTo(960, 428);
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  roundedRect(ctx, 64, 454, 562, 140, 16);
  ctx.fill();
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 2;
  ctx.stroke();
  drawBarcode(ctx, 92, 476, 506, 66, 83, "#0f172a");
  ctx.textAlign = "center";
  ctx.fillStyle = "#64748b";
  ctx.font = `600 16px ${MONO_FONT}`;
  ctx.letterSpacing = "3px";
  ctx.fillText("8901234567890", 345, 570);
  ctx.letterSpacing = "0px";

  ctx.textAlign = "right";
  ctx.fillStyle = "#94a3b8";
  ctx.font = `600 13px ${BODY_FONT}`;
  ctx.letterSpacing = "2px";
  ctx.fillText("TOTAL", 960, 490);
  ctx.letterSpacing = "0px";
  ctx.fillStyle = "#0f172a";
  ctx.font = `800 46px ${DISPLAY_FONT}`;
  ctx.fillText("₹550.00", 960, 536);
  ctx.fillStyle = "#94a3b8";
  ctx.font = `500 15px ${BODY_FONT}`;
  ctx.fillText("2 items · tax included", 960, 566);

  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(64, 622);
  ctx.lineTo(960, 622);
  ctx.stroke();

  ctx.textAlign = "left";
  ctx.fillStyle = "#94a3b8";
  ctx.font = `500 14px ${BODY_FONT}`;
  ctx.fillText("Thank you for shopping with Barcode Suite", 64, 648);
  ctx.textAlign = "right";
  ctx.fillStyle = "#0284c7";
  ctx.font = `600 14px ${MONO_FONT}`;
  ctx.fillText("barcode-suite.app", 960, 648);

  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function makeStatusTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 292;
  const ctx = canvas.getContext("2d");

  roundedRect(ctx, 0, 0, 512, 292, 28);
  const card = ctx.createLinearGradient(0, 0, 512, 292);
  card.addColorStop(0, "rgba(13,43,74,0.98)");
  card.addColorStop(1, "rgba(7,24,46,0.98)");
  ctx.fillStyle = card;
  ctx.fill();
  ctx.strokeStyle = "rgba(56,189,248,0.35)";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#34d399";
  ctx.beginPath();
  ctx.arc(42, 44, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#bae6fd";
  ctx.textBaseline = "middle";
  ctx.font = `600 13px ${BODY_FONT}`;
  ctx.letterSpacing = "2px";
  ctx.fillText("SCAN DETECTED", 60, 45);
  ctx.letterSpacing = "0px";

  drawBarcode(ctx, 408, 30, 66, 30, 53, "#7dd3fc");

  ctx.fillStyle = "#64748b";
  ctx.font = `500 15px ${BODY_FONT}`;
  ctx.fillText("Amul Butter 500g", 34, 100);
  ctx.textAlign = "right";
  ctx.fillStyle = "#f8fafc";
  ctx.font = `700 22px ${MONO_FONT}`;
  ctx.fillText("₹265.00", 478, 100);

  ctx.textAlign = "left";
  ctx.fillStyle = "#334155";
  ctx.font = `500 14px ${MONO_FONT}`;
  ctx.fillText("8901234567890", 34, 130);

  ctx.strokeStyle = "rgba(148,163,184,0.2)";
  ctx.beginPath();
  ctx.moveTo(34, 158);
  ctx.lineTo(478, 158);
  ctx.stroke();

  ctx.fillStyle = "#7dd3fc";
  ctx.font = `700 30px ${DISPLAY_FONT}`;
  ctx.fillText("₹550", 34, 202);
  ctx.fillStyle = "#94a3b8";
  ctx.font = `500 14px ${BODY_FONT}`;
  ctx.fillText("2 items · 0.4s lookup", 34, 232);

  ctx.fillStyle = "#10b981";
  roundedRect(ctx, 350, 186, 128, 32, 16);
  ctx.fill();
  ctx.fillStyle = "#ecfdf5";
  ctx.font = `700 13px ${BODY_FONT}`;
  ctx.textAlign = "center";
  ctx.fillText("INVOICED", 414, 203);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function makeOrbTexture(core, middle, edge) {
  const canvas = document.createElement("canvas");
  canvas.width = 192;
  canvas.height = 192;
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createRadialGradient(78, 68, 6, 96, 96, 92);

  gradient.addColorStop(0, core);
  gradient.addColorStop(0.45, middle);
  gradient.addColorStop(0.82, edge);
  gradient.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 192, 192);

  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.beginPath();
  ctx.ellipse(66, 52, 20, 12, -0.6, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function Orb({ position, size, core, middle, edge }) {
  const texture = useMemo(
    () => makeOrbTexture(core, middle, edge),
    [core, middle, edge]
  );

  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <mesh position={position}>
      <planeGeometry args={[size, size]} />
      <meshBasicMaterial
        map={texture}
        transparent
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

function ScanBeam() {
  const beam = useRef(null);

  useFrame((state) => {
    if (!beam.current) return;
    beam.current.position.y =
      -0.61 + Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
  });

  return (
    <group ref={beam} position={[-0.48, -0.61, 0.048]}>
      <mesh>
        <planeGeometry args={[1.82, 0.032]} />
        <meshBasicMaterial
          color="#0ea5e9"
          transparent
          opacity={0.95}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, 0, -0.001]}>
        <planeGeometry args={[1.82, 0.2]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.2}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[-0.9, 0, 0.001]}>
        <circleGeometry args={[0.03, 16]} />
        <meshBasicMaterial color="#0284c7" />
      </mesh>
      <mesh position={[0.9, 0, 0.001]}>
        <circleGeometry args={[0.03, 16]} />
        <meshBasicMaterial color="#0284c7" />
      </mesh>
    </group>
  );
}

function InvoiceCard() {
  const texture = useMemo(makeInvoiceTexture, []);
  const backing = useMemo(() => roundedShape(3.34, 2.24, 0.13), []);
  const card = useRef(null);

  useEffect(() => () => texture.dispose(), [texture]);

  useFrame((state) => {
    if (!card.current) return;
    const time = state.clock.elapsedTime;
    card.current.position.y = -0.05 + Math.sin(time * 1.1) * 0.035;
    card.current.rotation.x = 0.05 + Math.cos(time * 0.8) * 0.012;
    card.current.rotation.z = -0.012 + Math.sin(time * 0.6) * 0.006;
  });

  return (
    <group
      ref={card}
      position={[0.25, -0.05, 0]}
      rotation={[0.05, -0.16, -0.012]}
    >
      <mesh position={[0, 0, -0.035]}>
        <extrudeGeometry
          args={[backing, { depth: 0.07, bevelEnabled: false }]}
        />
        <meshBasicMaterial color="#dbe6f3" />
      </mesh>

      <mesh position={[0, 0, 0.036]}>
        <planeGeometry args={[3.3, 2.2]} />
        <meshBasicMaterial map={texture} transparent toneMapped={false} />
      </mesh>

      <ScanBeam />
    </group>
  );
}

function StatusChip() {
  const texture = useMemo(makeStatusTexture, []);
  const backing = useMemo(() => roundedShape(1.74, 1, 0.1), []);
  const chip = useRef(null);

  useEffect(() => () => texture.dispose(), [texture]);

  useFrame((state) => {
    if (!chip.current) return;
    const time = state.clock.elapsedTime;
    chip.current.position.y = 1.42 + Math.sin(time * 1.4) * 0.05;
    chip.current.rotation.x = 0.06 + Math.cos(time * 0.9) * 0.018;
    chip.current.rotation.z = -0.14 + Math.sin(time * 0.7) * 0.01;
  });

  return (
    <group
      ref={chip}
      position={[-1.62, 1.42, -1.05]}
      rotation={[0.06, 0.42, -0.14]}
    >
      <mesh position={[0, 0, -0.03]}>
        <extrudeGeometry
          args={[backing, { depth: 0.06, bevelEnabled: false }]}
        />
        <meshBasicMaterial color="#081a30" />
      </mesh>
      <mesh position={[0, 0, 0.031]}>
        <planeGeometry args={[1.7, 0.97]} />
        <meshBasicMaterial map={texture} transparent toneMapped={false} />
      </mesh>
    </group>
  );
}

function DecorativeOrb() {
  const orb = useRef(null);

  useFrame((state) => {
    if (!orb.current) return;
    orb.current.position.y =
      -1.15 + Math.sin(state.clock.elapsedTime * 0.9) * 0.08;
  });

  return (
    <group ref={orb} position={[2.0, -1.15, -0.4]}>
      <Orb
        position={[0, 0, 0]}
        size={0.62}
        core="#fdba74"
        middle="#f97316"
        edge="#c2410c"
      />
      <Orb
        position={[0.32, 0.34, 0.1]}
        size={0.22}
        core="#e0f2fe"
        middle="#38bdf8"
        edge="#0284c7"
      />
    </group>
  );
}

function Rings() {
  return (
    <group position={[1.95, 1.2, -1.7]}>
      <mesh rotation={[1.15, 0.25, 0.35]}>
        <torusGeometry args={[1.08, 0.014, 12, 90]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.45} />
      </mesh>
      <mesh rotation={[1.45, -0.35, -0.15]}>
        <torusGeometry args={[1.42, 0.01, 12, 90]} />
        <meshBasicMaterial color="#0ea5e9" transparent opacity={0.22} />
      </mesh>
    </group>
  );
}

function Particles({ count = 150 }) {
  const points = useRef(null);

  const positions = useMemo(() => {
    const values = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      values[index * 3] = (Math.random() - 0.5) * 9;
      values[index * 3 + 1] = (Math.random() - 0.5) * 5.4;
      values[index * 3 + 2] = -0.5 - Math.random() * 3.5;
    }
    return values;
  }, [count]);

  useFrame((state) => {
    if (!points.current) return;
    points.current.rotation.y = state.clock.elapsedTime * 0.035;
    points.current.rotation.z =
      Math.sin(state.clock.elapsedTime * 0.12) * 0.05;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.038}
        color="#7dd3fc"
        transparent
        opacity={0.65}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function SceneRig() {
  const rig = useRef(null);

  useFrame((state, delta) => {
    if (!rig.current) return;
    const targetX = -state.pointer.y * 0.1;
    const targetY = state.pointer.x * 0.18;
    rig.current.rotation.x = THREE.MathUtils.damp(
      rig.current.rotation.x,
      targetX,
      3,
      delta
    );
    rig.current.rotation.y = THREE.MathUtils.damp(
      rig.current.rotation.y,
      targetY,
      3,
      delta
    );
  });

  return (
    <group ref={rig}>
      <InvoiceCard />
      <StatusChip />
      <DecorativeOrb />
      <Rings />
      <Particles />
    </group>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      flat
      dpr={[1, 1.5]}
      camera={{ position: [0, 0.15, 7.6], fov: 42 }}
      gl={{
        antialias: true,
        alpha: true,
        stencil: false,
        powerPreference: "high-performance",
      }}
      style={{ touchAction: "pan-y" }}
      aria-hidden="true"
    >
      <SceneRig />
    </Canvas>
  );
}
