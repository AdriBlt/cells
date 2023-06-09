import * as React from "react";

import { Asset, getAssetPath } from "../assets";
import { formatString } from "../utils/string-formating-utilities";
import { CardsPage } from "./CardsPage";
import { Category, Page } from "./Menu";

export function CategoryPage({ category }: { category: Category }) {
    return (
        <CardsPage
            title={category.name}
            description={category.description || ''}
            cards={category.pages.filter((page: Page) => !page.hideMenu).map((page: Page) => ({
                title: page.name,
                description: page.description || '',
                imageUrl: formatString(getAssetPath(Asset.CoversFormat), category.route, page.route),
                link: `/#${category.route}/${page.route}`,
            }))}
            showBackButton={true}
        />
    );
}