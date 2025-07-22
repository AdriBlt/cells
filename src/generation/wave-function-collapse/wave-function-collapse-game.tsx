import * as React from "react";

import { CheckboxInput, CheckboxInputProps } from "../../shared/checkbox-input";
import { ControlBarInput } from "../../shared/control-bar-input";
import { ProcessingComponent } from "../../shared/processing-component";
import { SelectInput, SelectInputProps } from "../../shared/select-input";
import { getStrings, LocalizedStrings } from "../../strings";
import { DEFAULT_TILE_TEMPLATE, TileTemplate, WaveFunctionCollapseSketch } from "./wave-function-collapse-sketch";

export class WaveFunctionCollapseGame extends React.Component<
  {},
  { tileTemplate: TileTemplate; debug: boolean }
> {
  public state = { tileTemplate: DEFAULT_TILE_TEMPLATE, debug: false };
  private strings: LocalizedStrings = getStrings();
  private sketch = new WaveFunctionCollapseSketch();

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
        <CheckboxInput {...this.debugCheckBoxProps()} />
      </div>
    );
  }

  private debugCheckBoxProps = (): CheckboxInputProps => {
    return {
      label: 'Show tiles entropy',
      value: this.state.debug,
      onValueChanged : (debug) => this.setState({ debug }, () => this.sketch.setIsDebug(debug)),
    };
  }

  private getTemplateTypeProps = (): SelectInputProps<TileTemplate> => {
    const options: TileTemplate[] = [
      TileTemplate.PlainSquareTiles,
      TileTemplate.PlainHexagonTiles,
      TileTemplate.KnotsTiles,
      TileTemplate.CastleTiles,
      TileTemplate.CirclesTiles,
      TileTemplate.CircuitTiles,
      TileTemplate.FloorPlanTiles,
      TileTemplate.RoomsTiles,
      TileTemplate.SummerTiles,
      TileTemplate.Carcasonne,
    ];
    const strings = this.strings.waveFunctionCollapse;
    return {
      label: strings.templates,
      options,
      selectedOption: this.state.tileTemplate,
      onOptionChanged: (tileTemplate: TileTemplate) => {
        if (tileTemplate !== undefined && tileTemplate !== this.state.tileTemplate) {
          this.setState({ tileTemplate }, () => this.sketch.setTemplate(tileTemplate));
        }
      },
      getName: (type: TileTemplate) => type as string,
    };
  };
}
