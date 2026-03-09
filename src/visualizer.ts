import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { volumetricVert, volumetricFrag } from './shaders/volumetricShaders';

export class WavefunctionVisualizer {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private material: THREE.ShaderMaterial;
    private mesh: THREE.Mesh;
    private clock: THREE.Clock;
    private controls: OrbitControls;

    constructor(container: HTMLElement) {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x050505);

        this.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        this.camera.position.z = 5;

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(this.renderer.domElement);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;

        this.clock = new THREE.Clock();

        this.material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uN: { value: 1 },
                uL: { value: 0 },
                uM: { value: 0 },
                uOpacity: { value: 0.8 },
                uStepSize: { value: 0.02 },
                uScale: { value: 8.0 }
            },
            vertexShader: volumetricVert,
            fragmentShader: volumetricFrag,
            transparent: true,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });

        // Bounding box for raymarching
        const geometry = new THREE.SphereGeometry(2, 32, 32);
        this.mesh = new THREE.Mesh(geometry, this.material);
        this.scene.add(this.mesh);

        window.addEventListener('resize', () => this.onResize(container));
    }

    private onResize(container: HTMLElement) {
        this.camera.aspect = container.clientWidth / container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(container.clientWidth, container.clientHeight);
    }

    public updateState(n: number, l: number, m: number) {
        this.material.uniforms.uN.value = n;
        this.material.uniforms.uL.value = l;
        this.material.uniforms.uM.value = m;
    }

    public updateUniforms(params: any) {
        Object.keys(params).forEach(key => {
            const uniformKey = 'u' + key.charAt(0).toUpperCase() + key.slice(1);
            if (this.material.uniforms[uniformKey]) {
                this.material.uniforms[uniformKey].value = params[key];
            } else if (this.material.uniforms[key]) {
                this.material.uniforms[key].value = params[key];
            }
        });
    }

    public animate() {
        requestAnimationFrame(() => this.animate());

        const delta = this.clock.getElapsedTime();
        this.material.uniforms.uTime.value = delta;

        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    public getRenderer() {
        return this.renderer;
    }

    public getCamera() {
        return this.camera;
    }
}
