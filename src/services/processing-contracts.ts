export interface MouseWheelEvent {
    delta: number;
}

export function isMouseWheelEvent(event: object | undefined): event is MouseWheelEvent {
    return !!event && 'delta' in event;
}