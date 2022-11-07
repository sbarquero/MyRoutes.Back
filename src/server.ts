import App from '@/app';
import AuthRoute from '@routes/auth.route';
import ConfigurationRoute from '@/routes/configuration.route';
import IndexRoute from '@routes/index.route';
import TrackRoute from './routes/track.route';
import UserRoute from '@/routes/user.route';
import validateEnv from '@utils/validateEnv';

validateEnv();

const app = new App([
  new IndexRoute(),
  new AuthRoute(),
  new UserRoute(),
  new TrackRoute(),
  new ConfigurationRoute(),
]);

app.listen();
