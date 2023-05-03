import * as React from "react";
import { useState } from "react";
import { Alert, Collapse } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";

export interface InfoBoxProps {
    title?: string;
    children: React.ReactNode;
    collapsibleProps?: { isOpenAtStart: boolean };
}

export function InfoBox(props: InfoBoxProps): JSX.Element {
    const [open, setOpen] = useState(!props.collapsibleProps || props.collapsibleProps.isOpenAtStart);
    return (
        <Alert
            variant="secondary"
            style={{ marginTop: 10, fontSize: 14 }}
        >
            {props.title && (
                <Alert.Heading style={{ fontSize: 14, fontWeight: 'bold' }}>
                    {!props.collapsibleProps
                        ? props.title
                        : (<Alert.Link onClick={() => setOpen(!open)}>
                            <span style={{ marginRight: 5 }}>{open ? (<Icon.ChevronUp />) : (<Icon.ChevronDown />) }</span>
                            {props.title}
                        </Alert.Link>)}
                </Alert.Heading>)}

            <Collapse in={open}>
                <div>{props.children}</div>
            </Collapse>
        </Alert>
    );
}
