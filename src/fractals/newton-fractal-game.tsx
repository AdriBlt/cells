import * as React from "react";

import { getUnityRootsPolynom } from "../numbers/PolynomHelpers";
import { InfoBox } from "../shared/info-box";
import { NumberInput, NumberInputProps } from "../shared/number-input";
import { ProcessingComponent } from "../shared/processing-component";
import { getStrings, LocalizedStrings } from "../strings";
import { FractalSketch } from "./fractal-sketch";
import { Newton } from "./models/fractals/newton";

interface NewtonFractalGameState {
  unityRootPolynomDegree: number
}

const DefaultPolygonDegree = 3;

export class NewtonFractalGame extends React.Component<{}, NewtonFractalGameState> {
  public state: NewtonFractalGameState = { unityRootPolynomDegree: DefaultPolygonDegree };
  private strings: LocalizedStrings = getStrings();
  private sketch = new FractalSketch(new Newton(getUnityRootsPolynom(DefaultPolygonDegree)));

  public render() {
    return (
      <ProcessingComponent
        sketch={this.sketch}
        commandsSection={this.renderCommands()}
      />
    );
  }

  protected renderCommands(): JSX.Element {
    return <InfoBox title={this.strings.newtonFractal.unityRootPolynom}>
      <NumberInput {...this.unityRootPolynomDegreeInputProps()} />
    </InfoBox>;
  }

  private unityRootPolynomDegreeInputProps(): NumberInputProps {
    return {
      label: this.strings.newtonFractal.degree,
      value: this.state.unityRootPolynomDegree,
      min: 1,
      onValueChanged: value => this.setState(
        { unityRootPolynomDegree: value },
        () => this.sketch.setFractal(new Newton(getUnityRootsPolynom(this.state.unityRootPolynomDegree))))
    };
  }
}
