import { factorial, laguerre, associatedLegendre } from './mathUtils';

const A0 = 1.0; // Bohr radius in simulation units

/**
 * Radial part of the wavefunction R_{nl}(r)
 */
export function radialWavefunction(n: number, l: number, r: number): number {
    const rho = (2 * r) / (n * A0);
    const norm = Math.sqrt(
        Math.pow(2 / (n * A0), 3) *
        (factorial(n - l - 1) / (2 * n * factorial(n + l)))
    );

    return norm * Math.exp(-rho / 2) * Math.pow(rho, l) * laguerre(n - l - 1, 2 * l + 1, rho);
}

/**
 * Complex type for wavefunction values
 */
export interface Complex {
    re: number;
    im: number;
}

/**
 * Angular part of the wavefunction Y_l^m(theta, phi)
 */
export function sphericalHarmonic(l: number, m: number, theta: number, phi: number): Complex {
    const absM = Math.abs(m);

    const norm = Math.sqrt(
        ((2 * l + 1) / (4 * Math.PI)) *
        (factorial(l - absM) / factorial(l + absM))
    );

    const legendre = associatedLegendre(l, absM, Math.cos(theta));

    // Y_l^m = (-1)^m * sqrt(...) * P_l^m(cos theta) * e^(i m phi) for m >= 0
    // For m < 0: Y_l^m = (-1)^|m| * (Y_l^|m|)*

    let val = norm * legendre;
    if (m > 0 && m % 2 !== 0) {
        val = -val;
    }

    const re = val * Math.cos(m * phi);
    const im = val * Math.sin(m * phi);

    return { re, im };
}

/**
 * Full wavefunction psi_{nlm}(r, theta, phi)
 */
export function hydrogenWavefunction(n: number, l: number, m: number, r: number, theta: number, phi: number): Complex {
    const rPart = radialWavefunction(n, l, r);
    const angularPart = sphericalHarmonic(l, m, theta, phi);

    return {
        re: rPart * angularPart.re,
        im: rPart * angularPart.im
    };
}
