import * as React from "react";

import { ControlBarInput } from "../../shared/control-bar-input";
import { InfoBox } from "../../shared/info-box";
import { ProcessingComponent } from "../../shared/processing-component";
import { SelectInput, SelectInputProps } from "../../shared/select-input";
import { getStrings, LocalizedStrings } from "../../strings";
import { getSolarSystemInfo } from "./models/data";
import { BodyInfo, CameraMode } from "./models/models";
import { NBodiesSketch } from "./n-bodies-sketch";

const CameraModes = [
  CameraMode.Free,
  CameraMode.LockOnBarycenter,
  CameraMode.LockOnBody,
  CameraMode.ViewFromBarycenter,
  CameraMode.ViewFromBody,
];

interface NBodiesGameProps {
  bodies: BodyInfo[];
  cameraMode: CameraMode;
  selectedBodyIndex: number;
}

export class NBodiesGame extends React.Component<{}, NBodiesGameProps> {
  public state: NBodiesGameProps = {
    bodies: [],
    cameraMode: CameraMode.LockOnBarycenter,
    selectedBodyIndex: 0,
  };
  private sketch = new NBodiesSketch();
  private strings: LocalizedStrings = getStrings();

  public componentDidMount() {
    getSolarSystemInfo()
      .then(bodies => this.setState(
        { bodies },
        () => this.sketch.setBodies(this.state.bodies),
      ));
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
      <InfoBox>
        <SelectInput {...this.cameraModeSelectProps()} />
        {this.showSelectedBodyDropdown && (<SelectInput {...this.focusedBodySelectProps()} />)}
        <ControlBarInput
          strings={this.strings}
          resetCallback={this.sketch.reset}
          playPauseCallback={this.sketch.pause}
          oneStepCallback={this.sketch.playOneStep}
          skipFastForwardCallback={this.sketch.skipForward}
        />
        </InfoBox>
    );
  }

  protected renderInfoSection(): JSX.Element {
    return <div />;
  }

  private cameraModeSelectProps(): SelectInputProps<CameraMode> {
    return {
      label: this.strings.nBodies.cameraModeSelect,
      options: CameraModes,
      selectedOption: this.state.cameraMode,
      onOptionChanged: (value: CameraMode) => {
        this.setState(
          { cameraMode: value },
          () => this.setViewMode(),
        );
      },
      getName: mode => this.getCameraModeName(mode),
    };
  }

  private focusedBodySelectProps(): SelectInputProps<BodyInfo> {
    return {
      label: this.strings.nBodies.focusedBodySelect,
      options: this.state.bodies,
      selectedOption: this.state.bodies[this.state.selectedBodyIndex],
      onOptionChanged: (value: BodyInfo) => {
        this.setState(
          { selectedBodyIndex: this.state.bodies.map(k => k.name).indexOf(value.name) },
          () => this.setViewMode(),
        );
      },
      getName: body => body.name,
    };
  }

  private setViewMode = (): void => {
    this.sketch.setViewMode({
      type: this.state.cameraMode,
      bodyIndex: this.state.selectedBodyIndex,
    });
  }

  private get showSelectedBodyDropdown(): boolean {
    return this.state.cameraMode === CameraMode.LockOnBody || this.state.cameraMode === CameraMode.ViewFromBody;
  }

  private getCameraModeName(mode: CameraMode): string {
    const strings = this.strings.nBodies.cameraModeNames;
    switch (mode) {
      case CameraMode.Free: return strings.free;
      case CameraMode.LockOnBarycenter: return strings.lockOnBarycenter;
      case CameraMode.LockOnBody: return strings.lockOnBody;
      case CameraMode.ViewFromBarycenter: return strings.viewFromBarycenter;
      case CameraMode.ViewFromBody: return strings.viewFromBody;
      default: return '';
    }
  }
}
