import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Vector3 } from 'three'

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

// Orange Sphere
const orangeSphereGeometry = new THREE.SphereGeometry(0.45, 32, 32)
const orangeSphereMaterial = new THREE.MeshBasicMaterial({ color: 0xF4961A })
const orangeSphereMesh = new THREE.Mesh(orangeSphereGeometry, orangeSphereMaterial)
orangeSphereMesh.position.set(-0.25, 0.25, 0)
orangeSphereMesh.scale.set(1, 1, 0.175)
scene.add(orangeSphereMesh)

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
scene.add(greySphereMesh1)
scene.add(greySphereMesh2)
scene.add(greySphereMesh3)

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
torus2.position.set(...greySphereMesh2.position)
torus3.position.set(...greySphereMesh3.position)
torus4.position.set(...greySphereMesh1.position)
scene.add( torus1 );
scene.add( torus2 )
scene.add( torus3 )
scene.add( torus4 )

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
scene.add( connector1 );
scene.add( connector2 );
scene.add( connector3 );

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
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()