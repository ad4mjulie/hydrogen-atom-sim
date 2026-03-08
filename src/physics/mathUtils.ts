/**
 * Factorial function n!
 */
export function factorial(n: number): number {
    if (n <= 1) return 1;
    let res = 1;
    for (let i = 2; i <= n; i++) res *= i;
    return res;
}

/**
 * Generalized Laguerre Polynomial L_n^alpha(x)
 * Recursive relation:
 * (n+1)L_{n+1}^a = (2n + a + 1 - x)L_n^a - (n+a)L_{n-1}^a
 */
export function laguerre(n: number, alpha: number, x: number): number {
    if (n === 0) return 1;
    if (n === 1) return 1 + alpha - x;
    
    let l_prev = 1;
    let l_curr = 1 + alpha - x;
    
    for (let i = 1; i < n; i++) {
        const l_next = ((2 * i + alpha + 1 - x) * l_curr - (i + alpha) * l_prev) / (i + 1);
        l_prev = l_curr;
        l_curr = l_next;
    }
    
    return l_curr;
}

/**
 * Associated Legendre Polynomial P_l^m(x)
 * Case m >= 0
 */
export function associatedLegendre(l: number, m: number, x: number): number {
    if (m < 0 || m > l || Math.abs(x) > 1.0) return 0;

    let pmm = 1.0;
    if (m > 0) {
        const somx2 = Math.sqrt((1.0 - x) * (1.0 + x));
        let fact = 1.0;
        for (let i = 1; i <= m; i++) {
            pmm *= -fact * somx2;
            fact += 2.0;
        }
    }

    if (l === m) return pmm;

    let pmmp1 = x * (2 * m + 1) * pmm;
    if (l === m + 1) return pmmp1;

    let pll = 0;
    for (let j = m + 2; j <= l; j++) {
        pll = (x * (2 * j - 1) * pmmp1 - (j + m - 1) * pmm) / (j - m);
        pmm = pmmp1;
        pmmp1 = pll;
    }

    return pmmp1;
}
