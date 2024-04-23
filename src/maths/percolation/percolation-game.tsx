import * as React from "react";
import { Link } from "react-router-dom";

import { InfoBox } from "../../shared/info-box";
import { ProcessingComponent } from "../../shared/processing-component";
import { PercolationSketch } from "./percolation-sketch";

export class PercolationGame extends React.Component {
  // private strings: LocalizedStrings = getStrings();
  private sketch = new PercolationSketch();

  public render() {
    return (
      <ProcessingComponent
        sketch={this.sketch}
        infoSection={this.renderInfoSection()}
      />
    );
  }

  protected renderInfoSection(): JSX.Element {
    return (
      <InfoBox>
        <Link href="https://www.youtube.com/watch?v=a-767WnbaCQ" to={{}}>
          [Video] Percolation: a Mathematical Phase Transition
        </Link>
      </InfoBox>
    );
  }
}
