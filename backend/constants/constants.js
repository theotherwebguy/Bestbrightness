const { networkInterfaces } = require('os');

// Function to get the IP address
const getIPAddress = () => {
    const interfaces = networkInterfaces();
    for (const interfaceName in interfaces) {
        const interfaceInfo = interfaces[interfaceName];
        for (const iface of interfaceInfo) {
            if (!iface.internal && iface.family === 'IPv4') {
                return iface.address;
            }
        }
    }
    return null; // Return null if no IP address found
};

module.exports = { getIPAddress };