import * as React from "react";
import { Button } from "react-bootstrap";

import { ProcessingComponent } from "../../shared/processing-component";
import { getStrings, LocalizedStrings } from "../../strings";
import { BattleshipSketch } from "./battleship-sketch";
import { GameStatus } from "./models/game-status";

type State = { endTextMessage: string };
export class BattleshipGame extends React.Component<{}, State> {
  public state = { endTextMessage: '' };
  private strings: LocalizedStrings = getStrings();
  private sketch = new BattleshipSketch({
    onGameStatusChange: (status) => this.setGameStatus(status)
  });

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
    return (
      <div>
        <span>
          <b>{this.state.endTextMessage}</b>
        </span>
      </div>
    );
  }

  private setGameStatus(gameStatus: GameStatus) {
    const endTextMessage =
    gameStatus === GameStatus.Victory
      ? this.strings.shared.victory
      : gameStatus === GameStatus.Failure
        ? this.strings.shared.failure
        : "";
    this.setState({ endTextMessage });
  }
}
