// Find the latest version by visiting https://cdn.skypack.dev/three.

import * as THREE from 'https://cdn.skypack.dev/three@0.137.5';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
const raycaster = new THREE.Raycaster();

renderer.setSize (innerWidth,innerHeight);
// renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

new OrbitControls(camera, renderer.domElement);
camera.position.z=50;

const planeGeometry = new THREE. PlaneGeometry(400,400,50,50);
const material = new THREE. MeshPhongMaterial({ 
    side: THREE.DoubleSide,
    flatShading: THREE.FlatShading,
    vertexColors:true
});
const planeMesh = new THREE.Mesh(planeGeometry, material);
scene.add(planeMesh);

const {array} = planeMesh.geometry.attributes.position;
for (let i = 0; i < array.length; i++) {
    const x = array[i]
    const y = array[i+1]
    const z = array[i+2]
    array[i+2] = z + (Math.random() - 0.5) * 3
}
const color= []

for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
    color.push(0,0.19,0.4)
}
planeMesh.geometry.setAttribute('color', 
    new THREE.BufferAttribute(new Float32Array(color),3)
    )

const light = new THREE.DirectionalLight(0xffffff,1)
light.position.set(0,1,1)
scene.add(light)

const backLight = new THREE.DirectionalLight(0xffffff,1);
backLight.position.set(0,0,-1);
scene.add(backLight);

const mouse={
    x:undefined,
    y:undefined
}

function animate(){
    requestAnimationFrame(animate);
    renderer. render(scene,camera);
    raycaster.setFromCamera(mouse,camera)
    const intersect = raycaster.intersectObject(planeMesh)
    if(intersect.length > 0){
        const {color} = intersect[0].object.geometry.attributes

        intersect[0].object.geometry.attributes.color.needsUpdate = true

        const initialColor = {
            r: 0,
            g: 0.19,
            b: 0.4
        }
        const hoverColor = {
            r: 0.1,
            g: 0.5,
            b: 1
        }
        
        gsap.to(hoverColor,{
            r: initialColor.r,
            g: initialColor.g,
            b: initialColor.b,
            duration: 2,
            onUpdate: () => {
                //verticis 1
        color.setX(intersect[0].face.a , hoverColor.r)
        color.setY(intersect[0].face.a , hoverColor.g)
        color.setZ(intersect[0].face.a , hoverColor.b)
        //verticis 2
        color.setX(intersect[0].face.b , hoverColor.r)
        color.setY(intersect[0].face.b , hoverColor.g)
        color.setZ(intersect[0].face.b , hoverColor.b)
        //verticis 3
        color.setX(intersect[0].face.c , hoverColor.r)
        color.setY(intersect[0].face.c , hoverColor.g)
        color.setZ(intersect[0].face.c , hoverColor.b)
        color.needsUpdate = true
            }
        })
}
}
animate();

// Event listener

addEventListener('mousemove',(event) =>{
    mouse.x = (event.clientX / innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / innerHeight) * 2 + 1;
})

