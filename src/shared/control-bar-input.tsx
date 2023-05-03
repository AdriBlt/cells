import * as React from "react";
import { Button, ButtonGroup, OverlayTrigger, Tooltip } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";

import { LocalizedStrings } from "../strings";

export interface ControlBarInputProps {
    strings: LocalizedStrings;
    resetCallback?: () => void;
    playPauseCallback?: () => void;
    oneStepCallback?: () => void;
    randomCallback?: () => void;
    skipFastForwardCallback?: () => void;
}

export class ControlBarInput extends React.Component<ControlBarInputProps> {
  public render(): JSX.Element {
    return (
        <ButtonGroup>
          {this.props.resetCallback && renderButton(
            <Icon.ArrowCounterclockwise />,
            this.props.strings.shared.reset,
            this.props.resetCallback,
          )}
          {this.props.playPauseCallback && renderButton(
            <span>
              <Icon.PlayFill /> / <Icon.PauseFill />
            </span>,
            this.props.strings.shared.playPause,
            this.props.playPauseCallback,
          )}
          {this.props.oneStepCallback && renderButton(
            <Icon.SkipEndFill />,
            this.props.strings.shared.oneStep,
            this.props.oneStepCallback,
          )}
          {this.props.randomCallback && renderButton(
            <Icon.Shuffle />,
            this.props.strings.shared.randomize,
            this.props.randomCallback,
          )}
          {this.props.skipFastForwardCallback && renderButton(
            <Icon.SkipForwardFill />,
            this.props.strings.shared.skipForward,
            this.props.skipFastForwardCallback,
          )}
        </ButtonGroup>
    );
  }
}

function renderButton(
    icon: JSX.Element,
    text: string,
    callback: () => void
  ): JSX.Element {
    return (
      <OverlayTrigger
        placement="bottom"
        overlay={<Tooltip id={`tooltip-${text}`}>{text}</Tooltip>}
      >
        <Button onClick={callback}>{icon}</Button>
      </OverlayTrigger>
    );
  }