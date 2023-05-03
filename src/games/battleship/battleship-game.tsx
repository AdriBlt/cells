import { observer } from "mobx-react";
import * as React from "react";
import { Button } from "react-bootstrap";

import { ProcessingComponent } from "../../shared/processing-component";
import { getStrings, LocalizedStrings } from "../../strings";
import { BattleshipSketch } from "./battleship-sketch";
import { GameStatus } from "./models/game-status";

@observer
export class BattleshipGame extends React.Component {
  private strings: LocalizedStrings = getStrings();
  private sketch = new BattleshipSketch();

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
      <Button onClick={this.sketch.resetGrid} block={true}>
        {this.strings.shared.newGame}
      </Button>
    );
  }

  protected renderInfoSection(): JSX.Element {
    const endTextMessage =
      this.sketch.gameStatus === GameStatus.Victory
        ? this.strings.shared.victory
        : this.sketch.gameStatus === GameStatus.Failure
          ? this.strings.shared.failure
          : "";
    return (
      <div>
        <span>
          <b>{endTextMessage}</b>
        </span>
      </div>
    );
  }
}
