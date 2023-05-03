import * as React from "react";

import { AppMenu } from "./AppMenu";
import { AppRoutes } from "./AppRoutes";
import { appMenu, Menu } from "./Menu";

const menu: Menu = appMenu;

export const App = () => (
  <>
    <AppMenu menu={menu} />
    <AppRoutes menu={menu} />
  </>
);
