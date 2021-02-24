import { createDefaultConfig } from 'tracejs';
import { reactive, provide, inject, toRefs } from 'vue';

export const StoreSymbol = Symbol();

export const createStore = () => {
  const store = reactive({
    numCycles: 0,
    config: createDefaultConfig(),
  });

  provide(StoreSymbol, store);

  return store;
};

export const getStore = () => inject<ReturnType<typeof createStore>>(StoreSymbol)!;
