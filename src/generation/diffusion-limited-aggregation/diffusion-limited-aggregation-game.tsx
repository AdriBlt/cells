import * as React from "react";

import { ControlBarInput } from "../../shared/control-bar-input";
import { ProcessingComponent } from "../../shared/processing-component";
import { SelectInput, SelectInputProps } from "../../shared/select-input";
import { getStrings, LocalizedStrings } from "../../strings";
import { DEFAULT_MODE, DiffusionLimitedAggregationSketch, GenerationMode } from "./diffusion-limited-aggregation-sketch";

export class DiffusionLimitedAggregationGame
  extends React.Component<{}, { generationMode: GenerationMode}>
{
  public state = { generationMode: DEFAULT_MODE };
  private strings: LocalizedStrings = getStrings();
  private sketch = new DiffusionLimitedAggregationSketch();

  public render() {
    return (
      <ProcessingComponent
        sketch={this.sketch}
        commandsSection={this.renderCommands()}
      />
    );
  }

  private renderCommands(): JSX.Element {
    return (
      <div>
        <SelectInput {...this.getTemplateTypeProps()} />
        <ControlBarInput
          strings={this.strings}
          resetCallback={this.sketch.resetGrid}
          playPauseCallback={this.sketch.pause}
          oneStepCallback={this.sketch.playOneStep}
          skipFastForwardCallback={this.sketch.generate}
        />
      </div>
    );
  }

  private getTemplateTypeProps = (): SelectInputProps<GenerationMode> => {
    const options: GenerationMode[] = [
      GenerationMode.InnerPoint,
      GenerationMode.OutterCircle,
      GenerationMode.FromGround,
    ];
    return {
      label: "Generation mode",
      options,
      selectedOption: this.state.generationMode,
      onOptionChanged: (mode: GenerationMode) => {
        if (mode !== undefined && mode !== this.state.generationMode) {
          this.setState({ generationMode: mode }, () => this.sketch.setConfig(mode));
        }
      },
      getName: (type: GenerationMode) => type as string,
    };
  };
}
