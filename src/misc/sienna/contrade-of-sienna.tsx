import * as React from "react";

import { InfoBox } from "../../shared/info-box";
import { ProcessingComponent } from "../../shared/processing-component";
import { ContradeOfSiennaSketch, RegionInfoDisplay, SelectedRegion } from "./contrade-of-sienna-sketch";
import { siena } from "./siena";

type State = { region: SelectedRegion | null };
export class ContradeOfSienna
  extends React.Component<{}, State>
  implements RegionInfoDisplay
{
  public state = { region: null };
  private sketch = new ContradeOfSiennaSketch(this);

  public render() {
    return (
      <ProcessingComponent
        sketch={this.sketch}
        infoSection={this.infoSection}
      />
    );
  }

  public selectRegion(region: SelectedRegion | null): void {
    this.setState({ region });
  }

  private get infoSection(): JSX.Element {
    return <InfoBox title="Contrade di Sienna">
      {this.getRegionInfo(this.state.region)}
    </InfoBox>;
  }

  private getRegionInfo(region: SelectedRegion | null): React.ReactNode {
    if (!region) {
      return "-";
    }

    if (region.isTerzo) {
      return this.getTerzoInfo(region.id);
    }

    return this.getContradaInfo(region.id);
  }

  private getContradaInfo(id: string): React.ReactNode {
    const contrada = siena.contrade.find(t => t.id === id);
    const terzo = siena.terzi.find(t => t.ids.includes(id));
    if (!contrada) {
      return "-";
    }
    return (
      <p>
        <b>Nom:</b> {displayText(contrada.name)}<br/>
        <b>Emblème:</b> {displayText(contrada.emblem)}<br/>
        <b>Couleurs:</b> {displayText(contrada.colors)}<br/>
        <b>Saint Patron:</b> {displayText(contrada.patronSaint)}<br/>
        <b>Profession Associée:</b> {displayText(contrada.associatedProfession)}<br/>
        <b>Alliés:</b> {displayText(contrada.alliedContrade.join(', '))}<br/>
        <b>Enemies:</b> {displayText(contrada.opponentContrade.join(', '))}<br/>
        <b>Terzo:</b> {displayText(terzo && terzo.name)}
      </p>
    );
  }

  private getTerzoInfo(id: string): React.ReactNode {
    const terzo = siena.terzi.find(t => t.id === id);
    return terzo && terzo.name || "-";
  }
}

function displayText(text: string | undefined): string {
  return !!text ? text : "-";
}