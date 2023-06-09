import { observer } from "mobx-react";
import * as React from "react";

import { ControlBarInput } from "../../shared/control-bar-input";
import { InfoBox } from "../../shared/info-box";
import { NumberInput, NumberInputProps } from "../../shared/number-input";
import { ProcessingComponent } from "../../shared/processing-component";
import { getStrings, LocalizedStrings } from "../../strings";
import { EuclidianRythmsSketch, MIN_TIMESTEPS } from "./euclidian-rythms-sketch";

@observer
export class EuclidianRythmsGame extends React.Component {
  private strings: LocalizedStrings = getStrings();
  private sketch = new EuclidianRythmsSketch();

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
        <NumberInput {...this.getTimestepsProps()} />
        <ControlBarInput
          strings={this.strings}
          playPauseCallback={this.sketch.pause}
          oneStepCallback={this.sketch.draw}
        />
      </div>
    );
  }

  protected renderInfoSection(): JSX.Element {
    // TODO: more info https://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.72.1340&rep=rep1&type=pdf
    return (
      <InfoBox>
        {this.strings.euclidianRythms.info1}
        <br/>
        {this.strings.euclidianRythms.info2}
      </InfoBox>
    );
  }

  private getTimestepsProps = (): NumberInputProps => {
    return {
      min: MIN_TIMESTEPS,
      step: 1,
      label: this.strings.euclidianRythms.timesteps,
      value: this.sketch.timesteps,
      onValueChanged: this.sketch.setTimesteps,
    };
  };
}
