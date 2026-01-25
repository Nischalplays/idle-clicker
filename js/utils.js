export function objectLerp(a, b, t){
    return {
        x: a.x + (b.x - a.x) * t,
        y: a.y + (b.y - a.y) * t
    };
}

export function getPointOnCurve(p0, p1, p2, t){
    const a = objectLerp(p0, p1, t);
    const b = objectLerp(p1, p2, t);
    return objectLerp(a, b, t);
}