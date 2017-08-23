# three.ar.js API

## new THREE.ARReticle(vrDisplay, innerRadius, outerRadius, color, easing)

Creates a [THREE.Mesh] reticle to render via hit tests with the [VRDisplay].

### void THREE.ARReticle#update(x, y)

Performs a hit test at `x` and `y` normalized coordinates and lerps the reticle
to the position. Usually called every frame to perform a hit test and cause the reticle
to "trace" along surfaces for placing additional objects.

## new THREE.ARPerspectiveCamera(vrDisplay, fov, aspect, near, far)

A subclass of [THREE.PerspectiveCamera], used to create a perspective camera that matches
your device's perspective and keep the projection matrix in sync with a device. Use
this camera to render your three.js objects ontop of an AR see through camera. If a `vrDisplay`
is not provided, or not an AR-capable display, falls back to a regular [THREE.PerspectiveCamera]
with supplied values. Only the `projectionMatrix` is updated if using an AR-capable device,
and the `fov`, `aspect`, `near`, `far` properties are not applicable.

### void THREE.ARPerspectiveCamera#getProjectionMatrix()

If given a [VRDisplay] in constructor, generates the projection matrix from the API to match the native camera intrinsics. To use the cached projection matrix, just access the `projectionMatrix` property instead.

## THREE.ARUtils

Not a constructor but an object storing several utility functions listed below.

### Promise<VRDisplay?> THREE.ARUtils.getARDevice()

Returns a promise that resolves to a [VRDisplay] with AR capabilities or null if
device is unsupported.

### boolean THREE.ARUtils.isARDisplay(vrDisplay)

Takes a [VRDisplay] instance and returns a boolean whether or not this is considered an AR display. Will most likely be featured-based in the future.

### boolean THREE.ARUtils.isTango(vrDisplay)

Takes a [VRDisplay] instance and returns a boolean whether or not this is a Tango-backed Android device.

### boolean THREE.ARUtils.isARKit(vrDisplay)

Takes a [VRDisplay] instance and returns a boolean whether or not this is an ARKit-based iOS device.
### Promise<THREE.Mesh> THREE.ARUtils.loadBlocksModel(objPath, mtlPath?)

Takes a path for an OBJ model and optionally a path for an MTL texture and returns a promise resolving to a [THREE.Mesh] loaded with the appropriate material. Can be used on downloaded models from Blocks.

[VRDisplay]: https://developer.mozilla.org/en-US/docs/Web/API/VRDisplay
[THREE.WebGLRenderer]: https://threejs.org/docs/#api/renderers/WebGLRenderer
[THREE.PerspectiveCamera]: https://threejs.org/docs/#api/cameras/PerspectiveCamera
[THREE.Material]: https://threejs.org/docs/#api/materials/Material
[THREE.Mesh]: https://threejs.org/docs/#api/objects/Mesh
[THREE.BufferGeometry]: https://threejs.org/docs/#api/core/BufferGeometry
[THREE.Color]: https://threejs.org/docs/#api/math/Color