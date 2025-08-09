

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
