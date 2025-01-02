import './App.css'
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
// import { setupListeners } from "@reduxjs/toolkit/dist/query";
import reducer from "./reduxStore/reducers";
import { api } from "./reduxStore/services/api/api";
import Home from './components/views/Home';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Board from './components/views/Board';


const store = configureStore({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reducer: reducer as any,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
      .concat(api.middleware)
});

// setupListeners(store.dispatch);

function App() {
  return (
    <>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/board/:boardId/" element={<Board/>}/>
            <Route path="*" element={<Home/>}/>
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  )
}

export default App
