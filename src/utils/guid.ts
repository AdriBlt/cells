import { v4 as uuidv4 } from 'uuid';

export function newGuid(): string {
    return uuidv4();
}
