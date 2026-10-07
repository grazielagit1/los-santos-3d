import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float, Sparkles } from './fx';
import * as THREE from 'three';
import Stage from './Stage';
import { scrollState } from '../lib/scroll';

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

// Rótulo desenhado num canvas (espera as fontes carregarem para não sair com fonte padrão)
function useLabelTexture() {
  const tex = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 1024;
    c.height = 512;
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }, []);

  useEffect(() => {
    const draw = () => {
      const c = tex.image;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#f2eee6';
      ctx.fillRect(0, 0, 1024, 512);
      ctx.fillStyle = '#c91d26';
      ctx.fillRect(0, 0, 1024, 26);
      ctx.fillRect(0, 486, 1024, 26);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#0b0b0b';
      ctx.font = '600 30px "Inter Variable", sans-serif';
      ctx.fillText('B A R B E A R I A', 512, 110);
      ctx.font = '150px Anton, Impact, sans-serif';
      ctx.fillText('LOS SANTOS', 512, 270);
      ctx.fillStyle = '#c91d26';
      ctx.font = 'italic 800 80px "Playfair Display", Georgia, serif';
      ctx.fillText('Shampoo', 512, 370);
      ctx.fillStyle = '#555';
      ctx.font = '500 28px "Inter Variable", sans-serif';
      ctx.fillText('100% ORGÂNICO  ·  CABELO & BARBA  ·  250 ML', 512, 440);
      tex.needsUpdate = true;
    };
    draw();
    document.fonts?.ready.then(draw);
  }, [tex]);

  return tex;
}

function BottleModel() {
  const grupo = useRef();
  const anel = useRef();
  const label = useLabelTexture();
  const { size, viewport } = useThree();
  const mobile = size.width < 768;
  // no tablet/desktop, fica à direita e diminui conforme a largura disponível
  const lado = viewport.width * 0.27;
  const escala = Math.min(1, Math.max(0.6, viewport.width / 9));

  const perfil = useMemo(
    () =>
      [
        [0, -1.4], [0.6, -1.4], [0.7, -1.32], [0.72, -1.15], [0.72, 0.75],
        [0.68, 1.0], [0.48, 1.22], [0.3, 1.32], [0.28, 1.5], [0, 1.5],
      ].map(([x, y]) => new THREE.Vector2(x, y)),
    []
  );

  useFrame((state, dt) => {
    const g = grupo.current;
    const px = clamp(state.pointer.x, -1, 1);
    const py = clamp(state.pointer.y, -1, 1);
    const k = 1 - Math.exp(-dt * 4);
    const s = scrollState.y / window.innerHeight;
    // gira devagar sozinho + desvio suave pelo mouse e pela rolagem
    const u = g.userData;
    u.base = (u.base || 0) + dt * 0.35;
    u.desvio = (u.desvio || 0) + (px * 0.6 + s * 2 - (u.desvio || 0)) * k;
    g.rotation.y = u.base + u.desvio;
    g.rotation.x += (-py * 0.2 - g.rotation.x) * k;
    anel.current.rotation.x = state.clock.elapsedTime * 0.4;
    anel.current.rotation.y = state.clock.elapsedTime * 0.25;
  });

  return (
    <group position={[mobile ? 0 : lado, mobile ? 0.5 : -0.1, 0]} scale={mobile ? 0.75 : escala}>
      <Float speed={1.5} rotationIntensity={0.25} floatIntensity={0.7}>
        <group ref={grupo} rotation-z={0.12}>
          {/* frasco */}
          <mesh>
            <latheGeometry args={[perfil, 64]} />
            <meshStandardMaterial color="#0d0d0d" roughness={0.12} metalness={0.35} envMapIntensity={1.6} />
          </mesh>
          {/* rótulo na frente */}
          <mesh position-y={-0.25}>
            <cylinderGeometry args={[0.726, 0.726, 1.25, 96, 1, true, -Math.PI * 0.6, Math.PI * 1.2]} />
            <meshStandardMaterial map={label} roughness={0.6} />
          </mesh>
          {/* tampa */}
          <mesh position-y={1.78}>
            <cylinderGeometry args={[0.33, 0.33, 0.56, 64]} />
            <meshStandardMaterial color="#c91d26" roughness={0.25} metalness={0.1} />
          </mesh>
          <mesh position-y={1.52}>
            <cylinderGeometry args={[0.35, 0.35, 0.06, 64]} />
            <meshStandardMaterial color="#dddddd" metalness={1} roughness={0.12} />
          </mesh>
        </group>
      </Float>
      <mesh ref={anel} scale={1.25}>
        <torusGeometry args={[1.9, 0.015, 16, 160]} />
        <meshStandardMaterial color="#cccccc" metalness={1} roughness={0.15} />
      </mesh>
      <Sparkles count={50} scale={[5, 5, 3]} size={2} speed={0.3} color="#c91d26" />
    </group>
  );
}

export default function BottleScene({ className }) {
  return (
    <Stage className={className} camera={{ position: [0, 0, 8], fov: 35 }}>
      <BottleModel />
    </Stage>
  );
}
