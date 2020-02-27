if (!process.env.SECRET) {
  throw '"SECRET" is not defined in the environment. Application will not start without it.';
}
