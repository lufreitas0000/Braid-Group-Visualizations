/**
 * Reidemeister Move Type III Animation (Smoothed Interpolation)
 * This version uses the user's corrected data and implements a sophisticated
 * animation technique where the x-coordinate interpolation is smoothed
 * independently from the linear y-coordinate time flow.
 */

// --- CONFIGURATION MODULE ---
const config = {
    canvas: {
        baseWidth: 400,
        aspectRatio: 3 / 4,
        backgroundColor: 'oklch(95.27% 0.01 240)',
    },
    braid: {
        colors: ['#2980b9', '#c0392b', '#27ae60'], // 0:Blue, 1:Red, 2:Green
        thickness: 12,
        casingThickness: 20,
        paddingY: 50,
        xPositions: [100, 200, 300],
    }
};

// --- UTILITY FUNCTIONS ---
const lerp = (a, b, t) => a * (1 - t) + b * t;

// This new version of lerpPoint allows for different timing on x and y axes.
const lerpPointAdvanced = (p1, p2, t_x, t_y) => ({
    x: lerp(p1.x, p2.x, t_x),
    y: lerp(p1.y, p2.y, t_y)
});

// Creates "boxier" curves for a crisp, correct look at all times.
function createBoxyPathFromPoints(points) {
    const path = [];
    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i];
        const p1 = points[i + 1];
        const cp1 = { x: p0.x, y: p0.y + (p1.y - p0.y) * 0.5 };
        const cp2 = { x: p1.x, y: p1.y - (p1.y - p0.y) * 0.5 };
        path.push({ start: p0, cp1: cp1, cp2: cp2, end: p1 });
    }
    return path;
}

// Generates waypoints from an abstract list of x-indices.
function generateWaypointsFromAbstractList(abstractList, xPositions, yStart, yEnd) {
    const pointsPerStrand = abstractList[0].length;
    const yStep = (yEnd - yStart) / (pointsPerStrand - 1);
    return abstractList.map(strandXIndices =>
        strandXIndices.map((xIndex, pointIndex) => ({
            x: xPositions[xIndex],
            y: yStart + pointIndex * yStep
        }))
    );
}

/**
 * --- MAIN APPLICATION MODULE ---
 */
const App = {
    state: { t: 0 },

    canvas: {
        element: null, ctx: null, width: 0, height: 0, dpi: window.devicePixelRatio || 1,
        setup() {
            this.element = document.getElementById('braid-canvas');
            this.ctx = this.element.getContext('2d');
            this.resize();
            window.addEventListener('resize', () => {
                this.resize();
                App.braid.setup();
                App.draw();
            });
        },
        resize() {
            const cssWidth = this.element.clientWidth;
            const cssHeight = cssWidth / config.canvas.aspectRatio;
            this.element.width = cssWidth * this.dpi;
            this.element.height = cssHeight * this.dpi;
            this.element.style.width = `${cssWidth}px`;
            this.element.style.height = `${cssHeight}px`;
            this.width = cssWidth;
            this.height = cssHeight;
            this.ctx.setTransform(1, 0, 0, 1, 0, 0);
            this.ctx.scale(this.dpi, this.dpi);
        },
        clear() {
            this.ctx.fillStyle = config.canvas.backgroundColor;
            this.ctx.fillRect(0, 0, this.width, this.height);
        }
    },

    braid: {
        strands_t0: [],
        strands_t1: [],

        setup() {
            const { paddingY, xPositions } = config.braid;
            const H = App.canvas.height;
            const W = App.canvas.width;
            const scaleFactor = W / config.canvas.baseWidth;
            const scaledXPositions = xPositions.map(x => x * scaleFactor);
            const y_start = paddingY;
            const y_end = H - paddingY;

            // --- CORRECTED abstract lists of x-indices ---
            const list_waypoints_t0 = [
                // Blue: 0 -> 2
                [0, 0, 1, 1, 2, 2, 2, 2],
                // Red: 1 -> 1
                [1, 1, 0, 0, 0, 0, 1, 1],
                // Green: 2 -> 0 (User's corrected version)
                [2, 2, 2, 2, 1, 1, 0, 0],
            ];
            
            const list_waypoints_t1 = [
                // Blue: 0 -> 2
                [0, 0, 0, 0, 1, 1, 2, 2],
                // Red: 1 -> 1
                [1, 1, 2, 2, 2, 2, 1, 1],
                // Green: 2 -> 0
                [2, 2, 1, 1, 0, 0, 0, 0],
            ];

            const waypoints_t0 = generateWaypointsFromAbstractList(list_waypoints_t0, scaledXPositions, y_start, y_end);
            const waypoints_t1 = generateWaypointsFromAbstractList(list_waypoints_t1, scaledXPositions, y_start, y_end);

            this.strands_t0 = waypoints_t0.map(points => createBoxyPathFromPoints(points));
            this.strands_t1 = waypoints_t1.map(points => createBoxyPathFromPoints(points));
        },
        
        drawEntireStrand(ctx, strandPath, color, thickness) {
            if (!strandPath || strandPath.length === 0) return;
            ctx.beginPath();
            ctx.moveTo(strandPath[0].start.x, strandPath[0].start.y);
            strandPath.forEach(segment => {
                ctx.bezierCurveTo(segment.cp1.x, segment.cp1.y, segment.cp2.x, segment.cp2.y, segment.end.x, segment.end.y);
            });
            ctx.strokeStyle = color;
            ctx.lineWidth = thickness;
            ctx.lineCap = 'round';
            ctx.stroke();
        },

        draw(ctx, t) {
            const drawOrder = [2, 1, 0]; // Green -> Red -> Blue

            // --- Apply smoothing to the x-interpolation timing ---
            // This is a standard "Smoothstep" function.
            const smoothT = t * t * (3 - 2 * t);

            const currentStrands = this.strands_t0.map((strand_t0, i) => {
                const strand_t1 = this.strands_t1[i];
                return strand_t0.map((seg_t0, j) => {
                    const seg_t1 = strand_t1[j];
                    // Use the advanced lerp function: smooth for x, linear for y.
                    return {
                        start: lerpPointAdvanced(seg_t0.start, seg_t1.start, smoothT, t),
                        end:   lerpPointAdvanced(seg_t0.end, seg_t1.end, smoothT, t),
                        cp1:   lerpPointAdvanced(seg_t0.cp1, seg_t1.cp1, smoothT, t),
                        cp2:   lerpPointAdvanced(seg_t0.cp2, seg_t1.cp2, smoothT, t),
                    };
                });
            });

            drawOrder.forEach((strandIndex, i) => {
                const strandPath = currentStrands[strandIndex];
                const useCasing = i > 0;
                if (useCasing) {
                    this.drawEntireStrand(ctx, strandPath, config.canvas.backgroundColor, config.braid.casingThickness);
                }
                this.drawEntireStrand(ctx, strandPath, config.braid.colors[strandIndex], config.braid.thickness);
            });
        }
    },

    init() {
        this.canvas.setup();
        this.braid.setup();
        const slider = document.getElementById('t-slider');
        slider.addEventListener('input', (e) => {
            this.state.t = parseFloat(e.target.value);
            this.draw();
        });
        this.draw();
    },

    draw() {
        this.canvas.clear();
        this.braid.draw(this.canvas.ctx, this.state.t);
    },
};

document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
