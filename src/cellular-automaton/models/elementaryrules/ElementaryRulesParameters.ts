import { AutomatonCell } from "../AutomatonCell";
import { AutomatonParameters } from "../AutomatonParameters";
import { BorderCells } from "../BorderCells";
import { ElementaryRulesCell } from "./ElementaryRulesCell";
import {
  ElementaryRulesState,
  ElementaryRulesType,
  getElementaryRulesType,
} from "./ElementaryRulesType";

export class ElementaryRulesParameters extends AutomatonParameters {
  private binaryRule: boolean[];
  private rule: number;

  constructor(
    border: BorderCells = BorderCells.Torus,
    ruleNumber: number = 30
  ) {
    super(border);
    this.rule = ruleNumber;
    this.binaryRule = [];
    this.updateBinaryRules();
  }

  public updateBinary(index: number): void {
    if (0 <= index && index < this.binaryRule.length) {
      const bool = this.binaryRule[index];
      this.binaryRule[index] = !bool;
      if (bool) {
        this.rule -= Math.pow(2, index);
      } else {
        this.rule += Math.pow(2, index);
      }
    }
  }

  public getBinaryRule(index: number): boolean {
    if (0 <= index && index < this.binaryRule.length) {
      return this.binaryRule[index];
    }
    return false;
  }

  public getRuleNumber(): number {
    return this.rule;
  }

  public getType(cell: AutomatonCell): ElementaryRulesType {
    if (cell instanceof ElementaryRulesCell) {
      return getElementaryRulesType(
        (cell as ElementaryRulesCell).getCurrentStatus()
      );
    }
    return new ElementaryRulesType(ElementaryRulesState.DEAD);
  }

  public getNextStatus(neighbour: boolean[]): boolean {
    let num = 0;
    for (let i = 0; i < neighbour.length; i++) {
      if (neighbour[i]) {
        num += Math.pow(2, i);
      }
    }
    return this.binaryRule[num];
  }

  public setRuleNumber(index: number): void {
    this.rule = index;
    this.updateBinaryRules();
  }

  private updateBinaryRules(): void {
    let num = this.rule;
    for (let i = 0; i < 8; i++) {
      this.binaryRule[i] = num % 2 === 1;
      num = Math.floor(num / 2);
    }
  }
}
