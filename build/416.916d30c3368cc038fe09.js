"use strict";(self.webpackChunkquil=self.webpackChunkquil||[]).push([[416],{416:(__unused_webpack___webpack_module__,__webpack_exports__,__webpack_require__)=>{eval("/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   O: () => (/* binding */ useEntriesContext)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(709);\n/* harmony import */ var _context_EntryContext_jsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(456);\n//** USE ENTRIES CONTEXT HOOK */\n\n// Import useContext and EntriesContext for managing entries state\n\n\n\n/**\n * Custom hook to access the entries context.\n *\n * @typedef {Object} EntriesContextValue\n * @property {Object[]} entries - An array of entry objects from the entries context.\n * @property {string} _id - The ID of the entry.\n * @property {string} body - The content of the entry.\n * @property {string} createdAt - Timestamp of when the entry was created.\n * @property {string} updatedAt - Timestamp of when the entry was updated.\n *\n * @returns {EntriesContextValue} The entries context object.\n * @throws {Error} Throws an error if used outside of an EntriesContextProvider.\n */\nvar useEntriesContext = function useEntriesContext() {\n  // Get the entries context using the useContext hook\n  var entriesContext = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(_context_EntryContext_jsx__WEBPACK_IMPORTED_MODULE_1__/* .EntriesContext */ .te);\n\n  // Error handling\n  if (!entriesContext) {\n    throw new Error('useEntriesContext must be used within an EntriesContextProvider. Make sure your component is wrapped with the EntriesContextProvider.');\n  }\n\n  // Return the entries context object\n  return entriesContext;\n};//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiNDE2LmpzIiwibWFwcGluZ3MiOiI7Ozs7O0FBQUE7O0FBRUE7QUFDbUM7QUFDMEI7O0FBRTdEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ08sSUFBTUUsaUJBQWlCLEdBQUcsU0FBcEJBLGlCQUFpQkEsQ0FBQSxFQUFTO0VBQ3JDO0VBQ0EsSUFBTUMsY0FBYyxHQUFHSCxpREFBVSxDQUFDQywrRUFBYyxDQUFDOztFQUVqRDtFQUNBLElBQUksQ0FBQ0UsY0FBYyxFQUFFO0lBQ25CLE1BQU0sSUFBSUMsS0FBSyxDQUFDLHVJQUF1SSxDQUFDO0VBQzFKOztFQUVBO0VBQ0EsT0FBT0QsY0FBYztBQUN2QixDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcXVpbC8uL2NsaWVudC9ob29rcy91c2VFbnRyaWVzQ29udGV4dC5qcz9iZTExIl0sInNvdXJjZXNDb250ZW50IjpbIi8vKiogVVNFIEVOVFJJRVMgQ09OVEVYVCBIT09LICovXG5cbi8vIEltcG9ydCB1c2VDb250ZXh0IGFuZCBFbnRyaWVzQ29udGV4dCBmb3IgbWFuYWdpbmcgZW50cmllcyBzdGF0ZVxuaW1wb3J0IHsgdXNlQ29udGV4dCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IEVudHJpZXNDb250ZXh0IH0gZnJvbSAnLi4vY29udGV4dC9FbnRyeUNvbnRleHQuanN4JztcblxuLyoqXG4gKiBDdXN0b20gaG9vayB0byBhY2Nlc3MgdGhlIGVudHJpZXMgY29udGV4dC5cbiAqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBFbnRyaWVzQ29udGV4dFZhbHVlXG4gKiBAcHJvcGVydHkge09iamVjdFtdfSBlbnRyaWVzIC0gQW4gYXJyYXkgb2YgZW50cnkgb2JqZWN0cyBmcm9tIHRoZSBlbnRyaWVzIGNvbnRleHQuXG4gKiBAcHJvcGVydHkge3N0cmluZ30gX2lkIC0gVGhlIElEIG9mIHRoZSBlbnRyeS5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBib2R5IC0gVGhlIGNvbnRlbnQgb2YgdGhlIGVudHJ5LlxuICogQHByb3BlcnR5IHtzdHJpbmd9IGNyZWF0ZWRBdCAtIFRpbWVzdGFtcCBvZiB3aGVuIHRoZSBlbnRyeSB3YXMgY3JlYXRlZC5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB1cGRhdGVkQXQgLSBUaW1lc3RhbXAgb2Ygd2hlbiB0aGUgZW50cnkgd2FzIHVwZGF0ZWQuXG4gKlxuICogQHJldHVybnMge0VudHJpZXNDb250ZXh0VmFsdWV9IFRoZSBlbnRyaWVzIGNvbnRleHQgb2JqZWN0LlxuICogQHRocm93cyB7RXJyb3J9IFRocm93cyBhbiBlcnJvciBpZiB1c2VkIG91dHNpZGUgb2YgYW4gRW50cmllc0NvbnRleHRQcm92aWRlci5cbiAqL1xuZXhwb3J0IGNvbnN0IHVzZUVudHJpZXNDb250ZXh0ID0gKCkgPT4ge1xuICAvLyBHZXQgdGhlIGVudHJpZXMgY29udGV4dCB1c2luZyB0aGUgdXNlQ29udGV4dCBob29rXG4gIGNvbnN0IGVudHJpZXNDb250ZXh0ID0gdXNlQ29udGV4dChFbnRyaWVzQ29udGV4dCk7XG5cbiAgLy8gRXJyb3IgaGFuZGxpbmdcbiAgaWYgKCFlbnRyaWVzQ29udGV4dCkge1xuICAgIHRocm93IG5ldyBFcnJvcigndXNlRW50cmllc0NvbnRleHQgbXVzdCBiZSB1c2VkIHdpdGhpbiBhbiBFbnRyaWVzQ29udGV4dFByb3ZpZGVyLiBNYWtlIHN1cmUgeW91ciBjb21wb25lbnQgaXMgd3JhcHBlZCB3aXRoIHRoZSBFbnRyaWVzQ29udGV4dFByb3ZpZGVyLicpO1xuICB9XG5cbiAgLy8gUmV0dXJuIHRoZSBlbnRyaWVzIGNvbnRleHQgb2JqZWN0XG4gIHJldHVybiBlbnRyaWVzQ29udGV4dDtcbn07XG4iXSwibmFtZXMiOlsidXNlQ29udGV4dCIsIkVudHJpZXNDb250ZXh0IiwidXNlRW50cmllc0NvbnRleHQiLCJlbnRyaWVzQ29udGV4dCIsIkVycm9yIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///416\n")}}]);