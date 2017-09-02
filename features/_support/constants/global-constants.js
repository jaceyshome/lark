/**
 * Global constant key
 * using process.env to get and set
 */

const GLOBAL_NAMESPACE = "larkRegressionTest";

module.exports = {
    globalNamespace: GLOBAL_NAMESPACE,
    initialViewportSizeWidth: `${GLOBAL_NAMESPACE}_initialViewportSizeWdith`,
    initialViewportSizeHeight: `${GLOBAL_NAMESPACE}_initialViewportSizeHeight`,
    regressionLogs: `${GLOBAL_NAMESPACE}_logs`,
    logs: `${GLOBAL_NAMESPACE}_logs`,
    currentSite: "${GLOBAL_NAMESPACE}_currentSite"
};
