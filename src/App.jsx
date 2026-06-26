import "./App.css";
import { RestaurantProvider } from "./context/RestaurantContext";
import { ModalProvider } from "./context/ModalContext";
import AppContent from "./components/AppContent";

function App() {
  return (
    <RestaurantProvider>
      <ModalProvider>
        <AppContent />
      </ModalProvider>
    </RestaurantProvider>
  );
}

export default App;
