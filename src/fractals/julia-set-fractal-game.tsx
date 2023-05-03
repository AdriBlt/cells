import * as React from "react";

import { InfoBox } from "../shared/info-box";
import { ProcessingComponent } from "../shared/processing-component";
import { SelectInput, SelectInputProps } from "../shared/select-input";
import { getStrings, LocalizedStrings } from "../strings";
import { FractalSketch } from "./fractal-sketch";
import { JuliaSet } from "./models/fractals/julia-set";
import { JuliaComplex, JuliaSetComplexes, JuliaSetValues } from "./models/fractals/julia-set-complexes";

interface JuliaSetGameState {
  parameter: JuliaComplex;
}

const DefaultParameter = JuliaSetComplexes.I;

export class JuliaSetFractalGame extends React.Component<{}, JuliaSetGameState > {
  public state = {
    parameter: DefaultParameter,
  };
  private strings: LocalizedStrings = getStrings();
  private sketch = new FractalSketch(new JuliaSet(DefaultParameter.complex));

  public render() {
    return (
      <ProcessingComponent
        sketch={this.sketch}
        commandsSection={this.renderCommands()}
      />
    );
  }

  protected renderCommands(): JSX.Element {
    return <InfoBox>
      <SelectInput {...this.parameterInputProps()} />
    </InfoBox>;
  }

  private parameterInputProps(): SelectInputProps<JuliaComplex> {
    return {
      label: this.strings.juliaSetFractal.parameter,
      options: JuliaSetValues,
      selectedOption: this.state.parameter,
      onOptionChanged: param => {
        this.setState(
          { parameter: param },
          () => this.sketch.setFractal(new JuliaSet(this.state.parameter.complex)))
        },
        getName: param => param.name,
      };
  }
}
