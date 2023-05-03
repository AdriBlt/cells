import * as React from "react";

import { CheckboxInput, CheckboxInputProps } from "../../shared/checkbox-input";
import { NumberInput, NumberInputProps } from "../../shared/number-input";
import { ProcessingComponent } from "../../shared/processing-component";
import { getStrings, LocalizedStrings } from "../../strings";
import { FlockSketch } from "./flock-sketch";

interface FlockGameState {
  cohesionWeight: number;
  alignmentWeight: number;
  separationWeight: number;
  isTailVisible: boolean;
}

export class FlockGame extends React.Component<{}, FlockGameState> {
  public state: FlockGameState;
  private strings: LocalizedStrings = getStrings();
  private sketch = new FlockSketch();

  constructor() {
    super({});
    this.state = this.sketch.flock.traits;
  }

  public render() {
    return (
      <ProcessingComponent
        sketch={this.sketch}
        commandsSection={this.renderCommands()}
        infoSection={this.renderInfoSection()}
      />
    );
  }

  protected renderCommands(): JSX.Element {
    return (
      <div>
        <NumberInput {...this.getCohesionProps()} />
        <NumberInput {...this.getAlignmentProps()} />
        <NumberInput {...this.getSeparationProps()} />
        <CheckboxInput {...this.getTailProps()} />
      </div>
    );
  }

  protected renderInfoSection(): JSX.Element {
    return <div />;
  }

  private getCohesionProps(): NumberInputProps {
    return {
      min: 0,
      max: 2,
      step: 0.1,
      label: this.strings.flock.cohesion,
      value: this.state.cohesionWeight,
      onValueChanged: (value: number) => {
        this.sketch.flock.traits.cohesionWeight = value;
        this.setState({ cohesionWeight: value });
      },
    };
  }

  private getAlignmentProps(): NumberInputProps {
    return {
      min: 0,
      max: 2,
      step: 0.1,
      label: this.strings.flock.alignment,
      value: this.state.alignmentWeight,
      onValueChanged: (value: number) => {
        this.sketch.flock.traits.alignmentWeight = value;
        this.setState({ alignmentWeight: value });
      },
    };
  }

  private getSeparationProps(): NumberInputProps {
    return {
      min: 0,
      max: 2,
      step: 0.1,
      label: this.strings.flock.separation,
      value: this.state.separationWeight,
      onValueChanged: (value: number) => {
        this.sketch.flock.traits.separationWeight = value;
        this.setState({ separationWeight: value });
      },
    };
  }

  private getTailProps(): CheckboxInputProps {
    return {
      label: "Show tail",
      value: this.state.isTailVisible,
      onValueChanged: (value: boolean) => {
        this.sketch.flock.traits.isTailVisible = value;
        this.setState({ isTailVisible: value });
      },
    };
  }
}
