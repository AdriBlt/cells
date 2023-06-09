import * as React from "react";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";

import { Category, Menu, Page } from "./Menu";

export function AppMenu({ menu }: { menu: Menu }) {
    return (
        <Navbar expand="lg" bg="dark" variant="dark">
            <Navbar.Brand href={'#' + menu.route}>{menu.name}</Navbar.Brand>
            <Nav className="mr-auto">
                {menu.categories
                    .filter((category: Category) => category.pages.some((page: Page) => !page.hideMenu))
                    .map((category: Category) => (
                        <NavDropdown
                            key={category.name}
                            id={category.name}
                            title={category.name}
                        >
                            {category.pages
                                .filter((page: Page) => !page.hideMenu)
                                .map((page: Page) => (
                                    <NavDropdown.Item
                                        key={page.route}
                                        href={`#${category.route}/${page.route}`}
                                    >
                                        {page.name}
                                    </NavDropdown.Item>
                                ))
                            }
                        </NavDropdown>
                    ))
                }
            </Nav>
        </Navbar>
    );
}
