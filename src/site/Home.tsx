import * as React from "react";

import { CardsPage } from "./CardsPage";
import { Category, Menu, Page } from "./Menu";

export function Home({ menu }: { menu: Menu }) {
    return (
        <CardsPage
            title={menu.name}
            description=""
            cards={menu.categories
                .filter((category: Category) => category.pages.some((page: Page) => !page.hideMenu))
                .map((category: Category) => ({
                    title: category.name,
                    description: category.description || '',
                    imageUrl: '',
                    link: `/#${category.route}`,
                }))
            }
        />
    );
}
