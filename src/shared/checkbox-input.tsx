import * as React from "react";
import {
  FormControl,
  InputGroup,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";

export interface CheckboxInputProps {
  label: string;
  value: boolean;
  onValueChanged: (value: boolean) => void;
  disabled?: boolean;
  tooltip?: string;
}

export class CheckboxInput extends React.Component<CheckboxInputProps> {
  public render(): JSX.Element {
    const element = (
      <InputGroup className="mb-3">
        <InputGroup.Prepend>
          <InputGroup.Checkbox
            checked={this.props.value}
            onChange={this.onValueChanged}
            disabled={this.props.disabled}
          />
        </InputGroup.Prepend>
        <FormControl value={this.props.label} disabled={true} />
      </InputGroup>
    );
    if (!this.props.tooltip) {
      return element;
    }
    return (
      <OverlayTrigger
        placement="right"
        overlay={
          <Tooltip id={`tooltip-${this.props.label}`}>
            {this.props.tooltip}
          </Tooltip>
        }
      >
        {element}
      </OverlayTrigger>
    );
  }

  // tslint:disable-next-line:no-any
  private onValueChanged = (event: any): void => {
    const selectedValue = !this.props.value;
    this.props.onValueChanged(selectedValue);
  };
}
