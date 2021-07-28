(function (global) {
	let _fetch;
	let node_context = false;
	if (typeof exports !== 'undefined') {
		if (typeof module !== 'undefined' && !!(module.exports)) {
			_fetch = function (path) {
				let fs = require('fs');
				return new Promise((resolve, reject) => {
					fs.readFile(path, (err, buf) => {
						if (!!err) {
							reject(err);
							return;
						}
						resolve({
							arrayBuffer: () => {
								return new Promise((resolve, reject) => {
									resolve(buf);
								});
							}
						});
					})
				});
			}
			node_context = true;
		} else {
			throw new Exception('module.exports not supported?');
		}
	} else {
		_fetch = fetch;
	}
	(function (fetch) {
		if (node_context) {
			exports = module.exports = Wasm;
		} else {
			global.Wasm = Wasm;
		}
		function Wasm(_url) {
			let module = null;
			let url = _url;
			this.getModule = getModule;
			this.getInstance = getInstance;
			function getModule() {
				if (module === null) {
					return new Promise((resolve, reject) => {
						fetch(url)
							.then(response => response.arrayBuffer())
							.then(buf => {
								WebAssembly.compile(buf)
									.then(_module => {
										module = _module;
										resolve(_module)
									});
							})
							.catch(reason => reject(reason))
					});
				} else {
					return new Promise((resolve, reject) => resolve(module));
				}
			};
			function getInstance(importObjects) {
				if (module === null) {
					return new Promise((resolve, reject) => {
						getModule()
							.then(_module => {
								if (!!importObjects) resolve(new WebAssembly.Instance(_module, importObjects));
								else resolve(new WebAssembly.Instance(_module));
							})
							.catch(reason => reject(reason))
					});
				} else {
					return new Promise((resolve, reject) => {
						if (!!importObjects) resolve(new WebAssembly.Instance(module, importObjects));
						else resolve(new WebAssembly.Instance(module));
					});
				}
			}
		}
	})(_fetch);
})(this);