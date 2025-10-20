// Esperar a que el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const pageContainer = document.getElementById('page-container');
    const content = document.getElementById('content');
    const navLinks = document.querySelectorAll('.nav-link');

    // Función para cargar página desde la raíz
    async function loadPage(pageUrl) {
        // Fade out
        pageContainer.classList.add('fade-out');
        
        try {
            const response = await fetch(pageUrl);
            
            if (!response.ok) {
                throw new Error('Página no encontrada');
            }
            
            const html = await response.text();
            
            // Parsear el HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Extraer el contenido principal
            const mainContent = doc.querySelector('#content');
            
            // Esperar a que termine la animación
            setTimeout(() => {
                // Actualizar contenido
                if (mainContent) {
                    content.innerHTML = mainContent.innerHTML;
                }
                
                // Scroll al inicio
                window.scrollTo(0, 0);
                
                // Fade in
                pageContainer.classList.remove('fade-out');
                
                // Actualizar título de la página
                document.title = doc.title;
                
                // Actualizar navegación activa
                updateActiveNav(pageUrl);
            }, 300);
            
        } catch (error) {
            console.error('Error cargando página:', error);
            content.innerHTML = '<h1>Error 404</h1><p>Página no encontrada</p>';
            pageContainer.classList.remove('fade-out');
        }
    }

    // Actualizar navegación activa
    function updateActiveNav(pageUrl) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');
            if (linkHref === pageUrl) {
                link.classList.add('active');
            }
        });
    }

    // Event listeners para los enlaces
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageUrl = link.getAttribute('href');
            loadPage(pageUrl);
            
            // Actualizar URL sin recargar
            history.pushState({ page: pageUrl }, '', pageUrl);
        });
    });

    // Manejar botón atrás/adelante del navegador
    window.addEventListener('popstate', (e) => {
        if (e.state && e.state.page) {
            loadPage(e.state.page);
        } else {
            location.reload();
        }
    });

    // Estado inicial
    history.replaceState({ page: window.location.pathname }, '', window.location.pathname);
});