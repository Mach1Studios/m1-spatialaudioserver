/* eslint-disable no-console */
import { server, config } from './configs';

(async () => {
  try {

  } catch (e) {
    console.log(e);
  }

  server.listen(config.port, () => {
    console.log(`🚀 Server listening on port ${config.port}!`);
    if (process.env.NODE_ENV === 'development') {
      console.info(`You can open API on this URI: http://localhost:${config.port}`);
    }
  });
})();
