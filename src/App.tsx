// lokasi file src/pages/home/halo.tsx

import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { useLocation } from 'react-router-dom';
import { wallet, home, repeat,addCircleSharp, settings } from 'ionicons/icons';
import Homepage from './pages/home/Homepage';
import History from './pages/history/History';
import InOutForm from './pages/InOut/InOutForm';
import Setting from './pages/Setting/Setting';
import Save from './pages/save/save';
import DetailKategori from './pages/detailkategori/detailkategori';
import FormTabungan from './pages/formtabungan/formtabungan';
import FormDaftarTabungan from './pages/formtarget/formDaftarTabungan';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
import './theme/tailwind.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Dark mode (optional) */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables + custom tab bar */
import './App.css';

setupIonicReact();

const TabsWithConditionalBar: React.FC = () => {
  const location = useLocation();
  const hideTabBarRoutes = [/^\/detailkategori\//];
  // Hide tab bar also on form pages
  const hideFormRoute = /^\/formtabungan\//.test(location.pathname) || /^\/formdaftartabungan\//.test(location.pathname);
  const shouldHideTabBar = hideFormRoute || hideTabBarRoutes.some((r) => r.test(location.pathname));

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/Homepage">
          <Homepage />
        </Route>
        <Route exact path="/History">
          <History/>
        </Route>
        <Route exact path="/Save">
          <Save/>
        </Route>
        <Route path="/InOutForm">
          <InOutForm />
        </Route>
        <Route path="/Setting">
          <Setting />
        </Route>
        <Route path="/detailkategori/:categoryId">
          <DetailKategori />
        </Route>
        <Route path="/formtabungan/:categoryId/:itemId">
          <FormTabungan />
        </Route>
        <Route path="/formdaftartabungan/:categoryId">
          <FormDaftarTabungan />
        </Route>
        <Route exact path="/">
          <Redirect to="/Homepage" />
        </Route>
      </IonRouterOutlet>

      {!shouldHideTabBar && (
        <IonTabBar slot="bottom">
          <IonTabButton tab="Homepage" href="/Homepage">
            <IonIcon icon={home} />
          </IonTabButton>
          <IonTabButton tab="History" href="/History">
            <IonIcon icon={repeat} />
          </IonTabButton>
          <IonTabButton tab="InOutForm" href="/InOutForm">
            <IonIcon icon={addCircleSharp} />
          </IonTabButton>
          <IonTabButton tab="Save" href="/Save">
            <IonIcon icon={wallet} />
          </IonTabButton>
          <IonTabButton tab="Setting" href="/Setting">
            <IonIcon icon={settings} />
          </IonTabButton>
        </IonTabBar>
      )}
    </IonTabs>
  );
};

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <TabsWithConditionalBar />
    </IonReactRouter>
  </IonApp>
);

export default App;
