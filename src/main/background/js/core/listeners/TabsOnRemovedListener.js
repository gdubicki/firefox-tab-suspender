import browser from 'webextension-polyfill';
import Injector from '~/main/background/js/infrastructure/injector/Injector';
import EventType from '~/main/background/js/core/data/EventType';
import WasmService from '~/main/background/js/core/services/WasmService';
import HeapType from '~/main/background/js/core/data/HeapType';
import CFunctionsProvider
  from '~/main/background/js/core/providers/CFunctionsProvider';

export default @Injector.register([WasmService, CFunctionsProvider])
class TabsOnRemovedListener {
  constructor (wasmService, cFunctionsProvider) {
    this._wasmService = wasmService;
    this._cFunctionsProvider = cFunctionsProvider;
  }

  run () {
    browser.tabs.onRemoved.addListener((tabId, removeInfo) => {
      this._wasmService.passArrayToWasm(
        EventType.TABS_ON_REMOVED,
        this._cFunctionsProvider.cPushEvent.bind(this._cFunctionsProvider),
        [removeInfo.windowId, tabId],
        HeapType.HEAP32,
      );
    });
  }
}