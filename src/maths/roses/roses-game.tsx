import * as React from "react";

import { InfoBox } from "../../shared/info-box";
import { NumberInput, NumberInputProps } from "../../shared/number-input";
import { ProcessingComponent } from "../../shared/processing-component";
import { getStrings, LocalizedStrings } from "../../strings";
import { DefaultProps, RosesProps, RosesSketch } from "./roses-sketch";

export class RosesGame extends React.Component<{}, RosesProps> {
  public state = DefaultProps;
  private strings: LocalizedStrings = getStrings();
  private sketch = new RosesSketch({
    onPropsChange: (p) => this.setState(p)
  });

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
        <NumberInput {...this.getNumeratorProps()} />
        <NumberInput {...this.getDenominatorProps()} />
      </div>
    );
  }

  protected renderInfoSection(): JSX.Element {
    const strings = this.strings.roses;
    return (
      <InfoBox>
        {strings.description1}
        <br/>
        {strings.description2}
        <hr/>
        <i>{strings.controls}</i>
      </InfoBox>
    );
  }

  private getNumeratorProps = (): NumberInputProps => {
    return {
      min: 1,
      step: 1,
      label: this.strings.roses.numerator,
      value: this.state.coefNumerator,
      onValueChanged: this.sketch.setNumerator,
    };
  };

  private getDenominatorProps = (): NumberInputProps => {
    return {
      min: 1,
      step: 1,
      label: this.strings.roses.denominator,
      value: this.state.coefDenominator,
      onValueChanged: this.sketch.setDenominator,
    };
  };
}
