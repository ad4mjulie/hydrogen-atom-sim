
export const volumetricVert = `
varying vec3 vWorldPosition;
varying vec3 vLocalPosition;

void main() {
    vLocalPosition = position;
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const volumetricFrag = `
precision highp float;

varying vec3 vWorldPosition;
varying vec3 vLocalPosition;

uniform vec3 cameraPosition;
uniform float uTime;
uniform int uN;
uniform int uL;
uniform int uM;
uniform float uOpacity;
uniform float uStepSize;
uniform float uScale;

#define PI 3.14159265359

// --- Physics math in shader (Approximation for performance) ---

float factorial(int n) {
    float res = 1.0;
    for(int i = 2; i <= 20; i++) {
        if(i > n) break;
        res *= float(i);
    }
    return res;
}

// Simplified Laguerre for shader
float laguerre(int n, int alpha, float x) {
    if (n == 0) return 1.0;
    if (n == 1) return 1.0 + float(alpha) - x;
    
    float l_prev = 1.0;
    float l_curr = 1.0 + float(alpha) - x;
    
    for (int i = 1; i < 10; i++) {
        if(i >= n) break;
        float l_next = ((float(2 * i + alpha + 1) - x) * l_curr - float(i + alpha) * l_prev) / float(i + 1);
        l_prev = l_curr;
        l_curr = l_next;
    }
    return l_curr;
}

// Simplified Associated Legendre
float associatedLegendre(int l, int m, float x) {
    int absM = abs(m);
    if (absM > l) return 0.0;

    float pmm = 1.0;
    if (absM > 0) {
        float somx2 = sqrt(max(0.0, (1.0 - x) * (1.0 + x)));
        float fact = 1.0;
        for (int i = 1; i <= 10; i++) {
            if(i > absM) break;
            pmm *= -fact * somx2;
            fact += 2.0;
        }
    }

    if (l == absM) return pmm;

    float pmmp1 = x * float(2 * absM + 1) * pmm;
    if (l == absM + 1) return pmmp1;

    float pll = 0.0;
    for (int j = 2; j <= 10; j++) {
        int idx = absM + j;
        if(idx > l) break;
        pll = (x * float(2 * idx - 1) * pmmp1 - float(idx + absM - 1) * pmm) / float(idx - absM);
        pmm = pmmp1;
        pmmp1 = pll;
    }

    return pmmp1;
}

// Full Wavefunction Sampling
vec2 getWavefunction(vec3 p) {
    float r = length(p) * uScale;
    if (r < 0.0001) return vec2(0.0);
    
    float costheta = p.z / length(p);
    float phi = atan(p.y, p.x);
    
    // Radial part
    float rho = (2.0 * r) / float(uN);
    float normR = sqrt(pow(2.0/float(uN), 3.0) * (factorial(uN - uL - 1) / (2.0 * float(uN) * factorial(uN + uL))));
    float radial = normR * exp(-rho * 0.5) * pow(rho, float(uL)) * laguerre(uN - uL - 1, 2 * uL + 1, rho);
    
    // Angular part
    int absM = abs(uM);
    float normY = sqrt(((float(2 * uL + 1) / (4.0 * PI)) * (factorial(uL - absM) / factorial(uL + absM))));
    float legendre = associatedLegendre(uL, uM, costheta);
    
    float angularBase = normY * legendre;
    if (uM > 0 && (uM % 2 != 0)) angularBase = -angularBase;
    
    float phase = float(uM) * phi - uTime * (1.0 / pow(float(uN), 2.0));
    
    return radial * angularBase * vec2(cos(phase), sin(phase));
}

// Phase to HTML/HSL mapping
vec3 phaseToColor(float phase) {
    float h = fract((phase / (2.0 * PI)) + 0.5);
    // Simple hue shift
    vec3 col = 0.5 + 0.5 * cos(2.0 * PI * (h + vec3(0.0, 0.33, 0.67)));
    return col;
}

void main() {
    vec3 rayDir = normalize(vWorldPosition - cameraPosition);
    vec3 rayPos = vWorldPosition;
    
    vec4 finalColor = vec4(0.0);
    
    // Back-to-front or front-to-back?
    // For simple additive blending, front-to-back is easier
    
    vec3 rayStep = rayDir * uStepSize;
    vec3 rayLocalPos = vLocalPosition;
    
    for(int i = 0; i < 128; i++) {
        // Sample at current local position
        vec2 psi = getWavefunction(rayLocalPos);
        float prob = dot(psi, psi);
        float phase = atan(psi.y, psi.x);
        
        if (prob > 0.00001) {
            vec3 col = phaseToColor(phase);
            float alpha = prob * uOpacity * 10.0; // Boost visibility
            
            // Premultiplied alpha blending
            finalColor.rgb += (1.0 - finalColor.a) * col * alpha;
            finalColor.a += (1.0 - finalColor.a) * alpha;
        }
        
        if (finalColor.a >= 0.95) break;
        
        rayLocalPos += rayStep;
        
        // Exit if we leave the unit sphere
        if (length(rayLocalPos) > 1.0) break;
    }
    
    gl_FragColor = finalColor;
}
`;
