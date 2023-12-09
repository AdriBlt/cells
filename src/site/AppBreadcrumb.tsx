import * as React from "react";
import * as Icon from "react-bootstrap-icons";
import { useHistory } from "react-router-dom";

import { Category, Menu, Page } from "./Menu";

export interface BreadCrumbProps {
    menu: Menu;
    category?: Category;
    page?: Page;
}

export function AppBreadcrumb(props: BreadCrumbProps) {
    const history = useHistory();

    let title: string;
    let buttonUrl: string | undefined;

    if (!props.category) {
        title = props.menu.name;
        buttonUrl = undefined;
    } else if (!props.page) {
        title = props.category.name;
        buttonUrl = props.menu.route;
    } else {
        title = props.page.name;
        buttonUrl = props.category.route;
    }

    return (
        <h3>
            {buttonUrl && (
                <Icon.ArrowLeftSquare
                    onClick={() => history.push(`/#${buttonUrl!}`)}
                    style={{ cursor: 'pointer', marginRight: '5px', marginTop: '-4px' }}
                />
            )}
            {title}
        </h3>
    );
}