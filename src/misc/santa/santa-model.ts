
export interface Guest {
    name: string;
    cannotGiftTo: string[];
}

export interface GiftAssignment {
    from: Guest;
    to: Guest;
}

export interface GiftAssignmentResult {
    from: string;
    to: string;
}
