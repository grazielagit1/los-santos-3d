import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Pequenos efeitos 3D feitos à mão (substituem o pacote drei, que pesava ~200 KB a mais).
 */

// Flutuação suave (sobe/desce e balança um pouco)
export function Float({ speed = 1, rotationIntensity = 0.2, floatIntensity = 0.6, children }) {
  const ref = useRef();
  const offset = useMemo(() => Math.random() * 1000, []);
  useFrame(({ clock }) => {
    const g = ref.current;
    if (!g) return;
    const t = (offset + clock.elapsedTime) * speed * 0.25;
    g.rotation.x = (Math.cos(t) / 8) * rotationIntensity;
    g.rotation.y = (Math.sin(t) / 8) * rotationIntensity;
    g.rotation.z = (Math.sin(t) / 20) * rotationIntensity;
    g.position.y = (Math.sin(t) / 10) * floatIntensity;
  });
  return <group ref={ref}>{children}</group>;
}

// Partículas brilhantes. Toda a animação roda na placa de vídeo (shader), sem custo de JavaScript por partícula.
const sparkVertex = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform vec3 uScale;
  uniform float uSpeed;
  attribute float aSeed;
  varying float vSeed;
  void main() {
    vec3 p = position;
    // sobe devagar e volta para baixo ao chegar no topo
    p.y = mod(p.y + uTime * uSpeed * (0.3 + aSeed * 0.7) + uScale.y * 0.5, uScale.y) - uScale.y * 0.5;
    p.x += sin(uTime * 0.6 + aSeed * 6.283) * 0.08;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPixelRatio * (0.5 + aSeed) * (8.0 / -mv.z);
    vSeed = aSeed;
  }
`;
const sparkFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uTime;
  varying float vSeed;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    float twinkle = 0.55 + 0.45 * sin(uTime * 2.0 + vSeed * 40.0);
    gl_FragColor = vec4(uColor, a * uOpacity * twinkle);
  }
`;

export function Sparkles({ count = 40, scale = [4, 4, 3], size = 2, speed = 0.3, color = '#ffffff', opacity = 1 }) {
  const { gl } = useThree();
  const [geometry, material] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * scale[0];
      pos[i * 3 + 1] = (Math.random() - 0.5) * scale[1];
      pos[i * 3 + 2] = (Math.random() - 0.5) * scale[2];
      seed[i] = Math.random();
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: size },
        uPixelRatio: { value: 1 },
        uScale: { value: new THREE.Vector3(...scale) },
        uSpeed: { value: speed },
        uColor: { value: new THREE.Color(color) },
        uOpacity: { value: opacity },
      },
      vertexShader: sparkVertex,
      fragmentShader: sparkFragment,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    return [geo, mat];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  useEffect(() => () => { geometry.dispose(); material.dispose(); }, [geometry, material]);

  useFrame(({ clock }) => {
    material.uniforms.uTime.value = clock.elapsedTime;
    material.uniforms.uPixelRatio.value = gl.getPixelRatio();
  });

  return <points geometry={geometry} material={material} frustumCulled={false} />;
}

/**
 * Reflexos de estúdio: monta uma "sala" com painéis de luz e gera o mapa de ambiente uma única vez.
 * É o que faz o cromo e o vidro brilharem, sem baixar nenhuma imagem HDR.
 */
export function StudioEnvironment() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const env = new THREE.Scene();
    env.background = new THREE.Color('#050505');
    const panel = (color, intensity, pos, rotY, sx, sy) => {
      const m = new THREE.Mesh(
        new THREE.PlaneGeometry(1, 1),
        new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(intensity), side: THREE.DoubleSide })
      );
      m.position.set(...pos);
      m.rotation.y = rotY;
      m.scale.set(sx, sy, 1);
      m.lookAt(0, 0, 0);
      env.add(m);
    };
    panel('#ffffff', 3, [0, 4, 4], 0, 10, 2);
    panel('#ffffff', 2, [-5, 0, 2], Math.PI / 2, 8, 3);
    panel('#c91d26', 4, [5, 0, 1], -Math.PI / 2, 8, 2);
    panel('#ffffff', 1.5, [0, -3, 3], 0, 3, 3);

    const pmrem = new THREE.PMREMGenerator(gl);
    const rt = pmrem.fromScene(env, 0.04);
    scene.environment = rt.texture;
    pmrem.dispose();
    env.traverse((o) => { o.geometry?.dispose(); o.material?.dispose(); });

    return () => {
      scene.environment = null;
      rt.dispose();
    };
  }, [gl, scene]);
  return null;
}

/**
 * Qualidade adaptativa: mede o FPS e baixa a resolução do 3D quando o aparelho não aguenta
 * (e sobe de novo quando sobra fôlego). Evita travadas em celulares mais simples.
 */
export function AdaptiveQuality({ min = 0.75, max = 2 }) {
  const { setDpr, gl } = useThree();
  const acc = useRef({ frames: 0, time: 0, dpr: Math.min(max, window.devicePixelRatio || 1), cooldown: 0 });

  useEffect(() => {
    setDpr(acc.current.dpr);
  }, [setDpr]);

  useFrame((_, dt) => {
    const a = acc.current;
    if (dt > 0.25) return; // ignora pausas (aba trocada, canvas fora da tela)
    a.frames++;
    a.time += dt;
    if (a.time < 1) return;
    const fps = a.frames / a.time;
    a.frames = 0;
    a.time = 0;
    if (a.cooldown > 0) { a.cooldown--; return; }
    let next = a.dpr;
    if (fps < 45 && a.dpr > min) next = Math.max(min, a.dpr - 0.25);
    else if (fps > 58 && a.dpr < max) next = Math.min(max, a.dpr + 0.25);
    if (next !== a.dpr) {
      a.dpr = next;
      a.cooldown = 2;
      setDpr(next);
      gl.domElement.dataset.dpr = String(next);
    }
  });
  return null;
}
