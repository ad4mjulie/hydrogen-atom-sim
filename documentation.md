# Hydrogen Atom Simulation - Technical Documentation

## Overview
This simulation visualizes the electron probability distribution $|\psi|^2$ for a hydrogenic atom by solving the time-independent Schrödinger equation analytically and rendering the result using 3D volumetric raymarching.

## Physics & Mathematics

### The Schrödinger Equation
The simulation is based on the stationary states of the hydrogen atom Hamiltonian:
$$\hat{H}\psi = E\psi$$
where $\hat{H} = -\frac{\hbar^2}{2\mu}\nabla^2 - \frac{Ze^2}{4\pi\epsilon_0 r}$.

### Wavefunction Components
The wavefunction is separable into radial and angular parts:
$$\psi_{nlm}(r, \theta, \phi) = R_{nl}(r) Y_l^m(\theta, \phi)$$

1.  **Radial Part $R_{nl}(r)$**:
    Includes generalized Laguerre polynomials $L_{n-l-1}^{2l+1}(\rho)$.
2.  **Angular Part $Y_l^m(\theta, \phi)$**:
    Spherical harmonics composed of associated Legendre polynomials $P_l^m(\cos \theta)$ and complex phase $e^{im\phi}$.

### Phase Coloring
Complex values are visualized using the domain coloring technique:
- **Brightness**: Represents the probability density $|\psi|^2$.
- **Hue**: Maps to the phase $\arg(\psi)$ from $0$ to $2\pi$.

## Numerical Methods & Rendering

### Volumetric Raymarching
Due to the continuous nature of the electron cloud, standard polygonal rendering is insufficient. The simulation employs a custom **WebGL2 fragment shader** that:
1.  Casts a ray from the camera through a bounding sphere.
2.  Samples the analytic wavefunction at discrete steps along the ray.
3.  Accumulates color and alpha using premultiplied alpha blending based on the density.

### Performance Optimizations
- **Analytic Solutions**: Using mathematical formulas directly in the shader avoids expensive 3D texture lookups and allows for infinite resolution.
- **Simplified Recursion**: Shaders use optimized versions of the Laguerre and Legendre recurrence relations limited to $n=5$ to ensure 60FPS on modern GPUs.

## Interactivity instructions
- **n, l, m**: Change the principal, azimuthal, and magnetic quantum numbers to see different orbital shapes.
- **Scale**: Zoom in/out of the electron cloud.
- **Opacity/StepSize**: Adjust rendering quality vs performance.
