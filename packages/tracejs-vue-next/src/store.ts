import { reactive, provide, inject, readonly } from 'vue';

export const StoreSymbol = Symbol();

export const createStore = () => {
  const state = reactive({
    numCycles: 0,
  });

  const store = {
    state: readonly(state),

    setNumCycles(numCycles: number) {
      state.numCycles = numCycles;
    },
  };

  provide(StoreSymbol, store);

  return store;
};

export const getStore = () => inject<ReturnType<typeof createStore>>(StoreSymbol)!;
