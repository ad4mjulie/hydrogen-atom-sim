import { Pane } from 'tweakpane';

export function setupUI(visualizer: any) {
    const pane = new Pane({
        title: 'Hydrogen Atom Simulation',
        expanded: true,
    });

    const params = {
        n: 1,
        l: 0,
        m: 0,
        opacity: 0.5,
        scale: 10.0,
        stepSize: 0.05,
        rotate: true,
    };

    const quantumFolder = pane.addFolder({ title: 'Quantum Numbers' });

    const nBinding = quantumFolder.addBinding(params, 'n', { min: 1, max: 5, step: 1 });
    const lBinding = quantumFolder.addBinding(params, 'l', { min: 0, max: 0, step: 1 });
    const mBinding = quantumFolder.addBinding(params, 'm', { min: 0, max: 0, step: 1 });

    nBinding.on('change', (ev) => {
        // Update L max based on N
        const newN = ev.value;
        lBinding.controller_.binding.constraint.max = newN - 1;
        params.l = Math.min(params.l, newN - 1);
        lBinding.refresh();
        visualizer.updateState(params.n, params.l, params.m);
    });

    lBinding.on('change', (ev) => {
        // Update M range based on L
        const newL = ev.value;
        mBinding.controller_.binding.constraint.min = -newL;
        mBinding.controller_.binding.constraint.max = newL;
        params.m = Math.max(-newL, Math.min(newL, params.m));
        mBinding.refresh();
        visualizer.updateState(params.n, params.l, params.m);
    });

    mBinding.on('change', (ev) => {
        visualizer.updateState(params.n, params.l, params.m);
    });

    const renderFolder = pane.addFolder({ title: 'Rendering' });
    renderFolder.addBinding(params, 'opacity', { min: 0.01, max: 1.0 });
    renderFolder.addBinding(params, 'scale', { min: 1.0, max: 50.0 });
    renderFolder.addBinding(params, 'stepSize', { min: 0.01, max: 0.2 });

    pane.on('change', (ev) => {
        visualizer.updateUniforms(params);
    });

    return pane;
}
