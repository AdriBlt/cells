import * as React from "react";
import { Form, InputGroup } from "react-bootstrap";

export interface SelectInputProps<T> {
  label: string;
  options: T[];
  selectedOption: T;
  onOptionChanged: (value: T) => void;
  appendComponent?: JSX.Element;
  getName: (item: T) => string;
}

export class SelectInput<T> extends React.Component<SelectInputProps<T>> {
  public render(): JSX.Element {
    const { getName } = this.props;
    return (
      <InputGroup>
        <InputGroup.Prepend>
          <InputGroup.Text>{this.props.label}</InputGroup.Text>
        </InputGroup.Prepend>
        <Form.Control
          as="select"
          onChange={this.onOptionChanged}
          value={getName(this.props.selectedOption)}
        >
          {this.props.options.map((value: T, i: number) => (
            <option key={i}>{getName(value)}</option>
          ))}
        </Form.Control>
        {this.props.appendComponent && (
          <InputGroup.Append>{this.props.appendComponent}</InputGroup.Append>
        )}
      </InputGroup>
    );
  }

  // tslint:disable-next-line:no-any
  private onOptionChanged = (event: any): void => {
    const { getName, options } = this.props;
    const selectedName = event.target.value as string;
    const selectedValue = options.find(item => getName(item) === selectedName);
    if (selectedValue) {
      this.props.onOptionChanged(selectedValue);
    }
  };
}
