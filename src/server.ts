import App from '@/app';
import IndexRoute from '@routes/index.route';
import AuthRoute from '@routes/auth.route';
import UsersRoute from '@routes/users.route';
import TrackRoute from './routes/track.route';
import validateEnv from '@utils/validateEnv';

validateEnv();

const app = new App([
  new IndexRoute(),
  new AuthRoute(),
  new UsersRoute(),
  new TrackRoute(),
]);

app.listen();
