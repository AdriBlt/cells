import * as React from "react";

import { InfoBox } from "../shared/info-box";
import { ProcessingComponent } from "../shared/processing-component";
import { BransleyChaosGameProps, BransleyChoasGameSketch } from "./bransley-choas-game-sketch";
import { BransleyFernChaosGameProps } from "./bransley-fern-chaos-game-props";
import { SirpienskiChaosGameProps } from "./sirpienski-chaos-game-props";

export class BransleyChaosGame extends React.Component<
    { gameProps: BransleyChaosGameProps }
> {
    public render() {
        return (
            <ProcessingComponent
                sketch={this.sketch}
                infoSection={this.infoSection}
            />
        );
    }

    private get sketch(): BransleyChoasGameSketch {
        return new BransleyChoasGameSketch(this.props.gameProps);
    }

    protected get infoSection(): JSX.Element {
        return (
            <InfoBox title={this.props.gameProps.title}>
                {this.props.gameProps.description}
            </InfoBox>
        );
    }
}

export function BransleyFernGame() {
    return <BransleyChaosGame gameProps={new BransleyFernChaosGameProps()} />;
}

export function SierpinskiChaosGame() {
    return <BransleyChaosGame gameProps={new SirpienskiChaosGameProps()} />;
}
