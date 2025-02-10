import { Provider } from "react-redux";
import store from "../store/store";
import "../globals.css";
import AppContent from "@/components/AppContent";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
