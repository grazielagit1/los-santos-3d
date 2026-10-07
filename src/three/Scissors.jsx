import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float, Sparkles } from './fx';
import * as THREE from 'three';
import Stage from './Stage';
import { scrollState } from '../lib/scroll';

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

// Lâmina + haste de uma metade da tesoura. `s` = 1 (de cima) ou -1 (espelhada)
function bladeGeometry(s) {
  const sh = new THREE.Shape();
  sh.moveTo(-0.85, -0.12 * s);
  sh.lineTo(-0.15, 0.03 * s);
  sh.quadraticCurveTo(1.0, 0.24 * s, 2.55, 0.02 * s);
  sh.lineTo(2.55, 0);
  sh.quadraticCurveTo(1.2, -0.06 * s, 0.0, -0.1 * s);
  sh.lineTo(-0.85, -0.28 * s);
  sh.closePath();
  const geo = new THREE.ExtrudeGeometry(sh, {
    depth: 0.05,
    bevelEnabled: true,
    bevelThickness: 0.015,
    bevelSize: 0.015,
    bevelSegments: 3,
    curveSegments: 32,
  });
  geo.translate(0, 0, -0.025);
  return geo;
}

function Half({ s, z, angleRef, cromo, cabo }) {
  const ref = useRef();
  const geo = useMemo(() => bladeGeometry(s), [s]);
  useFrame(() => {
    if (ref.current) ref.current.rotation.z = angleRef.current * s;
  });
  return (
    <group ref={ref} position-z={z}>
      <mesh geometry={geo} material={cromo} />
      <mesh position={[-1.17, -0.36 * s, 0]} material={cabo}>
        <torusGeometry args={[0.3, 0.075, 24, 64]} />
      </mesh>
    </group>
  );
}

function ScissorsModel() {
  const grupo = useRef();
  const abertura = useRef(0.2);
  const { size, viewport } = useThree();
  const mobile = size.width < 768;
  // no tablet/desktop, fica à direita e diminui conforme a largura disponível
  const lado = viewport.width * 0.27;
  const escala = Math.min(1, Math.max(0.6, viewport.width / 9));

  const cromo = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#f0f0f0', metalness: 0.9, roughness: 0.22, envMapIntensity: 1.6 }),
    []
  );
  const cabo = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#c91d26', roughness: 0.25, metalness: 0.1 }),
    []
  );

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    // "corta" duas vezes e descansa
    const ciclo = t % 2.4;
    const alvo = ciclo < 1.2 ? 0.06 + 0.3 * Math.abs(Math.sin(ciclo * Math.PI * 1.666)) : 0.36;
    abertura.current += (alvo - abertura.current) * (1 - Math.exp(-dt * 14));

    const g = grupo.current;
    const px = clamp(state.pointer.x, -1, 1);
    const py = clamp(state.pointer.y, -1, 1);
    const k = 1 - Math.exp(-dt * 4);
    g.rotation.y += (px * 0.5 - g.rotation.y) * k;
    g.rotation.x += (-py * 0.35 - g.rotation.x) * k;
    g.rotation.z = -0.55 + (scrollState.y / window.innerHeight) * 1.2;
  });

  return (
    <group position={[mobile ? 0.3 : lado + 0.4, mobile ? 0.5 : 0, 0]} scale={mobile ? 0.62 : 0.85 * escala}>
      <Float speed={1.6} rotationIntensity={0.2} floatIntensity={0.8}>
        <group ref={grupo}>
          <group position-x={-0.6}>
            <Half s={1} z={0.04} angleRef={abertura} cromo={cromo} cabo={cabo} />
            <Half s={-1} z={-0.04} angleRef={abertura} cromo={cromo} cabo={cabo} />
            {/* parafuso central */}
            <mesh rotation-x={Math.PI / 2} material={cromo}>
              <cylinderGeometry args={[0.09, 0.09, 0.2, 32]} />
            </mesh>
            <mesh position-z={0.105} material={cabo}>
              <circleGeometry args={[0.05, 32]} />
            </mesh>
          </group>
        </group>
      </Float>
      <Sparkles count={50} scale={[5, 4, 3]} size={2} speed={0.3} color="#c91d26" />
    </group>
  );
}

export default function ScissorsScene({ className }) {
  return (
    <Stage className={className} camera={{ position: [0, 0, 7], fov: 35 }}>
      <ScissorsModel />
    </Stage>
  );
}
