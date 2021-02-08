import "../styles/globals.css";
import { Grommet } from "grommet";
import { wrapper } from "../src/store/store";

function MyApp({ Component, pageProps }) {
  return (
    <Grommet plain>
      <Component {...pageProps} />
    </Grommet>
  );
}

export default wrapper.withRedux(MyApp);
