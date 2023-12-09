import * as React from "react";
import { HashRouter, Route, Switch } from "react-router-dom";

import { AppBreadcrumb } from "./AppBreadcrumb";
import { CategoryPage } from "./CategoryPage";
import { Home } from "./Home";
import { Category, Menu, Page } from "./Menu";

export function AppRoutes({ menu }: { menu: Menu }): JSX.Element {
  return (
    <HashRouter hashType="noslash">
      <Switch>
        {menu.categories.map((category: Category) => (
          <>
            <Route
              key={category.route}
              path={`/${category.route}`}
              render={() => <CategoryPage category={category}/>}
              exact={true}
            />
            {category.pages.map((page: Page) => (
              <Route
                key={`${category.route}/${page.route}`}
                path={`/${category.route}/${page.route}`}
                render={() => (
                  <>
                    <AppBreadcrumb menu={menu} category={category} page={page} />
                    {page.component}
                  </>
                )}
                exact={true}
              />
            ))}
          </>
        ))}
        <Route
          key={menu.route}
          path={`/${menu.route}`}
          component={() => <Home menu={menu} />}
          exact={true}
        />
        <Route
          path="/"
          component={() => <Home menu={menu} />}
          exact={true}
        />
        {/* <Route render={() => (<Redirect to={`/${menu.route}`} />)} /> */}
      </Switch>
    </HashRouter>
  );
}
