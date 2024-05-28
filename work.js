import * as THREE from './lib/three.module.min.js';
import { OutlineEffect } from './lib/module/OutlineEffect.js';
import { MMDLoader } from './lib/module/MMDLoader.js';
import { MMDAnimationHelper } from './lib/module/MMDAnimationHelper.js';
var mesh, scene, renderer, effect, camera, loader, helper;
var clock = new THREE.Clock();
var run = false;
var _check = 0;
var fps = 0;
Ammo().then(function () {
    init();
    render();
});
function init() {
    const container = document.createElement('div');
    document.body.appendChild(container);
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    // scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.add(camera);
    var ambient = new THREE.AmbientLight(0xaaaaaa, 3);
    scene.add(ambient);
    var directionalLight = new THREE.DirectionalLight(0xdddddd, 3);
    directionalLight.position.set(- 1, 1, 1).normalize();
    scene.add(directionalLight);
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth * 1.5, window.innerHeight * 1.5);
    renderer.toneMapping = THREE.ACESFilmicToneMapping; //
    renderer.toneMappingExposure = 0.4; //
    container.appendChild(renderer.domElement);
    effect = new OutlineEffect(renderer);
    const modelFile = "lib/file/1/1.pmx";
    const vmdFiles = "lib/file/5.vmd";
    const cameraFiles = "lib/file/52.vmd";
    helper = new MMDAnimationHelper({ pmxAnimation: true });
    loader = new MMDLoader();
    loader.load("lib/file/bg1/1.pmx", function(m){
        scene.add(m);
    });
    loader.loadWithAnimation(modelFile, vmdFiles, function (mmd) {
        mesh = mmd.mesh;
        helper.add(mesh, {
            animation: mmd.animation,
            physics: true
        });
        loader.loadAnimation(cameraFiles, camera, function (cameraAnimation) {
            helper.add(camera, {
                animation: cameraAnimation
            });
            scene.add(mesh);
            run = true;
        });
    });
    window.addEventListener('resize', onWindowResize);
    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        effect.setSize(window.innerWidth * 1.5, window.innerHeight * 1.5);
    }
    setInterval(() => {
        fps = _check;
        _check = 0;
        document.querySelector(".info").innerText = `FPS: ${fps}`;
    }, 999);
}
function render() {
    _check++;
    requestAnimationFrame(render);
    if (!run) return;
    var t = clock.getDelta();
    helper.update(t);
    effect.render(scene, camera);


}
