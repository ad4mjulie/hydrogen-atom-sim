# Quantum Hydrogen Atom Simulation

A physically accurate and visually realistic interactive 3D simulation of the hydrogen atom, built with modern web technologies. This project visualizes the electron probability density $\psi(x,y,z,t)$ using real quantum mechanical solutions to the Schrödinger equation.

## Features

- **Real Quantum Mechanics**: Uses the full analytic solutions for Hydrogen wavefunctions ($n, l, m$ states).
- **Volumetric Rendering**: Real-time 3D probability cloud visualized using volumetric raymarching.
- **Phase Coloring**: The complex phase of the wavefunction is mapped to the HSL color space.
- **Dynamic Controls**: Real-time adjustment of quantum numbers $(n, l, m)$, simulation scale, and opacity.
- **Time Evolution**: Stationary states evolve with the phase $e^{-iEt/\hbar}$.

## The Physics

The simulation implements the solution to the **Time-Dependent Schrödinger Equation (TDSE)** for a particle in a Coulomb potential:

$$i\hbar \frac{\partial}{\partial t} \Psi(\mathbf{r}, t) = \hat{H} \Psi(\mathbf{r}, t)$$

For the Hydrogen atom, the stationary states are given by:

$$\psi_{nlm}(r, \theta, \phi) = R_{nl}(r) Y_l^m(\theta, \phi)$$

- **Radial Part ($R_{nl}$)**: Defined using Generalized Laguerre Polynomials.
- **Angular Part ($Y_l^m$)**: Defined using Spherical Harmonics (Associated Legendre Polynomials).

## Tech Stack

- **Graphics**: [Three.js](https://threejs.org/)
- **Shaders**: Custom GLSL Volumetric Raymarching
- **Frontend**: Vite + React + TypeScript
- **UI**: [Tweakpane](https://cocopon.github.io/tweakpane/)

## Setup Instructions

1.  **Prerequisites**: Ensure you have [Node.js](https://nodejs.org/) installed.
2.  **Installation**:
    ```bash
    npm install
    ```
3.  **Development**:
    ```bash
    npm run dev
    ```
4.  **Build**:
    ```bash
    npm run build
    ```

## Project Structure

- `src/physics/`: Core math utility functions (Laguerre, Legendre) and wavefunction logic.
- `src/shaders/`: GLSL shaders for volumetric rendering.
- `src/visualizer.ts`: The main Three.js scene and rendering engine.
- `src/ui.ts`: Simulation control panel logic.
- `src/App.tsx`: Main React application entry point.

## Extending the Simulation

- **Superposition**: Modify `getWavefunction` in the shader to sum multiple states.
- **External Fields**: Add terms for the Stark effect (electric field) or Zeeman effect (magnetic field) to the potential.
- **WASM Support**: Offload complex radial calculations to Rust/WASM for even higher density grids.
