import * as React from "react";
import { FormControl, InputGroup } from "react-bootstrap";

export interface NumberInputProps {
  min?: number;
  max?: number;
  label: string;
  value?: number;
  placeHolder?: string;
  onValueChanged: (newValue: number) => void;
  step?: number;
  appendComponent?: JSX.Element;
}

export class NumberInput extends React.Component<NumberInputProps> {
  public render(): JSX.Element {
    return (
      <InputGroup>
        <InputGroup.Prepend>
          <InputGroup.Text>{this.props.label}</InputGroup.Text>
        </InputGroup.Prepend>
        <FormControl
          type="number"
          min={this.props.min}
          max={this.props.max}
          value={this.props.value + ""}
          placeholder={this.props.placeHolder}
          // tslint:disable-next-line:no-any
          onChange={(e: any) => {
            return this.props.onValueChanged(+e.currentTarget.value);
          }}
          step={this.props.step || 1}
        />
        {this.props.appendComponent && (
          <InputGroup.Append>{this.props.appendComponent}</InputGroup.Append>
        )}
      </InputGroup>
    );
  }
}
