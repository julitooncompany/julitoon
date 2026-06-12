// Detector de conexión a internet
(function() {
    // Crear elemento de overlay para no hay conexión
    const overlayHTML = `
        <div id="no-conexion-overlay" style="display: none;">
            <div class="no-conexion-container">
                <div class="no-conexion-content">
                    <div class="wifi-icon">
                  <img src="signal_wifi_bad.svg" alt="No conexión">
                    </div>
                    <div class="no-conexion-text">
                        <p class="titulo">No hay conexión a internet</p>
                        <p class="subtitulo">Para ingresar debes tener conexión a internet</p>
                    </div>
                    <div class="reconnecting-indicator" id="reconnecting-indicator" style="display: none;">
                        <div class="spinner"></div>
                        <p>Reconectando...</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Insertar overlay en el body
    document.addEventListener('DOMContentLoaded', function() {
        document.body.insertAdjacentHTML('beforeend', overlayHTML);
        
        const overlay = document.getElementById('no-conexion-overlay');
        const reconnectingIndicator = document.getElementById('reconnecting-indicator');
        let isOnline = navigator.onLine;
        let checkInterval = null;

        // Función para verificar conexión real (no solo estado del navegador)
        async function checkRealConnection() {
            try {
                // Intenta hacer fetch a un recurso pequeño con cache deshabilitado
                const response = await fetch('https://www.google.com/favicon.ico', {
                    method: 'HEAD',
                    cache: 'no-cache',
                    mode: 'no-cors'
                });
                return true;
            } catch (error) {
                return false;
            }
        }

        // Mostrar overlay de no conexión
        function mostrarNoConexion() {
            overlay.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            // Iniciar verificación periódica
            if (!checkInterval) {
                reconnectingIndicator.style.display = 'flex';
                checkInterval = setInterval(async () => {
                    const online = await checkRealConnection();
                    if (online) {
                        ocultarNoConexion();
                    }
                }, 3000); // Verificar cada 3 segundos
            }
        }

        // Ocultar overlay y restaurar
        function ocultarNoConexion() {
            overlay.style.display = 'none';
            document.body.style.overflow = '';
            reconnectingIndicator.style.display = 'none';
            
            // Detener verificación periódica
            if (checkInterval) {
                clearInterval(checkInterval);
                checkInterval = null;
            }
            
            // Opcional: recargar la página para asegurar que todo esté actualizado
            // location.reload();
        }

        // Listeners para eventos de conexión del navegador
        window.addEventListener('offline', function() {
            isOnline = false;
            mostrarNoConexion();
        });

        window.addEventListener('online', async function() {
            // Verificar que realmente hay conexión
            const reallyOnline = await checkRealConnection();
            if (reallyOnline) {
                isOnline = true;
                ocultarNoConexion();
            }
        });

        // Verificación inicial al cargar la página
        (async function() {
            if (!navigator.onLine) {
                mostrarNoConexion();
            } else {
                // Verificar conexión real incluso si el navegador dice que está online
                const reallyOnline = await checkRealConnection();
                if (!reallyOnline) {
                    mostrarNoConexion();
                }
            }
        })();
    });
})();
