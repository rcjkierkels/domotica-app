export let isCordovaAvailable = () => {
    if (!(<any>window).cordova) {
        console.warn('Native features disabled. Please use a device');
        return false;
    }
    return true;
};