import App from '@/app';
import IndexRoute from '@routes/index.route';
import AuthRoute from '@routes/auth.route';
import FileRoute from '@routes/file.route';
import UsersRoute from '@routes/users.route';
import validateEnv from '@utils/validateEnv';

validateEnv();

const app = new App([
  new IndexRoute(),
  new AuthRoute(),
  new FileRoute(),
  new UsersRoute(),
]);

app.listen();
