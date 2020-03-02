process.env.SECRET = '$2b$10$j/yig876E9Wok6Ro1dEjTe';

if (!process.env.SECRET) {
  throw '"SECRET" is not defined in the environment. Application will not start without it.';
}
