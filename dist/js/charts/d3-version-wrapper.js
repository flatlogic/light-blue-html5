'use strict';

Object.defineProperty(window, 'd3', {
    get: () => {
        return window.d3VersionWrapper.d3v3 || window.d3VersionWrapper.d3v5;
    },
    set: (d3) => {
        if (d3 !== undefined && !d3.version) {
            // As d3 version 5 is set up to window as 'global.d3 = global.d3 || {}', here we will get d3 argument
            // as empty object. So, have to save its version and proceed
            d3.version = ['5'];
        }

        let version = d3 && d3.version && d3.version[0];

        if (version)
            !window.d3VersionWrapper[`d3v${version}`] && window.d3VersionWrapper.cache(d3);
    }
});

class D3VersionWrapper {
    cache(d3) {
        let version = d3 && d3.version[0];
        let d3Clone = d3;

        if (!version)
            throw new Error('d3 is not defined');

        // This is a fix to be able to use all the features and enhancements from the latest d3 release,
        // when using itself, not as dependency for other libraries.
        this[`d3v${version}`] = this[`d3v${version}`] || d3Clone;
    }
}

window.d3VersionWrapper = window.d3VersionWrapper || new D3VersionWrapper();