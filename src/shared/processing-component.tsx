import * as React from "react";
import { Col, Container, Row } from "react-bootstrap";

import {
  ProcessingService,
  ProcessingSketch,
} from "../services/processing.service";
import { getStrings, LocalizedStrings } from "../strings";
import { newGuid } from "../utils/guid";

const PROCESSING_CONTAINER_ID_FORMAT = "processing-container-";

export interface ProcessingComponentProps<T extends ProcessingSketch> {
  sketch: T;
  commandsSection?: JSX.Element;
  infoSection?: JSX.Element;
  // toolBarSection?: JSX.Element;
}

export class ProcessingComponent<T extends ProcessingSketch>
  extends React.Component<ProcessingComponentProps<T>>
{
  protected readonly strings: LocalizedStrings = getStrings();
  private readonly processingService = new ProcessingService();
  private readonly processingContainerId: string = PROCESSING_CONTAINER_ID_FORMAT + newGuid();

  public componentDidMount(): void {
    this.processingService.sketch(this.props.sketch, this.processingContainerId);
  }

  public componentWillUnmount(): void {
    this.processingService.remove();
  }

  public render(): JSX.Element {
    return (
      <Container style={{ maxWidth: 1300 }}>
        {/* {this.renderToolBar && (
          <Row>
            <Col sm={12}>{this.renderToolBar()}</Col>
          </Row>
        )} */}
        <Row>
          <Col sm={9}>
            <div id={this.processingContainerId} />
          </Col>
          <Col sm={3}>
            {this.props.commandsSection}
            {this.props.infoSection}
          </Col>
        </Row>
      </Container>
    );
  }
}
