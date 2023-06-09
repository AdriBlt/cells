import * as React from "react";

import { ControlBarInput } from "../../shared/control-bar-input";
import { InfoBox } from "../../shared/info-box";
import { ProcessingComponent } from "../../shared/processing-component";
import { SelectInput, SelectInputProps } from "../../shared/select-input";
import { getStrings, LocalizedStrings } from "../../strings";
import { MazeAlgorithmType, MazeGenerationSketch } from "./maze-generation-sketch";

const ALGORITHM_LIST: MazeAlgorithmType[] = [
    MazeAlgorithmType.RandomTraversal,
    MazeAlgorithmType.Kruskal,
    MazeAlgorithmType.RandomizedPrim,
    MazeAlgorithmType.DepthExploration,
    MazeAlgorithmType.RecursiveSubdivision,
    MazeAlgorithmType.Wilson,
];

interface MazeGenerationGameState {
    selectedAlgorithm: MazeAlgorithmType;
}

const DEFAULT_ALGORITHM = ALGORITHM_LIST[0];

export class MazeGenerationGame extends React.Component<{}, MazeGenerationGameState> {
    public state: MazeGenerationGameState = { selectedAlgorithm: DEFAULT_ALGORITHM };
    private strings: LocalizedStrings = getStrings();
    private sketch = new MazeGenerationSketch(DEFAULT_ALGORITHM);

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
            <div>
                <SelectInput {...this.getAlgorithmProps()} />
                <ControlBarInput
                    strings={this.strings}
                    resetCallback={this.sketch.reset}
                    playPauseCallback={this.sketch.togglePlayPause}
                    oneStepCallback={this.sketch.playOneStep}
                    skipFastForwardCallback={this.sketch.skipGeneration}
                />
            </div>
        );
    }

    protected renderInfoSection(): JSX.Element {
        const description = this.getDescription(this.state.selectedAlgorithm);
        return description ? (<InfoBox title={this.strings.mazeGeneration.infoTitle}>{description}</InfoBox>) : <div/> ;
    }

    private getAlgorithmProps(): SelectInputProps<MazeAlgorithmType> {
        return {
            label: 'Algorithm',
            options: ALGORITHM_LIST,
            selectedOption: this.state.selectedAlgorithm,
            onOptionChanged: (algorithm: MazeAlgorithmType) => {
                this.sketch.setAlgorithmType(algorithm);
                this.setState({ selectedAlgorithm: algorithm });
            },
            getName: (type: MazeAlgorithmType) => this.getName(type),
        };
    }

    private getName(type: MazeAlgorithmType): string {
        const strings = this.strings.mazeGeneration.algorithm;
        switch (type) {
            case MazeAlgorithmType.RandomTraversal: return strings.randomTraversal;
            case MazeAlgorithmType.Kruskal: return strings.kruskal;
            case MazeAlgorithmType.RandomizedPrim: return strings.randomizedPrim;
            case MazeAlgorithmType.DepthExploration: return strings.depthExploration;
            case MazeAlgorithmType.RecursiveSubdivision: return strings.recursiveSubdivision;
            case MazeAlgorithmType.Wilson: return strings.wilson;
            default: return '';
        }

    }

    private getDescription(type: MazeAlgorithmType): string {
        const strings = this.strings.mazeGeneration.description;
        switch (type) {
            case MazeAlgorithmType.RecursiveSubdivision:
                return strings.recursiveSubdivision;
            case MazeAlgorithmType.DepthExploration:
                return strings.depthExploration;
            case MazeAlgorithmType.Kruskal:
                return strings.kruskal;
            case MazeAlgorithmType.RandomTraversal:
                return strings.randomTraversal;
            case MazeAlgorithmType.RandomizedPrim:
                return strings.randomizedPrim;
            case MazeAlgorithmType.Wilson:
                return strings.wilson;
            default:
                return '';
        }
    }
}
