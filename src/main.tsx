import { createRoot } from "react-dom/client"
import App from "./App.tsx"
import "./index.css"
import { Provider } from "react-redux"
import { store } from "./store/store.ts"

import { attivaScorciatoie } from "./utils/scorciatoie"

attivaScorciatoie()
createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App />
  </Provider>,
)
