import * as React from "react";
import ReactBootstrapSlider from 'react-bootstrap-slider';

export interface SliderProps {
    min?: number;
    max?: number;
    label: string;
    value?: number;
    onValueChanged: (newValue: number) => void;
    step?: number;
}

export function Slider(props: SliderProps) {
    return (
        <ReactBootstrapSlider
            value={props.value}
            change={props.onValueChanged}
            slideStop={props.onValueChanged}
            step={props.step}
            max={props.max}
            min={props.min}
            orientation="vertical"
            reversed={true}
            // disabled="disabled"
        />
    );
}