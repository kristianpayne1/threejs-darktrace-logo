import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Vector3 } from 'three'
import GUI from 'lil-gui'
import gsap from 'gsap'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color( 0x2B2A3A ); // UPDATED

/**
 * Objects
 */

const logo = new THREE.Group();

// Orange Sphere
const orangeSphereGeometry = new THREE.SphereGeometry(0.45, 32, 32)
const orangeSphereMaterial = new THREE.MeshBasicMaterial({ color: 0xF4961A })
const orangeSphereMesh = new THREE.Mesh(orangeSphereGeometry, orangeSphereMaterial)
orangeSphereMesh.position.set(-0.25, 0.25, 0)
orangeSphereMesh.scale.set(1, 1, 0.175)
logo.add(orangeSphereMesh)

// Grey Spheres
const greySphereGeometry = new THREE.SphereBufferGeometry(0.2, 16, 16)
const greySphereMaterial = new THREE.MeshBasicMaterial({ color: 0x9C99A2 })
const greySphereMesh1 = new THREE.Mesh(greySphereGeometry, greySphereMaterial)
const greySphereMesh2 = new THREE.Mesh(greySphereGeometry, greySphereMaterial)
const greySphereMesh3 = new THREE.Mesh(greySphereGeometry, greySphereMaterial)
greySphereMesh1.position.set(1.25, 1.25, 0)
greySphereMesh1.scale.set(1, 1, 0.3)
greySphereMesh2.scale.set(0.6, 0.6, 0.3)
greySphereMesh2.position.set(0.1, -1, 0)
greySphereMesh3.scale.set(0.35, 0.35, 0.25)
greySphereMesh3.position.set(-1, 1, 0)
logo.add(greySphereMesh1)
logo.add(greySphereMesh2)
logo.add(greySphereMesh3)

// Rings
const torusGeometry = new THREE.TorusGeometry( 0.65, 0.05, 32, 32 );
const torus2Geometry = new THREE.TorusGeometry( 0.225, 0.05, 32, 32 );
const torus3Geometry = new THREE.TorusGeometry( 0.17, 0.05, 32, 32 );
const torus4Geometry = new THREE.TorusGeometry( 0.35, 0.05, 32, 32 );
const trousMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff } );
const torus1 = new THREE.Mesh( torusGeometry, trousMaterial );
const torus2 = new THREE.Mesh( torus2Geometry, trousMaterial );
const torus3 = new THREE.Mesh( torus3Geometry, trousMaterial );
const torus4 = new THREE.Mesh( torus4Geometry, trousMaterial );
torus1.position.set(...orangeSphereMesh.position)
torus1.rotateZ(Math.PI * 0.725)
torus2.position.set(...greySphereMesh2.position)
torus3.position.set(...greySphereMesh3.position)
torus4.position.set(...greySphereMesh1.position)
logo.add( torus1 );
logo.add( torus2 )
logo.add( torus3 )
logo.add( torus4 )

// Connectors
const cylinderGeometry = new THREE.CylinderGeometry( 0.05, 0.05, 1, 32 );
const cylinderMaterial = new THREE.MeshBasicMaterial( {color: 0xffffff} );
const connector1 = new THREE.Mesh( cylinderGeometry, cylinderMaterial );
const connector2 = new THREE.Mesh( cylinderGeometry, cylinderMaterial );
const connector3 = new THREE.Mesh( cylinderGeometry, cylinderMaterial );
connector1.position.set(...new Vector3(-0.02, -0.6, 0))
connector1.rotation.z = Math.PI * 0.1
connector1.scale.set(1, 0.4, 1)
connector2.position.set(...new Vector3(-0.8, 0.8, 0))
connector2.rotation.z = Math.PI * 0.225
connector2.scale.set(1, 0.2, 1)
connector3.position.set(...new Vector3(0.65, 0.85, 0))
connector3.rotation.z = Math.PI * 0.7
connector3.scale.set(1, 0.8, 1)
logo.add( connector1 );
logo.add( connector2 );
logo.add( connector3 );

scene.add(logo);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Fullscreen
 */
window.addEventListener('dblclick', () =>
{
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement

    if(!fullscreenElement)
    {
        if(canvas.requestFullscreen)
        {
            canvas.requestFullscreen()
        }
        else if(canvas.webkitRequestFullscreen)
        {
            canvas.webkitRequestFullscreen()
        }
    }
    else
    {
        if(document.exitFullscreen)
        {
            document.exitFullscreen()
        }
        else if(document.webkitExitFullscreen)
        {
            document.webkitExitFullscreen()
        }
    }
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(85, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Custom animations
 */
const updateGeometry = (mesh, newGeometry) => {
    // must dispose geometry otherwise causes memory leak
    mesh.geometry.dispose();
    mesh.geometry = newGeometry;
}

const animateTorus = (torus, properties, arc) => {
    if (arc >= Math.PI * 2) return;
    const newArc = arc + (0.03 * deltaTime);
    const newGeometry = new THREE.TorusGeometry(...properties, newArc);
    updateGeometry(torus, newGeometry);
    window.requestAnimationFrame(() => animateTorus(torus, properties, newArc));
}

const animateCylinder = (cylinder, height, scale) => {
    if (height >= 1) return;
    const newHeight = height + (0.005 * deltaTime);
    const newGeometry = new THREE.CylinderGeometry(0.05, 0.05, newHeight, 32);
    updateGeometry(cylinder, newGeometry);
    // cylinder.position.set(...new Vector3(((newHeight * scale) / 2) + origin.x, ((-newHeight * scale) / 2) + origin.y, cylinder.position.z))
    window.requestAnimationFrame(() => animateCylinder(cylinder, newHeight, scale));
}

/*
 * GUI
 */
const gui = new GUI();
gui.add({
    Animate: () => {
        camera.position.set(0, 0, 5);
        logo.clear();
        // Animate small grey
        logo.add(greySphereMesh3);
        gsap.fromTo(greySphereMesh3.scale, {x: 0, y:0, z:0 }, { delay: 0.2, duration: 0.2, x: 0.35, y: 0.35, z: 0.25});
        gsap.to(greySphereMesh3.scale, { delay: 0.4, duration: 0.15, yoyo: true, repeat:1, x: 0.45, y: 0.45, z: 0.25});
        // Animate medium grey
        logo.add(greySphereMesh2);
        gsap.fromTo(greySphereMesh2.scale, { x: 0, y: 0, z: 0 }, { delay: 0.5, duration: 0.2, x: 0.6, y: 0.6, z: 0.3});
        gsap.to(greySphereMesh2.scale, { delay: 0.7, duration: 0.15, yoyo: true, repeat:1, x: 0.7, y: 0.7, z: 0.3});
        // Animate large grey
        logo.add(greySphereMesh1);
        gsap.fromTo(greySphereMesh1.scale, {x: 0, y:0, z:0 }, { delay: 0.8, duration: 0.2, x: 1, y: 1, z: 0.3});
        gsap.to(greySphereMesh1.scale, { delay: 1, duration: 0.15, yoyo: true, repeat:1, x: 1.1, y: 1.1, z: 0.3});
        // Animate center orange
        logo.add(orangeSphereMesh);
        gsap.fromTo(orangeSphereMesh.scale, {x: 0, y:0, z:0 }, { delay: 1.1, duration: 0.2, x: 1, y: 1, z: 0.175});
        gsap.to(orangeSphereMesh.scale, { delay: 1.3, duration: 0.15, yoyo: true, repeat:1, x: 1.1, y: 1.1, z: 0.175});
        // Animate small torus
        setTimeout(() => {
            logo.add(torus3);
            animateTorus(torus3, [0.17, 0.05, 32, 32], 0)
        }, 500);
        // Animate medium torus
        setTimeout(() => {
            logo.add(torus2);
            animateTorus(torus2, [0.225, 0.05, 32, 32], 0)
        }, 700);
        // Animate large torus
         setTimeout(() => {
            logo.add(torus4);
            animateTorus(torus4, [0.35, 0.05, 32, 32], 0)
        }, 1000);
         // Animate center torus
         setTimeout(() => {
            logo.add(torus1);
            animateTorus(torus1, [0.65, 0.05, 32, 32], 0)
        }, 1000);
        // Animate small connector
        setTimeout(() => {
            logo.add(connector2);
            animateCylinder(connector2, 0.001, connector2.scale.y);
        }, 750);
        // Animate medium connector
        setTimeout(() => {
            logo.add(connector1);
            animateCylinder(connector1, 0.001, connector1.scale.y);
        }, 750);
         // Animate large connector
         setTimeout(() => {
            logo.add(connector3);
            animateCylinder(connector3, 0.001, connector3.scale.y);
        }, 1100);
    }
}, 'Animate');


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
let time = Date.now()
let deltaTime = 0;
const tick = () =>
{
    // Time
    const currentTime = Date.now()
    deltaTime = currentTime - time
    time = currentTime
    
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()