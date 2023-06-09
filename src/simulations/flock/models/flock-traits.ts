export interface FlockTraits {
  isTailVisible: boolean;
  maxForce: number;
  maxSpeed: number;
  separationPerceptionRadius: number;
  alignmentPerceptionRadius: number;
  cohesionPerceptionRadius: number;
  separationWeight: number;
  alignmentWeight: number;
  cohesionWeight: number;
  sigthLimit: number;
}
