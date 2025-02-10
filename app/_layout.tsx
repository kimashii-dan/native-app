import { Provider } from "react-redux";
import store from "../store/store";
import "../globals.css";
import AppContent from "@/helpers/AppContent";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
