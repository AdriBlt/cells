import * as React from "react";

import { InfoBox } from "../../shared/info-box";
import { ProcessingComponent } from "../../shared/processing-component";
import { getStrings, LocalizedStrings } from "../../strings";
import { MiniMapInfo } from "./mini-map-sketch";
import { RayCastingGameProps, RayCastingSketch } from "./ray-casting-sketch";
import { WalkerMiniMap } from "./walker-mini-map";

export interface RayCastingWalkerGameProps {
    rayCastingProps: RayCastingGameProps;
    miniMapInfo: MiniMapInfo;
}

export class RayCastingWalkerGame extends React.Component<RayCastingWalkerGameProps> {
    private strings: LocalizedStrings = getStrings();

    public render() {
        return (
            <ProcessingComponent
                sketch={this.sketch}
                commandsSection={this.commandsSection}
                infoSection={this.infoSection}
            />
        );
    }

    protected get sketch(): RayCastingSketch {
        return new RayCastingSketch(this.props.rayCastingProps);
    }

    protected get commandsSection(): JSX.Element {
        return (
            <InfoBox
                title={this.strings.rayCasting.miniMap}
                collapsibleProps={{ isOpenAtStart: false }}
            >
                <WalkerMiniMap {...this.props} />
            </InfoBox>
        );
    }

    protected get infoSection(): JSX.Element {
        return (
            <InfoBox title={this.strings.shared.controls}>
                {this.strings.rayCasting.controls}
            </InfoBox>
        );
    }
}
