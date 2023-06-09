import * as React from "react";

import { CardsPage } from "./CardsPage";
import { Category, Menu } from "./Menu";

export function Home({ menu }: { menu: Menu }) {
    return (
        <CardsPage
            title={menu.name}
            description=""
            cards={menu.categories.map((category: Category) => ({
                title: category.name,
                description: category.description || '',
                imageUrl: '',
                link: `/#${category.route}`,
            }))}
        />
    );
}
