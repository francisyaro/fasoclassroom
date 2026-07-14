// COURSES et store sont accédés directement depuis le scope global

// Global variables for active sessions
let activeCourse = null;
let activeLesson = null;
let activeModule = null;
let activeQuiz = null; 
let activeQuizAnswers = []; 
let currentQuestionIndex = 0;
let examTimerInterval = null;
let examTimeRemaining = 0;
let cheatCount = 0;
const MAX_CHEAT_ATTEMPTS = 3;
let isExamActive = false;

// Carousel State
let carouselCurrentIndex = 0;

// DOM Elements
let pages = {};
let sidebarLinks = [];
let mainSidebar = null;
let mobileSidebarToggle = null;
let viewportTitle = null;
let btnLoginSidebar = null;
let profileCompact = null;
let sidebarAvatar = null;
let themeToggle = null;

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    // Initialize DOM references dynamically
    pages = {
        dashboard: document.getElementById('page-dashboard'),
        catalog: document.getElementById('page-catalog'),
        player: document.getElementById('page-player'),
        quiz: document.getElementById('page-quiz'),
        verify: document.getElementById('page-verify'),
        backoffice: document.getElementById('page-backoffice')
    };

    sidebarLinks = document.querySelectorAll('.sidebar-link');
    mainSidebar = document.getElementById('main-sidebar');
    mobileSidebarToggle = document.getElementById('mobile-sidebar-toggle');
    viewportTitle = document.getElementById('viewport-title');
    btnLoginSidebar = document.getElementById('btn-login-sidebar');
    profileCompact = document.getElementById('profile-compact');
    sidebarAvatar = document.getElementById('sidebar-avatar');
    themeToggle = document.getElementById('theme-toggle');

    setupTheme();
    setupNavigation();
    setupAuth();
    setupCarousel();
    checkUrlParams();

    // Check active session status
    const urlParams = new URLSearchParams(window.location.search);
    const hasParams = urlParams.has('page') || urlParams.has('certId');
    const currentUser = store.getCurrentUser();
    
    updateUserUI();
    
    if (currentUser && hasParams) {
        showAppShell();
        
        // Ensure default role
        if (!currentUser.role) {
            currentUser.role = "Étudiant";
            store.save();
        }
        
        if (currentUser.role === "Formateur") {
            navigateTo('backoffice');
        } else {
            navigateTo('dashboard');
        }
        renderDashboard();
    } else {
        showLandingPage();
    }
}

// ==========================================
// THEME & STYLING
// ==========================================
function setupTheme() {
    const savedTheme = localStorage.getItem('fasoclassroom_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('fasoclassroom_theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    if (theme === 'dark') {
        themeToggle.innerHTML = `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z"></path></svg>`;
    } else {
        themeToggle.innerHTML = `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>`;
    }
}

// ==========================================
// NAVIGATION & ROUTING
// ==========================================
function setupNavigation() {
    if (sidebarLinks && sidebarLinks.forEach) {
        sidebarLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const pageName = link.getAttribute('data-page');
                navigateTo(pageName);
                if (mainSidebar) mainSidebar.classList.remove('open'); // Close drawer on mobile click
            });
        });
    }

    // Mobile sidebar toggle
    if (mobileSidebarToggle && mainSidebar) {
        mobileSidebarToggle.addEventListener('click', () => {
            mainSidebar.classList.toggle('open');
        });
    }

    // Dashboard Banner button
    const dashExploreBtn = document.getElementById('dash-explore-btn');
    if (dashExploreBtn) {
        dashExploreBtn.addEventListener('click', () => {
            navigateTo('catalog');
        });
    }

    // Handle course player back btn
    const playerBackBtn = document.getElementById('player-back-btn');
    if (playerBackBtn) {
        playerBackBtn.addEventListener('click', () => {
            navigateTo('dashboard');
        });
    }
}

function toggleDesktopSidebar() {
    const appShell = document.querySelector('.app-shell');
    if (appShell) {
        appShell.classList.toggle('sidebar-hidden');
    }
}
window.toggleDesktopSidebar = toggleDesktopSidebar;

function navigateTo(pageName, params = {}) {
    if (isExamActive) {
        if (!confirm("Attention : Quitter cette page annulera votre examen en cours. Êtes-vous sûr ?")) {
            return;
        }
        stopExam(false);
    }

    // Hide all pages
    Object.values(pages).forEach(p => {
        if (p) p.classList.remove('active');
    });
    sidebarLinks.forEach(l => {
        if (l) l.classList.remove('active');
    });

    // Show target page
    if (pages[pageName]) {
        pages[pageName].classList.add('active');
    }

    // Highlight menu
    const targetLink = document.querySelector(`.sidebar-link[data-page="${pageName}"]`);
    if (targetLink) {
        targetLink.classList.add('active');
    }

    // Update Header Page Title
    const pageTitles = {
        dashboard: "Mon Tableau de bord",
        catalog: "Catalogue des cours",
        player: "Lecteur de cours",
        quiz: "Évaluation",
        verify: "Vérification de certificat",
        backoffice: "Espace Formateur & Administration"
    };
    if (viewportTitle) {
        viewportTitle.textContent = pageTitles[pageName] || "Fasoclassroom";
    }

    // Manage Sticky bottom player bar visibility
    const stickyPlayerBar = document.getElementById('sticky-player-bar');
    if (stickyPlayerBar) {
        if (pageName === 'player') {
            stickyPlayerBar.style.display = 'flex';
        } else {
            stickyPlayerBar.style.display = 'none';
        }
    }

    // Custom updates
    if (pageName === 'catalog') {
        renderCatalog();
    } else if (pageName === 'dashboard') {
        renderDashboard();
    } else if (pageName === 'verify') {
        initVerifyPage(params.certId);
    } else if (pageName === 'backoffice') {
        initBackOfficePage();
    }

    // Update URL hash/query without reload
    let newUrl = window.location.pathname;
    if (pageName === 'verify' && params.certId) {
        newUrl += `?page=verify&certId=${params.certId}`;
    } else if (pageName !== 'dashboard') {
        newUrl += `?page=${pageName}`;
    }
    window.history.pushState({}, '', newUrl);
}

function checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page');
    const certId = urlParams.get('certId');

    if (page === 'verify') {
        navigateTo('verify', { certId });
    } else if (page && pages[page]) {
        navigateTo(page);
    }
}

// ==========================================
// AUTHENTICATION & LANDING CONTROLLERS
// ==========================================
function showLandingPage() {
    document.getElementById('landing-container').style.display = 'block';
    document.getElementById('auth-container').style.display = 'none';
    document.querySelector('.app-shell').style.display = 'none';
}

function showAuthPage() {
    document.getElementById('landing-container').style.display = 'none';
    document.getElementById('auth-container').style.display = 'block';
    document.querySelector('.app-shell').style.display = 'none';
    showAuthEmailStep();
}

function showAppShell() {
    document.getElementById('landing-container').style.display = 'none';
    document.getElementById('auth-container').style.display = 'none';
    document.querySelector('.app-shell').style.display = 'flex';
    
    const user = store.getCurrentUser();
    if (user) {
        if (user.role === "Formateur") {
            navigateTo('backoffice');
        } else {
            navigateTo('dashboard');
        }
        renderDashboard();
    }
}

window.showLandingPage = showLandingPage;
window.showAuthPage = showAuthPage;
window.showAppShell = showAppShell;

function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
    }
}
window.scrollToSection = scrollToSection;

function showAuthEmailStep() {
    document.getElementById('auth-step-email').style.display = 'block';
    document.getElementById('auth-step-password').style.display = 'none';
    document.getElementById('auth-step-register').style.display = 'none';
    document.getElementById('auth-email').value = '';
    document.getElementById('auth-password').value = '';
    document.getElementById('auth-register-password').value = '';
    document.getElementById('auth-title').textContent = "Bienvenue";
    document.getElementById('auth-subtitle').textContent = "Connexion ou création de compte en 1 minute";
}
window.showAuthEmailStep = showAuthEmailStep;

async function handleAuthEmail() {
    const emailInput = document.getElementById('auth-email');
    const email = emailInput.value.trim();
    if (!email) {
        alert("Veuillez saisir une adresse e-mail valide.");
        return;
    }

    const btn = document.getElementById('btn-auth-email-continue');
    const originalText = btn.textContent;
    btn.textContent = "Vérification...";
    btn.disabled = true;

    try {
        const exists = await store.checkEmailExists(email);
        btn.textContent = originalText;
        btn.disabled = false;

        document.getElementById('auth-step-email').style.display = 'none';
        if (exists) {
            document.getElementById('auth-step-password').style.display = 'block';
            document.getElementById('auth-title').textContent = "Connexion";
            document.getElementById('auth-subtitle').textContent = "Saisissez votre mot de passe pour vous connecter";
        } else {
            document.getElementById('auth-step-register').style.display = 'block';
            document.getElementById('auth-title').textContent = "Créer un compte";
            document.getElementById('auth-subtitle').textContent = "Définissez vos informations de connexion";
        }
    } catch (e) {
        btn.textContent = originalText;
        btn.disabled = false;
        alert("Erreur lors de la vérification : " + e.message);
    }
}
window.handleAuthEmail = handleAuthEmail;

async function handleAuthLoginWithPassword() {
    const email = document.getElementById('auth-email').value.trim();
    const password = document.getElementById('auth-password').value;
    if (!password) {
        alert("Veuillez saisir votre mot de passe.");
        return;
    }

    const btn = document.getElementById('btn-auth-login-submit');
    const originalText = btn.textContent;
    btn.textContent = "Connexion...";
    btn.disabled = true;

    try {
        await store.signInUser(email, password);
        btn.textContent = originalText;
        btn.disabled = false;

        updateUserUI();
        showAppShell();
    } catch (e) {
        btn.textContent = originalText;
        btn.disabled = false;
        alert("Erreur de connexion : " + e.message);
    }
}
window.handleAuthLoginWithPassword = handleAuthLoginWithPassword;

async function handleAuthRegister() {
    const nameInput = document.getElementById('auth-name');
    const passwordInput = document.getElementById('auth-register-password');
    const roleSelect = document.getElementById('auth-role');
    const email = document.getElementById('auth-email').value.trim();
    const name = nameInput.value.trim();
    const password = passwordInput.value;
    const role = roleSelect.value;

    if (!name) {
        alert("Veuillez saisir votre nom complet.");
        return;
    }
    if (!password || password.length < 6) {
        alert("Le mot de passe doit contenir au moins 6 caractères.");
        return;
    }

    const btn = document.getElementById('btn-auth-register-submit');
    const originalText = btn.textContent;
    btn.textContent = "Inscription...";
    btn.disabled = true;

    try {
        await store.signUpUser(email, password, name, role);
        btn.textContent = originalText;
        btn.disabled = false;

        updateUserUI();
        showAppShell();
    } catch (e) {
        btn.textContent = originalText;
        btn.disabled = false;
        alert("Erreur lors de l'inscription : " + e.message);
    }
}
window.handleAuthRegister = handleAuthRegister;

function handleSocialLogin(provider) {
    const name = provider + " User";
    const email = provider.toLowerCase() + "@example.com";
    
    store.loginMockUser(name, email);
    store.getCurrentUser().role = "Étudiant";
    store.save();

    updateUserUI();
    showAppShell();
    navigateTo('dashboard');
}
window.handleSocialLogin = handleSocialLogin;

function setupAuth() {
    if (btnLoginSidebar) {
        btnLoginSidebar.addEventListener('click', async () => {
            if (store.getCurrentUser()) {
                await store.logout();
                updateUserUI();
                showLandingPage();
            } else {
                showAuthPage();
            }
        });
    }

    store.subscribe(() => {
        updateUserUI();
    });
}

function updateUserUI() {
    const user = store.getCurrentUser();
    const landingAuthContainer = document.getElementById('landing-auth-btn-container');
    
    if (user) {
        // Update landing page header connection state
        if (landingAuthContainer) {
            landingAuthContainer.innerHTML = `
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <span style="font-size: 0.9rem; font-weight: 600; color: #1e1e1c;">Bonjour, ${user.name}</span>
                    <button class="btn btn-primary" onclick="showAppShell()" style="background: #5C2D91; border-color: #5C2D91; font-size: 0.85rem; padding: 0.5rem 1rem;">Mon espace</button>
                </div>
            `;
        }
        
        if (btnLoginSidebar) {
            btnLoginSidebar.textContent = "Déconnexion";
            btnLoginSidebar.className = "btn btn-outline";
        }
        if (profileCompact) profileCompact.style.display = "flex";
        if (sidebarAvatar) sidebarAvatar.textContent = user.name.split(' ').map(n => n[0]).join('');
        const nameEl = document.getElementById('sidebar-user-name');
        if (nameEl) nameEl.textContent = user.name;
        
        // Hide/show back-office tab based on role
        const sideBO = document.getElementById('side-backoffice');
        if (sideBO) {
            if (user.role === "Formateur") {
                sideBO.style.display = "flex";
            } else {
                sideBO.style.display = "none";
            }
        }
    } else {
        // Restore landing page header connection button
        if (landingAuthContainer) {
            landingAuthContainer.innerHTML = `
                <button class="btn btn-outline" onclick="showAuthPage()" style="border-color: #5C2D91; color: #5C2D91; font-size: 0.85rem; padding: 0.5rem 1rem;">Connexion</button>
            `;
        }
        
        if (btnLoginSidebar) {
            btnLoginSidebar.textContent = "Connexion";
            btnLoginSidebar.className = "btn btn-primary";
        }
        if (profileCompact) profileCompact.style.display = "none";
    }
}


// ==========================================
// PAGE 1: DASHBOARD & STATS & CAROUSEL
// ==========================================
function renderDashboard() {
    const user = store.getCurrentUser();
    if (!user) {
        navigateTo('catalog');
        return;
    }

    // Update enrollment dossier status dynamically based on payment status
    const hasPaid = store.hasPaid();
    const finalLine = document.getElementById('dossier-step-line-final');
    const finalItem = document.getElementById('dossier-step-item-final');
    const statusText = document.getElementById('dossier-status-text');
    const actionBtn = document.getElementById('dossier-action-btn');
    
    if (hasPaid) {
        if (finalLine) finalLine.className = 'step-line active';
        if (finalItem) finalItem.className = 'step-item active';
        if (statusText) statusText.textContent = "Félicitations, votre dossier d'inscription est finalisé et validé !";
        if (actionBtn) {
            actionBtn.textContent = "Dossier validé ✅";
            actionBtn.disabled = true;
            actionBtn.style.background = '#25d366';
            actionBtn.style.borderColor = '#25d366';
            actionBtn.onclick = null;
        }
    } else {
        if (finalLine) finalLine.className = 'step-line';
        if (finalItem) finalItem.className = 'step-item';
        if (statusText) statusText.textContent = "Votre dossier est complété à 66%. Finalisez-le pour accéder à vos cours officiels.";
        if (actionBtn) {
            actionBtn.textContent = "Finaliser et Payer (15 000 FCFA)";
            actionBtn.disabled = false;
            actionBtn.style.background = '#5C2D91';
            actionBtn.style.borderColor = '#5C2D91';
            actionBtn.onclick = () => openCheckoutModal();
        }
    }

    // Compute Statistics
    let startedCount = 0;
    let completedCount = 0;
    let completedLessonsCount = 0;

    store.getCourses().forEach(course => {
        const p = store.getCourseState(course.id);
        if (p) {
            if (p.completedLessons.length > 0) startedCount++;
            if (p.completed) completedCount++;
            completedLessonsCount += p.completedLessons.length;
        }
    });

    // Populate statistics UI
    document.getElementById('stat-hours').textContent = 10 + (completedLessonsCount * 2); // Simulated hours
    document.getElementById('stat-lessons-completed').textContent = completedLessonsCount;
    document.getElementById('stat-certs-unlocked').textContent = completedCount;

    // Render Active Courses List
    const activeContainer = document.getElementById('active-courses-container');
    activeContainer.innerHTML = '';

    let hasActive = false;
    store.getCourses().forEach(course => {
        const p = store.getCourseState(course.id);
        if (p && p.completedLessons.length > 0 && !p.completed) {
            hasActive = true;
            const percent = store.getCourseProgress(course.id);
            
            const activeItem = document.createElement('div');
            activeItem.className = "progress-item";
            activeItem.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                    <strong style="font-size: 0.95rem;">${course.title}</strong>
                    <span style="font-size: 0.85rem; color: var(--accent); font-weight: 700;">${percent}%</span>
                </div>
                <div class="progress-bar-container" style="margin-bottom: 0.8rem;">
                    <div class="progress-bar-fill" style="width: ${percent}%;"></div>
                </div>
                <button class="btn btn-primary resume-btn" data-id="${course.id}" style="padding: 0.4rem 0.8rem; font-size: 0.75rem;">
                    Reprendre le cours
                </button>
            `;
            activeItem.querySelector('.resume-btn').addEventListener('click', () => {
                startCourse(course.id);
            });
            activeContainer.appendChild(activeItem);
        }
    });

    if (!hasActive && activeContainer) {
        activeContainer.innerHTML = `
            <div style="text-align: center; padding: 1.5rem 0;">
                <p style="color: var(--text-dim); font-size: 0.9rem; margin-bottom: 1rem;">Vous n'avez aucun cours actif.</p>
                <button class="btn btn-outline" id="dash-empty-explore" style="font-size: 0.75rem;">Découvrir les formations</button>
            </div>
        `;
        const btnEmptyExplore = activeContainer.querySelector('#dash-empty-explore');
        if (btnEmptyExplore) {
            btnEmptyExplore.addEventListener('click', () => {
                navigateTo('catalog');
            });
        }
    }

    // Render Certificates List
    const certsContainer = document.getElementById('dashboard-certs-container');
    certsContainer.innerHTML = '';
    
    const studentCerts = store.getAllStudentCertificates();
    if (studentCerts.length > 0) {
        studentCerts.forEach(cert => {
            const certItem = document.createElement('div');
            certItem.className = "cert-item";
            certItem.style.cssText = "display: flex; justify-content: space-between; align-items: center; padding: 0.8rem; border-radius: var(--radius-md); background: rgba(255,255,255,0.02); border: 1px solid var(--border-color); margin-bottom: 0.5rem;";
            certItem.innerHTML = `
                <div>
                    <strong style="display: block; font-size: 0.85rem;">${cert.courseTitle}</strong>
                    <span style="font-size: 0.7rem; color: var(--text-dim);">Délivré le : ${cert.date}</span>
                </div>
                <button class="btn btn-outline view-cert-btn" style="padding: 0.35rem 0.7rem; font-size: 0.7rem;">
                    Voir PDF
                </button>
            `;
            certItem.querySelector('.view-cert-btn').addEventListener('click', () => {
                navigateTo('verify', { certId: cert.uuid });
            });
            certsContainer.appendChild(certItem);
        });
    } else {
        certsContainer.innerHTML = `<p style="color: var(--text-dim); font-size: 0.85rem; text-align: center; padding: 1rem 0;">Aucun certificat obtenu pour le moment.</p>`;
    }

    // Update recommended carousel track
    renderCarouselItems();
}

// Recommended Carousel logic
function setupCarousel() {
    const btnPrev = document.getElementById('carousel-prev');
    const btnNext = document.getElementById('carousel-next');
    const track = document.getElementById('recommended-carousel-track');

    if (btnPrev && btnNext && track) {
        btnPrev.addEventListener('click', () => {
            if (carouselCurrentIndex > 0) {
                carouselCurrentIndex--;
                updateCarouselOffset();
            }
        });

        btnNext.addEventListener('click', () => {
            const cardsCount = track.children.length;
            if (carouselCurrentIndex < cardsCount - 1) {
                carouselCurrentIndex++;
                updateCarouselOffset();
            }
        });
    }
}

function renderCarouselItems() {
    const track = document.getElementById('recommended-carousel-track');
    track.innerHTML = '';

    store.getCourses().forEach(course => {
        const card = document.createElement('div');
        card.className = "card carousel-card";
        card.style.background = `linear-gradient(135deg, hsla(252, 80%, 30%, 0.15), var(--bg-card))`;
        card.innerHTML = `
            <div>
                <span style="font-size: 0.7rem; font-weight: 700; color: var(--accent); text-transform: uppercase;">Recommandé</span>
                <h4 style="font-size: 1rem; margin-top: 0.4rem; line-height: 1.3;">${course.title}</h4>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem;">
                <span style="font-size: 0.75rem; color: var(--text-dim);">⏱️ ${course.duration}</span>
                <button class="btn btn-primary start-carousel-btn" style="padding: 0.4rem 0.8rem; font-size: 0.75rem; box-shadow: none;">
                    Découvrir
                </button>
            </div>
        `;

        card.querySelector('.start-carousel-btn').addEventListener('click', () => {
            navigateTo('catalog');
        });

        track.appendChild(card);
    });

    carouselCurrentIndex = 0;
    updateCarouselOffset();
}

function updateCarouselOffset() {
    const track = document.getElementById('recommended-carousel-track');
    if (track.children.length === 0) return;
    const cardWidth = 250 + 16; // width + gap
    track.style.transform = `translateX(-${carouselCurrentIndex * cardWidth}px)`;
}

// ==========================================
// PAGE 2: CATALOGUE
// ==========================================
function renderCatalog() {
    const container = document.getElementById('catalog-courses-container');
    container.innerHTML = '';

    // Search filter setup
    const searchInput = document.getElementById('catalog-search');
    searchInput.oninput = () => {
        filterCatalogCourses(searchInput.value.toLowerCase());
    };

    filterCatalogCourses('');
}

function filterCatalogCourses(filterText) {
    const container = document.getElementById('catalog-courses-container');
    container.innerHTML = '';

    const filtered = store.getCourses().filter(c => 
        c.title.toLowerCase().includes(filterText) || 
        c.description.toLowerCase().includes(filterText)
    );

    if (filtered.length === 0) {
        container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-dim); padding: 2rem;">Aucun cours ne correspond à votre recherche.</p>`;
        return;
    }

    filtered.forEach(course => {
        const progressState = store.getCourseState(course.id);
        const percent = store.getCourseProgress(course.id);
        
        let actionBtnText = "Commencer la formation";
        let actionClass = "btn-primary";
        
        if (progressState) {
            if (progressState.completed) {
                actionBtnText = "Certifié - Voir Certificat";
                actionClass = "btn-outline";
            } else if (percent > 0) {
                actionBtnText = `Continuer (${percent}%)`;
                actionClass = "btn-primary";
            }
        }

        const coverImg = 'assets/' + course.id.replace(/-/g, '_') + '_cover.jpg';

        const card = document.createElement('div');
        card.className = "card course-card";
        card.innerHTML = `
            <div class="course-thumbnail" style="height: 140px; border-radius: var(--radius-md); margin-bottom: 1rem; overflow: hidden; border: 1px solid var(--border-color);">
                <img src="${coverImg}" alt="${course.title}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
            </div>
            <span class="course-badge lvl-${course.level}">${course.levelText}</span>
            <h3 class="course-title">${course.title}</h3>
            <p class="course-desc">${course.description}</p>
            <div class="course-meta" style="margin-bottom: 1.2rem;">
                <span>⏱️ ${course.duration}</span>
                <span>📚 ${course.lessonsCount} leçons</span>
            </div>
            <button class="btn ${actionClass} start-course-btn" data-id="${course.id}" style="width: 100%; justify-content: center;">
                ${actionBtnText}
            </button>
        `;

        card.querySelector('.start-course-btn').addEventListener('click', () => {
            if (!store.getCurrentUser()) {
                store.loginMockUser();
            }

            if (progressState && progressState.completed) {
                navigateTo('verify', { certId: progressState.certificateId });
            } else {
                startCourse(course.id);
            }
        });

        container.appendChild(card);
    });
}

// ==========================================
// PAGE 3: COURSE PLAYER & STICKY BOTTOM BAR
// ==========================================
function startCourse(courseId) {
    activeCourse = store.getCourses().find(c => c.id === courseId);
    if (!activeCourse) return;

    navigateTo('player');

    // Update sticky bottom course title
    document.getElementById('sticky-course-title').textContent = activeCourse.title;

    // Build sidebar tree navigation
    renderPlayerSidebar();

    // Auto-open first incomplete lesson
    let targetLesson = null;
    const progress = store.getCourseState(courseId);

    outerLoop:
    for (const mod of activeCourse.modules) {
        for (const chap of mod.chapters) {
            for (const les of chap.lessons) {
                if (!progress.completedLessons.includes(les.id) && store.isLessonUnlocked(courseId, les.id)) {
                    targetLesson = les;
                    activeModule = mod;
                    break outerLoop;
                }
            }
        }
    }

    if (!targetLesson && activeCourse.modules[0]?.chapters[0]?.lessons[0]) {
        targetLesson = activeCourse.modules[0].chapters[0].lessons[0];
        activeModule = activeCourse.modules[0];
    }

    if (targetLesson) {
        loadLesson(targetLesson);
    }
}

function updateStickyBarUI() {
    const percent = store.getCourseProgress(activeCourse.id);
    document.getElementById('sticky-progress-fill').style.width = `${percent}%`;
    document.getElementById('sticky-progress-text').textContent = `Progression : ${percent}%`;
    document.getElementById('sticky-lesson-title').textContent = activeLesson ? activeLesson.title : '';
}

function renderPlayerSidebar() {
    const accordion = document.getElementById('player-modules-accordion');
    accordion.innerHTML = '';

    activeCourse.modules.forEach(mod => {
        const modContainer = document.createElement('div');
        modContainer.className = "module-accordion";

        const hasPassedQuiz = store.hasPassedQuiz(activeCourse.id, mod.id);
        const quizStatusIcon = hasPassedQuiz ? ' ✅' : '';

        let lessons = [];
        mod.chapters.forEach(ch => {
            lessons = lessons.concat(ch.lessons);
        });

        const progress = store.getCourseState(activeCourse.id);
        const completedCount = lessons.filter(l => progress.completedLessons.includes(l.id)).length;
        const allCompleted = completedCount === lessons.length;

        modContainer.innerHTML = `
            <div class="module-header">
                <div>
                    <span style="display: block; font-size: 0.75rem; color: var(--primary-light);">Module</span>
                    <span>${mod.title}</span>
                </div>
                <span style="font-size: 0.75rem; color: var(--text-dim);">${completedCount}/${lessons.length}${quizStatusIcon}</span>
            </div>
            <ul class="module-lessons"></ul>
        `;

        const lessonsList = modContainer.querySelector('.module-lessons');

        mod.chapters.forEach(chap => {
            const chapTitle = document.createElement('li');
            chapTitle.style.cssText = "padding: 0.4rem 1rem; font-size: 0.7rem; font-weight: 700; color: var(--text-dim); text-transform: uppercase; background: rgba(255,255,255,0.01);";
            chapTitle.textContent = chap.title;
            lessonsList.appendChild(chapTitle);

            chap.lessons.forEach(lesson => {
                const isUnlocked = store.isLessonUnlocked(activeCourse.id, lesson.id);
                const isCompleted = progress.completedLessons.includes(lesson.id);

                const item = document.createElement('li');
                item.className = `lesson-item ${!isUnlocked ? 'locked' : ''} ${isCompleted ? 'completed' : ''} ${activeLesson?.id === lesson.id ? 'active' : ''}`;
                
                const icon = lesson.type === 'video' ? '📹' : (lesson.type === 'exercise' ? '💻' : '📄');
                item.innerHTML = `
                    <span class="lesson-status"></span>
                    <span style="flex-grow: 1;">${icon} ${lesson.title}</span>
                    <span style="font-size: 0.7rem; color: var(--text-dim);">${lesson.duration}</span>
                `;

                if (isUnlocked) {
                    item.addEventListener('click', () => {
                        activeModule = mod;
                        loadLesson(lesson);
                    });
                }

                lessonsList.appendChild(item);
            });
        });

        // Add Quiz link
        if (mod.quiz) {
            const quizItem = document.createElement('li');
            const isQuizUnlocked = allCompleted; 
            
            quizItem.className = `lesson-item ${!isQuizUnlocked ? 'locked' : ''} ${hasPassedQuiz ? 'completed' : ''}`;
            quizItem.innerHTML = `
                <span class="lesson-status" style="border-radius: 2px;"></span>
                <span style="flex-grow: 1; font-weight: 600; color: var(--primary-light);">📝 Évaluation : ${mod.quiz.title}</span>
            `;

            if (isQuizUnlocked) {
                quizItem.addEventListener('click', () => {
                    startQuiz(mod.quiz, mod);
                });
            }
            lessonsList.appendChild(quizItem);
        }

        accordion.appendChild(modContainer);
    });

    // Add Final Exam section
    const progress = store.getCourseState(activeCourse.id);
    const totalModulesCount = activeCourse.modules.length;
    const passedQuizzesCount = progress.passedQuizzes.length;
    const examUnlocked = passedQuizzesCount === totalModulesCount;
    
    const examHeader = document.createElement('div');
    examHeader.className = "module-accordion";
    examHeader.style.marginTop = "1rem";
    examHeader.innerHTML = `
        <div class="module-header" id="sidebar-exam-btn" style="background: ${examUnlocked ? 'var(--primary-glow)' : 'rgba(0,0,0,0.1)'}; border: 1px solid ${examUnlocked ? 'var(--primary)' : 'transparent'}; cursor: ${examUnlocked ? 'pointer' : 'not-allowed'}; opacity: ${examUnlocked ? '1' : '0.5'};">
            <div style="display: flex; align-items: center; gap: 0.5rem; width: 100%;">
                <span style="font-size: 1.1rem;">🎓</span>
                <div style="flex-grow: 1;">
                    <span style="display: block; font-size: 0.7rem; color: var(--warning); font-weight: 700; text-transform: uppercase;">Examen de Certification</span>
                    <span style="font-size: 0.8rem;">Lancer l'épreuve</span>
                </div>
                <span style="font-size: 1rem;">🔒</span>
            </div>
        </div>
    `;

    if (examUnlocked) {
        examHeader.querySelector('#sidebar-exam-btn').addEventListener('click', () => {
            startQuiz(activeCourse.exam, null, true);
        });
    }
    accordion.appendChild(examHeader);
}

function loadLesson(lesson) {
    activeLesson = lesson;
    updatePlayerSidebarActiveState();
    updateStickyBarUI();

    const viewer = document.getElementById('lesson-content-viewer');
    viewer.innerHTML = '';

    const header = document.createElement('div');
    header.style.marginBottom = '1.5rem';
    
    let badgeText = "Fiche de cours";
    if (lesson.type === 'video') badgeText = "Vidéo";
    if (lesson.type === 'exercise') badgeText = "Exercice pratique";

    header.innerHTML = `
        <span class="course-badge" style="margin-bottom: 0.5rem;">${badgeText}</span>
        <h2 style="margin: 0; font-size: 1.5rem;">${lesson.title}</h2>
    `;
    viewer.appendChild(header);

    if (lesson.type === 'video') {
        const videoWrapper = document.createElement('div');
        videoWrapper.className = "content-video-wrapper";
        videoWrapper.innerHTML = `
            <iframe src="${lesson.videoUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        `;
        viewer.appendChild(videoWrapper);
    }

    const body = document.createElement('div');
    body.className = "content-body";
    body.innerHTML = lesson.type === 'exercise' ? lesson.instructions : lesson.content;
    viewer.appendChild(body);

    if (lesson.type === 'document' && lesson.documentUrl) {
        const downloadBox = document.createElement('div');
        downloadBox.style.cssText = "margin-top: 2rem; padding: 1rem; background: rgba(255,255,255,0.02); border: 1px dashed var(--border-color); border-radius: var(--radius-md); display: flex; justify-content: space-between; align-items: center;";
        downloadBox.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span style="font-size: 1.5rem;">📄</span>
                <div>
                    <strong style="display: block; font-size: 0.9rem;">${lesson.documentUrl}</strong>
                    <span style="font-size: 0.75rem; color: var(--text-dim);">Fiche récapitulative de cours</span>
                </div>
            </div>
            <button class="btn btn-outline" style="font-size: 0.75rem; padding: 0.4rem 0.8rem;" onclick="alert('Document téléchargé !')">
                Télécharger PDF
            </button>
        `;
        viewer.appendChild(downloadBox);
    }

    if (lesson.type === 'exercise') {
        const sandbox = document.createElement('div');
        sandbox.className = "code-sandbox-container";
        sandbox.innerHTML = `
            <div class="editor-header-bar">
                <div class="mac-buttons">
                    <div class="mac-dot red"></div>
                    <div class="mac-dot yellow"></div>
                    <div class="mac-dot green"></div>
                </div>
                <div class="editor-tab-title">${lesson.id.includes('saas') ? 'isolation.sql' : 'srp_refactoring.js'}</div>
            </div>
            <textarea class="code-editor-textarea" id="sandbox-textarea" spellcheck="false" placeholder="Écrivez votre code ici..."></textarea>
            <div class="sandbox-console-box" id="sandbox-console">
                <div class="console-output-line">> Prêt pour l'évaluation. Saisissez votre code ci-dessus.</div>
            </div>
            <div class="sandbox-actions-bar">
                <button class="btn btn-outline" id="btn-sandbox-hint" style="font-size: 0.75rem; padding: 0.4rem 0.8rem;">Indice</button>
                <button class="btn btn-primary" id="btn-sandbox-run" style="font-size: 0.75rem; padding: 0.4rem 0.8rem;">Lancer les tests</button>
            </div>
        `;
        viewer.appendChild(sandbox);

        const textarea = sandbox.querySelector('#sandbox-textarea');
        const consoleBox = sandbox.querySelector('#sandbox-console');
        const btnHint = sandbox.querySelector('#btn-sandbox-hint');
        const btnRun = sandbox.querySelector('#btn-sandbox-run');

        textarea.value = lesson.starterCode;

        btnHint.onclick = () => {
            consoleBox.innerHTML = `<div class="console-output-line">> Indice : ${lesson.hint}</div>`;
        };

        btnRun.onclick = () => {
            const code = textarea.value.trim();
            const regex = new RegExp(lesson.solutionPattern, 'i');
            
            if (regex.test(code)) {
                consoleBox.innerHTML = `
                    <div class="console-output-line success">> ✓ Tous les tests ont été validés avec succès !</div>
                    <div class="console-output-line success">> Exercice réussi. Vous pouvez cliquer sur le bouton de complétion.</div>
                `;
                textarea.setAttribute('data-passed', 'true');
                setupStickyNavigationButtons(); 
            } else {
                consoleBox.innerHTML = `
                    <div class="console-output-line error">> ✕ Échec des tests.</div>
                    <div class="console-output-line error">> La vérification automatique a échoué. Corrigez le code et réessayez.</div>
                `;
                textarea.removeAttribute('data-passed');
                setupStickyNavigationButtons();
            }
        };
    }

    // Configure sticky bottom bar buttons
    setupStickyNavigationButtons();
}

function updatePlayerSidebarActiveState() {
    document.querySelectorAll('.lesson-item').forEach(item => {
        item.classList.remove('active');
    });
    renderPlayerSidebar();
}

function setupStickyNavigationButtons() {
    const btnStickyPrev = document.getElementById('btn-sticky-prev');
    const btnStickyNext = document.getElementById('btn-sticky-next');

    // Linear list of lessons
    const lessons = [];
    activeCourse.modules.forEach(m => {
        m.chapters.forEach(ch => {
            lessons.push(...ch.lessons);
        });
    });

    const index = lessons.findIndex(l => l.id === activeLesson.id);

    // Prev Button
    if (index > 0) {
        btnStickyPrev.style.display = 'inline-flex';
        btnStickyPrev.onclick = () => {
            loadLesson(lessons[index - 1]);
        };
    } else {
        btnStickyPrev.style.display = 'none';
    }

    // Next / Complete Button
    const progress = store.getCourseState(activeCourse.id);
    const isCompleted = progress.completedLessons.includes(activeLesson.id);

    if (!isCompleted) {
        btnStickyNext.textContent = "Marquer terminé";
        btnStickyNext.className = "btn btn-primary";
        btnStickyNext.onclick = () => {
            // If active lesson is exercise, check if passed
            if (activeLesson.type === 'exercise') {
                const textarea = document.getElementById('sandbox-textarea');
                if (!textarea || textarea.getAttribute('data-passed') !== 'true') {
                    alert("Veuillez d'abord réussir l'exercice en cliquant sur 'Lancer les tests' !");
                    return;
                }
            }
            
            store.markLessonComplete(activeCourse.id, activeLesson.id);
            updateStickyBarUI();
            
            // Advance
            if (index < lessons.length - 1) {
                const nextLesson = lessons[index + 1];
                if (store.isLessonUnlocked(activeCourse.id, nextLesson.id)) {
                    loadLesson(nextLesson);
                } else {
                    alert("Module complété ! Veuillez valider l'évaluation pour accéder aux chapitres suivants.");
                    renderPlayerSidebar();
                }
            } else {
                alert("Bravo ! Vous avez terminé toutes les leçons de ce cours. Lancez l'examen final de certification dans la barre latérale pour obtenir votre diplôme !");
                renderPlayerSidebar();
            }
        };
    } else {
        btnStickyNext.textContent = "Leçon suivante →";
        btnStickyNext.className = "btn btn-outline";
        if (index < lessons.length - 1) {
            btnStickyNext.style.display = 'inline-flex';
            btnStickyNext.onclick = () => {
                const nextLesson = lessons[index + 1];
                if (store.isLessonUnlocked(activeCourse.id, nextLesson.id)) {
                    loadLesson(nextLesson);
                } else {
                    alert("Veuillez d'abord valider l'évaluation intermédiaire pour débloquer la suite.");
                }
            };
        } else {
            btnStickyNext.style.display = 'none';
        }
    }
}

// ==========================================
// PAGE 4: QUIZ & SECURE FINAL EXAM
// ==========================================
function startQuiz(quizData, parentModule = null, isFinalExam = false) {
    activeQuiz = quizData;
    activeModule = parentModule;
    isExamActive = isFinalExam;
    
    currentQuestionIndex = 0;
    activeQuizAnswers = new Array(quizData.questions.length).fill(null);
    cheatCount = 0;

    navigateTo('quiz');

    document.getElementById('quiz-title').textContent = quizData.title;
    document.getElementById('quiz-question-box').style.display = 'block';
    document.getElementById('quiz-results-box').style.display = 'none';

    const cheatAlert = document.getElementById('cheat-alert-box');
    cheatAlert.style.display = 'none';

    // Timer setup
    const timerContainer = document.getElementById('quiz-timer-container');
    if (isFinalExam && quizData.timeLimit) {
        timerContainer.style.display = 'block';
        examTimeRemaining = quizData.timeLimit;
        updateTimerDisplay();
        
        clearInterval(examTimerInterval);
        examTimerInterval = setInterval(() => {
            examTimeRemaining--;
            updateTimerDisplay();
            if (examTimeRemaining <= 0) {
                clearInterval(examTimerInterval);
                alert("Temps écoulé ! Examen soumis automatiquement.");
                submitQuiz();
            }
        }, 1000);

        requestFullScreen();
        setupExamSecurity();
    } else {
        timerContainer.style.display = 'none';
        clearInterval(examTimerInterval);
    }

    loadQuizQuestion();
}

function updateTimerDisplay() {
    const mins = Math.floor(examTimeRemaining / 60);
    const secs = examTimeRemaining % 60;
    document.getElementById('quiz-time-left').textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function loadQuizQuestion() {
    const qText = document.getElementById('quiz-progress-text');
    const qProgressBar = document.getElementById('quiz-progress-bar');
    const qBody = document.getElementById('question-text-container');
    const optionsContainer = document.getElementById('options-container');

    const totalQuestions = activeQuiz.questions.length;
    const question = activeQuiz.questions[currentQuestionIndex];

    qText.textContent = `Question ${currentQuestionIndex + 1} sur ${totalQuestions}`;
    qProgressBar.style.width = `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`;
    qBody.textContent = question.text;

    optionsContainer.innerHTML = '';
    question.options.forEach((opt, idx) => {
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.className = `option-btn ${activeQuizAnswers[currentQuestionIndex] === idx ? 'selected' : ''}`;
        btn.innerHTML = `<span style="font-weight: 700; color: var(--primary); margin-right: 0.5rem;">${String.fromCharCode(65 + idx)}.</span> ${opt}`;
        
        btn.onclick = () => {
            activeQuizAnswers[currentQuestionIndex] = idx;
            document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
        };

        li.appendChild(btn);
        optionsContainer.appendChild(li);
    });

    const btnSubmit = document.getElementById('btn-submit-question');
    if (currentQuestionIndex === totalQuestions - 1) {
        btnSubmit.textContent = isExamActive ? "Terminer l'examen" : "Soumettre";
    } else {
        btnSubmit.textContent = "Suivant";
    }

    btnSubmit.onclick = () => {
        if (activeQuizAnswers[currentQuestionIndex] === null) {
            alert("Veuillez sélectionner une réponse.");
            return;
        }

        if (currentQuestionIndex < totalQuestions - 1) {
            currentQuestionIndex++;
            loadQuizQuestion();
        } else {
            submitQuiz();
        }
    };
}

function submitQuiz() {
    clearInterval(examTimerInterval);
    isExamActive = false;

    // Remove anti-cheat events
    document.removeEventListener('visibilitychange', handleVisibilityCheat);
    window.removeEventListener('blur', handleBlurCheat);

    let correctCount = 0;
    activeQuiz.questions.forEach((q, idx) => {
        if (activeQuizAnswers[idx] === q.answer) {
            correctCount++;
        }
    });

    const totalQuestions = activeQuiz.questions.length;
    const scoreFraction = correctCount / totalQuestions;
    const scorePercent = Math.round(scoreFraction * 100);
    const isPassed = scoreFraction >= activeQuiz.passingScore;

    document.getElementById('quiz-question-box').style.display = 'none';
    const resultsBox = document.getElementById('quiz-results-box');
    resultsBox.style.display = 'block';

    const scoreCircle = document.getElementById('result-score-circle');
    const titleEl = document.getElementById('result-title');
    const textEl = document.getElementById('result-text');
    const btnRetry = document.getElementById('btn-quiz-retry');
    const btnContinue = document.getElementById('btn-quiz-continue');
    const btnViewCert = document.getElementById('btn-quiz-view-cert');

    document.getElementById('result-score-percent').textContent = `${scorePercent}%`;
    document.getElementById('result-score-fraction').textContent = `${correctCount} / ${totalQuestions}`;

    btnViewCert.style.display = 'none';

    if (isPassed) {
        scoreCircle.className = "results-score-circle passed";
        titleEl.textContent = "Évaluation validée ! 🎉";
        titleEl.style.color = "var(--success)";
        
        if (activeModule) {
            textEl.textContent = `Excellent ! Vous avez validé ce module avec un score de ${scorePercent}%. Le module suivant est débloqué.`;
            store.submitQuizResult(activeCourse.id, activeModule.id, true);
            btnRetry.style.display = 'none';
            btnContinue.onclick = () => {
                startCourse(activeCourse.id);
            };
        } else {
            store.submitExamResult(activeCourse.id, scoreFraction);
            const state = store.getCourseState(activeCourse.id);
            textEl.textContent = `Félicitations ! Vous avez validé l'examen final de "${activeCourse.title}". Votre certificat de réussite est disponible.`;
            btnRetry.style.display = 'none';
            btnContinue.onclick = () => { navigateTo('dashboard'); };
            
            if (state.certificateId) {
                btnViewCert.style.display = 'inline-flex';
                btnViewCert.onclick = () => {
                    navigateTo('verify', { certId: state.certificateId });
                };
            }
        }
    } else {
        scoreCircle.className = "results-score-circle failed";
        titleEl.textContent = "Échec de validation";
        titleEl.style.color = "var(--danger)";
        
        textEl.textContent = `Vous avez obtenu un score de ${scorePercent}%. Un score minimal de ${Math.round(activeQuiz.passingScore * 100)}% est exigé pour valider cette étape.`;
        
        btnRetry.style.display = 'inline-flex';
        btnRetry.onclick = () => {
            startQuiz(activeQuiz, activeModule, activeModule === null);
        };

        btnContinue.textContent = "Retourner aux chapitres";
        btnContinue.onclick = () => {
            if (activeCourse) {
                startCourse(activeCourse.id);
            } else {
                navigateTo('catalog');
            }
        };

        if (activeModule === null) {
            store.submitExamResult(activeCourse.id, scoreFraction);
        }
    }
}

// ==========================================
// ANTI-CHEAT SIMULATION
// ==========================================
function setupExamSecurity() {
    document.addEventListener('visibilitychange', handleVisibilityCheat);
    window.addEventListener('blur', handleBlurCheat);
}

function handleVisibilityCheat() {
    if (document.visibilityState === 'hidden') {
        registerCheatAttempt("Changement d'onglet.");
    }
}

function handleBlurCheat() {
    registerCheatAttempt("Perte de focus de la fenêtre.");
}

function registerCheatAttempt(reason) {
    if (!isExamActive) return;
    
    cheatCount++;
    const alertBox = document.getElementById('cheat-alert-box');
    alertBox.style.display = 'block';
    
    const remaining = MAX_CHEAT_ATTEMPTS - cheatCount;
    document.getElementById('cheat-remaining-attempts').textContent = remaining;

    if (cheatCount >= MAX_CHEAT_ATTEMPTS) {
        alert("ALERTE SÉCURITÉ : Tentatives de triche excessives. Examen annulé.");
        stopExam(false);
    }
}

function stopExam(saveScore = false) {
    clearInterval(examTimerInterval);
    isExamActive = false;
    document.removeEventListener('visibilitychange', handleVisibilityCheat);
    window.removeEventListener('blur', handleBlurCheat);
    exitFullScreen();

    if (!saveScore) {
        store.submitExamResult(activeCourse.id, 0);
        navigateTo('player');
        alert("Examen annulé pour non-respect des règles de sécurité.");
    }
}

function requestFullScreen() {
    const docEl = document.documentElement;
    if (docEl.requestFullscreen) {
        docEl.requestFullscreen().catch(err => console.log("Fullscreen error", err));
    }
}

function exitFullScreen() {
    if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen();
    }
}

// ==========================================
// CERTIFICATE VERIFICATION
// ==========================================
function initVerifyPage(prefilledCertId) {
    const input = document.getElementById('cert-verify-input');
    const btnVerif = document.getElementById('btn-run-verification');
    const resultCard = document.getElementById('verification-result-card');
    const errorCard = document.getElementById('verification-error-card');

    resultCard.style.display = 'none';
    errorCard.style.display = 'none';

    if (prefilledCertId) {
        input.value = prefilledCertId;
        verifyCertificate(prefilledCertId);
    } else {
        input.value = '';
    }

    btnVerif.onclick = () => {
        const value = input.value.trim();
        if (!value) {
            alert("Saisissez un identifiant.");
            return;
        }
        verifyCertificate(value);
    };

    document.getElementById('btn-print-certificate').onclick = () => {
        window.print();
    };
}

function verifyCertificate(certId) {
    const resultCard = document.getElementById('verification-result-card');
    const errorCard = document.getElementById('verification-error-card');
    
    const cert = store.getCertificate(certId);
    
    if (cert) {
        errorCard.style.display = 'none';
        resultCard.style.display = 'block';

        document.getElementById('cert-display-recipient').textContent = cert.studentName;
        document.getElementById('cert-display-course').textContent = cert.courseTitle;
        document.getElementById('cert-display-uuid').textContent = cert.uuid;
        document.getElementById('cert-display-date').textContent = cert.date;

        // Set dynamic QR Code URL pointing to verification link
        const verifyUrl = `${window.location.origin}${window.location.pathname}?page=verify&certId=${cert.uuid}`;
        document.getElementById('cert-display-qrcode').src = `https://api.qrserver.com/v1/create-qr-code/?size=64x64&data=${encodeURIComponent(verifyUrl)}`;
    } else {
        resultCard.style.display = 'none';
        errorCard.style.display = 'block';
    }
}

// ==========================================
// BACK-OFFICE / FORMATEUR LOGIQUE
// ==========================================
let builderModulesCount = 0;

function initBackOfficePage() {
    // 1. Tab Toggles
    const tabStudents = document.getElementById('tab-bo-students');
    const tabBuilder = document.getElementById('tab-bo-builder');
    const panelStudents = document.getElementById('panel-bo-students');
    const panelBuilder = document.getElementById('panel-bo-builder');

    if (tabStudents && tabBuilder && panelStudents && panelBuilder) {
        tabStudents.onclick = async () => {
            tabStudents.classList.add('active');
            tabBuilder.classList.remove('active');
            panelStudents.style.display = 'block';
            panelBuilder.style.display = 'none';
            await updateBOStats();
            await renderBOStudents();
        };

        tabBuilder.onclick = () => {
            tabBuilder.classList.add('active');
            tabStudents.classList.remove('active');
            panelBuilder.style.display = 'block';
            panelStudents.style.display = 'none';
            resetCourseBuilderForm();
        };
    }

    // 2. Setup stats counts
    updateBOStats();

    // 3. Render initial students list
    renderBOStudents();

    // 4. Modal close handlers
    const btnCloseModal = document.getElementById('btn-close-bo-modal');
    const modalElement = document.getElementById('bo-student-modal');
    if (btnCloseModal && modalElement) {
        btnCloseModal.onclick = () => {
            modalElement.style.display = 'none';
        };
    }

    // 5. Course builder button triggers
    const btnAddModule = document.getElementById('btn-builder-add-module');
    if (btnAddModule) {
        btnAddModule.onclick = () => {
            addBuilderModule();
        };
    }

    const btnResetBuilder = document.getElementById('btn-builder-reset');
    if (btnResetBuilder) {
        btnResetBuilder.onclick = () => {
            resetCourseBuilderForm();
        };
    }

    const formBuilder = document.getElementById('form-course-builder');
    if (formBuilder) {
        formBuilder.onsubmit = (e) => {
            e.preventDefault();
            saveNewCourse();
        };
    }
}

async function updateBOStats() {
    const courses = store.getCourses();
    const students = await store.getRealStudentsData();
    let certCount = Object.keys(store.state.certificates).length;

    // Count certifications from real students
    students.forEach(s => {
        if (s.id !== store.getCurrentUser()?.id) {
            Object.values(s.courses).forEach(c => {
                if (c.completed) certCount++;
            });
        }
    });

    document.getElementById('bo-stat-students-count').textContent = students.length;
    document.getElementById('bo-stat-courses-count').textContent = courses.length;
    document.getElementById('bo-stat-certs-count').textContent = certCount;
}

async function renderBOStudents() {
    const listContainer = document.getElementById('bo-students-list');
    if (!listContainer) return;
    listContainer.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:2rem;">Chargement des élèves depuis Supabase...</td></tr>';

    try {
        const students = await store.getRealStudentsData();
        listContainer.innerHTML = '';

        students.forEach(student => {
            const row = document.createElement('tr');
            row.style.borderBottom = '1px solid var(--border-color)';
            row.style.fontSize = '0.9rem';

            // 1. Student details column
            const detailsTd = document.createElement('td');
            detailsTd.style.padding = '1rem 0.5rem';
            detailsTd.innerHTML = `
                <strong>${student.name}</strong><br>
                <span style="color: var(--text-dim); font-size: 0.8rem;">${student.email}</span>
            `;
            row.appendChild(detailsTd);

            // 2. Courses names list
            const coursesTd = document.createElement('td');
            coursesTd.style.padding = '1rem 0.5rem';
            const courseTitles = Object.values(student.courses).map(c => c.title).join('<br>');
            coursesTd.innerHTML = courseTitles || '<span style="color: var(--text-dim);">Aucun cours</span>';
            row.appendChild(coursesTd);

            // 3. Progress bars column
            const progressTd = document.createElement('td');
            progressTd.style.padding = '1rem 0.5rem';
            const progressLayouts = Object.values(student.courses).map(c => `
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                    <div style="flex-grow: 1; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden; width: 80px;">
                        <div style="width: ${c.progress}%; height: 100%; background: linear-gradient(90deg, var(--accent), var(--primary));"></div>
                    </div>
                    <span style="font-size: 0.75rem; font-weight: bold;">${c.progress}%</span>
                </div>
            `).join('');
            progressTd.innerHTML = progressLayouts || '<span style="color: var(--text-dim);">-</span>';
            row.appendChild(progressTd);

            // 4. Certificates column
            const certTd = document.createElement('td');
            certTd.style.padding = '1rem 0.5rem';
            const certLayouts = Object.values(student.courses).map(c => {
                if (c.completed) {
                    return `<span class="badge" style="background: linear-gradient(135deg, var(--accent), var(--primary)); color: #fff; font-size: 0.7rem; padding: 0.25rem 0.5rem; border-radius: 4px;">🎓 Certifié</span>`;
                }
                return `<span style="color: var(--text-dim); font-size: 0.75rem;">En cours</span>`;
            }).join('<br>');
            certTd.innerHTML = certLayouts || '<span style="color: var(--text-dim);">-</span>';
            row.appendChild(certTd);

            // 5. Action details button column
            const actionTd = document.createElement('td');
            actionTd.style.padding = '1rem 0.5rem';
            actionTd.style.textAlign = 'right';
            const detailBtn = document.createElement('button');
            detailBtn.className = 'btn btn-outline';
            detailBtn.style.padding = '0.35rem 0.7rem';
            detailBtn.style.fontSize = '0.8rem';
            detailBtn.textContent = 'Détails 🔎';
            detailBtn.onclick = () => showStudentDetails(student);
            actionTd.appendChild(detailBtn);
            row.appendChild(actionTd);

            listContainer.appendChild(row);
        });
    } catch (e) {
        listContainer.innerHTML = '<tr><td colspan="5" style="text-align:center; color:red; padding:2rem;">Erreur de connexion avec le serveur.</td></tr>';
    }
}

function showStudentDetails(student) {
    document.getElementById('bo-modal-student-name').textContent = student.name;
    document.getElementById('bo-modal-student-email').textContent = student.email;

    const detailsContainer = document.getElementById('bo-modal-details-container');
    detailsContainer.innerHTML = '';

    Object.entries(student.courses).forEach(([courseId, courseDetails]) => {
        const courseCard = document.createElement('div');
        courseCard.style.background = 'rgba(255, 255, 255, 0.03)';
        courseCard.style.border = '1px solid var(--border-color)';
        courseCard.style.padding = '1rem';
        courseCard.style.borderRadius = 'var(--radius-md)';
        courseCard.style.marginBottom = '0.75rem';

        let examScoreLayout = `<span style="color: var(--text-dim);">Aucune tentative</span>`;
        if (courseDetails.examAttempts && courseDetails.examAttempts.length > 0) {
            examScoreLayout = courseDetails.examAttempts.map((score, idx) => `
                <div style="font-size: 0.85rem; margin-top: 0.2rem;">
                    Tentative ${idx + 1} : <strong style="color: ${score >= 0.7 ? 'var(--success)' : 'var(--danger)'};">${Math.round(score * 100)}%</strong>
                </div>
            `).join('');
        }

        courseCard.innerHTML = `
            <h4 style="font-size: 1.05rem; margin-bottom: 0.5rem; color: #fff;">${courseDetails.title}</h4>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; font-size: 0.85rem;">
                <span style="color: var(--text-muted);">Progression générale :</span>
                <strong>${courseDetails.progress}%</strong>
            </div>
            
            <div style="margin-bottom: 0.5rem; font-size: 0.85rem;">
                <span style="color: var(--text-muted);">Historique de l'examen final :</span>
                ${examScoreLayout}
            </div>

            <div style="font-size: 0.85rem; display: flex; justify-content: space-between; align-items: center;">
                <span style="color: var(--text-muted);">Statut de certification :</span>
                ${courseDetails.completed 
                    ? `<span style="color: var(--success); font-weight: bold;">🎓 Diplôme obtenu</span>` 
                    : `<span style="color: var(--text-dim);">Non validé</span>`
                }
            </div>
        `;
        detailsContainer.appendChild(courseCard);
    });

    document.getElementById('bo-student-modal').style.display = 'flex';
}

function resetCourseBuilderForm() {
    document.getElementById('form-course-builder').reset();
    const container = document.getElementById('builder-modules-list');
    container.innerHTML = '';
    builderModulesCount = 0;
    
    // Add one default module to start with
    addBuilderModule();
}

function addBuilderModule() {
    builderModulesCount++;
    const moduleId = `bo-mod-${Date.now()}-${builderModulesCount}`;
    const moduleContainer = document.getElementById('builder-modules-list');

    const moduleDiv = document.createElement('div');
    moduleDiv.className = 'card bo-builder-module-card';
    moduleDiv.style.borderLeft = '4px solid var(--accent)';
    moduleDiv.style.padding = '1.25rem';
    moduleDiv.style.position = 'relative';
    moduleDiv.setAttribute('data-module-id', moduleId);

    moduleDiv.innerHTML = `
        <button type="button" class="btn btn-outline" style="position: absolute; top: 1rem; right: 1rem; padding: 0.25rem 0.5rem; font-size: 0.75rem; border-color: var(--danger); color: var(--danger);" onclick="this.closest('.bo-builder-module-card').remove()">Supprimer</button>
        <div style="margin-bottom: 1rem; max-width: 80%;">
            <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.25rem;">Titre du Module</label>
            <input type="text" class="module-title-input" placeholder="Ex: Module 1 : Introduction" required style="width: 100%; padding: 0.6rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color); background: rgba(0,0,0,0.15); color: #fff;">
        </div>

        <div style="padding-left: 1.5rem; border-left: 2px dashed var(--border-color);">
            <h5 style="font-size: 0.95rem; margin-bottom: 0.75rem; display: flex; justify-content: space-between; align-items: center;">
                Chapitres & Leçons
                <button type="button" class="btn btn-outline" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;" onclick="window.addBuilderChapter('${moduleId}')">+ Ajouter un Chapitre</button>
            </h5>
            <div class="chapters-container" style="display: flex; flex-direction: column; gap: 1rem;">
                <!-- Chapters loaded here -->
            </div>
        </div>
    `;

    moduleContainer.appendChild(moduleDiv);
    // Add one chapter automatically
    addBuilderChapter(moduleId);
}

function addBuilderChapter(moduleId) {
    const moduleDiv = document.querySelector(`[data-module-id="${moduleId}"]`);
    if (!moduleDiv) return;
    const chaptersContainer = moduleDiv.querySelector('.chapters-container');
    const chapterId = `bo-chap-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;

    const chapterDiv = document.createElement('div');
    chapterDiv.className = 'bo-builder-chapter-card';
    chapterDiv.style.background = 'rgba(255,255,255,0.02)';
    chapterDiv.style.border = '1px solid var(--border-color)';
    chapterDiv.style.borderRadius = 'var(--radius-sm)';
    chapterDiv.style.padding = '1rem';
    chapterDiv.style.position = 'relative';
    chapterDiv.setAttribute('data-chapter-id', chapterId);

    chapterDiv.innerHTML = `
        <button type="button" class="btn btn-outline" style="position: absolute; top: 0.75rem; right: 0.75rem; padding: 0.15rem 0.35rem; font-size: 0.7rem; border-color: var(--danger); color: var(--danger);" onclick="this.closest('.bo-builder-chapter-card').remove()">Retirer</button>
        <div style="margin-bottom: 0.75rem; max-width: 80%;">
            <label style="display: block; font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.2rem;">Titre du Chapitre</label>
            <input type="text" class="chapter-title-input" placeholder="Ex: Chapitre 1 : Premier Pas" required style="width: 100%; padding: 0.5rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color); background: rgba(0,0,0,0.15); color: #fff;">
        </div>

        <div style="padding-left: 1rem; border-left: 1.5px dotted var(--border-color);">
            <h6 style="font-size: 0.85rem; margin-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center;">
                Leçons
                <button type="button" class="btn btn-outline" style="padding: 0.15rem 0.35rem; font-size: 0.7rem;" onclick="window.addBuilderLesson('${chapterId}')">+ Leçon</button>
            </h6>
            <div class="lessons-container" style="display: flex; flex-direction: column; gap: 0.5rem;">
                <!-- Lessons will be dynamically appended here -->
            </div>
        </div>
    `;

    chaptersContainer.appendChild(chapterDiv);
    // Add one default lesson
    addBuilderLesson(chapterId);
}

function addBuilderLesson(chapterId) {
    const chapterDiv = document.querySelector(`[data-chapter-id="${chapterId}"]`);
    if (!chapterDiv) return;
    const lessonsContainer = chapterDiv.querySelector('.lessons-container');
    const lessonId = `bo-lesson-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;

    const lessonDiv = document.createElement('div');
    lessonDiv.className = 'bo-builder-lesson-row';
    lessonDiv.style.display = 'flex';
    lessonDiv.style.flexDirection = 'column';
    lessonDiv.style.gap = '0.5rem';
    lessonDiv.style.padding = '0.75rem';
    lessonDiv.style.background = 'rgba(0,0,0,0.2)';
    lessonDiv.style.border = '1px solid var(--border-color)';
    lessonDiv.style.borderRadius = 'var(--radius-sm)';
    lessonDiv.setAttribute('data-lesson-id', lessonId);

    lessonDiv.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
            <input type="text" class="lesson-title-input" placeholder="Titre de la leçon..." required style="flex-grow: 2; min-width: 150px; padding: 0.4rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color); background: rgba(0,0,0,0.15); color: #fff; font-size: 0.8rem;">
            <select class="lesson-type-select" style="min-width: 100px; padding: 0.4rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color); background: #1a1b24; color: #fff; font-size: 0.8rem;" onchange="window.toggleLessonBuilderDetails('${lessonId}')">
                <option value="video">Vidéo 📹</option>
                <option value="document" selected>Document 📄</option>
                <option value="exercise">Exercice Code 💻</option>
            </select>
            <button type="button" class="btn btn-outline" style="padding: 0.2rem 0.4rem; font-size: 0.7rem; border-color: var(--danger); color: var(--danger);" onclick="this.closest('.bo-builder-lesson-row').remove()">✖</button>
        </div>
        
        <!-- Standard Content / Embed -->
        <div class="lesson-content-group">
            <textarea class="lesson-text-content" rows="2" placeholder="Contenu textuel ou lien d'intégration vidéo..." required style="width: 100%; padding: 0.4rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color); background: rgba(0,0,0,0.1); color: #fff; font-size: 0.8rem; resize: vertical;"></textarea>
        </div>

        <!-- Exercise Configurations (Shown only if type === exercise) -->
        <div class="lesson-exercise-group" style="display: none; padding: 0.5rem; background: rgba(255,255,255,0.02); border-radius: 4px; border: 1px solid rgba(255,255,255,0.05); gap: 0.5rem; flex-direction: column;">
            <div style="display: flex; gap: 0.5rem; flex-direction: column;">
                <label style="font-size: 0.75rem; color: var(--text-dim);">Code de départ (initial) :</label>
                <textarea class="lesson-exercise-code" rows="2" placeholder="// Code de base..." style="width: 100%; font-family: monospace; padding: 0.4rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color); background: #1a1b24; color: #fff; font-size: 0.75rem;"></textarea>
            </div>
            <div style="display: flex; gap: 0.5rem; flex-direction: column;">
                <label style="font-size: 0.75rem; color: var(--text-dim);">Regex de validation (les tests automatiques doivent matcher ce pattern) :</label>
                <input type="text" class="lesson-exercise-regex" placeholder="Ex: ALTER TABLE.*ENABLE ROW LEVEL SECURITY" style="width: 100%; padding: 0.4rem; font-family: monospace; border-radius: var(--radius-sm); border: 1px solid var(--border-color); background: rgba(0,0,0,0.2); color: #fff; font-size: 0.75rem;">
            </div>
            <div style="display: flex; gap: 0.5rem; flex-direction: column;">
                <label style="font-size: 0.75rem; color: var(--text-dim);">Indice pédagogique :</label>
                <input type="text" class="lesson-exercise-hint" placeholder="Ex: Utilisez le mot-clé ENABLE ROW LEVEL SECURITY" style="width: 100%; padding: 0.4rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color); background: rgba(0,0,0,0.2); color: #fff; font-size: 0.75rem;">
            </div>
        </div>
    `;

    lessonsContainer.appendChild(lessonDiv);
}

function toggleLessonBuilderDetails(lessonId) {
    const lessonDiv = document.querySelector(`[data-lesson-id="${lessonId}"]`);
    if (!lessonDiv) return;
    const typeSelect = lessonDiv.querySelector('.lesson-type-select');
    const contentGroup = lessonDiv.querySelector('.lesson-content-group');
    const exerciseGroup = lessonDiv.querySelector('.lesson-exercise-group');

    if (typeSelect.value === 'exercise') {
        contentGroup.style.display = 'none';
        exerciseGroup.style.display = 'flex';
        lessonDiv.querySelector('.lesson-text-content').removeAttribute('required');
    } else {
        contentGroup.style.display = 'block';
        exerciseGroup.style.display = 'none';
        lessonDiv.querySelector('.lesson-text-content').setAttribute('required', 'required');
    }
}

function saveNewCourse() {
    const title = document.getElementById('builder-course-title').value.trim();
    const id = document.getElementById('builder-course-id').value.trim();
    const duration = document.getElementById('builder-course-duration').value.trim();
    const level = document.getElementById('builder-course-level').value;
    const desc = document.getElementById('builder-course-desc').value.trim();

    // Check if ID is clean
    if (!/^[a-z0-9\-]+$/.test(id)) {
        alert("L'identifiant du cours doit uniquement contenir des lettres minuscules, chiffres et tirets.");
        return;
    }

    // Verify unique id
    const existing = store.getCourses().find(c => c.id === id);
    if (existing) {
        alert("Un cours avec cet identifiant existe déjà. Choisissez un autre identifiant.");
        return;
    }

    // Retrieve modules
    const moduleCards = document.querySelectorAll('.bo-builder-module-card');
    if (moduleCards.length === 0) {
        alert("Veuillez ajouter au moins un module.");
        return;
    }

    const modules = [];
    let lessonIndex = 1;

    for (let i = 0; i < moduleCards.length; i++) {
        const mCard = moduleCards[i];
        const mTitle = mCard.querySelector('.module-title-input').value.trim();
        const mId = `${id}-mod-${i+1}`;

        const chapterCards = mCard.querySelectorAll('.bo-builder-chapter-card');
        const chapters = [];

        for (let j = 0; j < chapterCards.length; j++) {
            const chCard = chapterCards[j];
            const chTitle = chCard.querySelector('.chapter-title-input').value.trim();
            const chId = `${mId}-ch-${j+1}`;

            const lessonRows = chCard.querySelectorAll('.bo-builder-lesson-row');
            const lessons = [];

            for (let k = 0; k < lessonRows.length; k++) {
                const lRow = lessonRows[k];
                const lTitle = lRow.querySelector('.lesson-title-input').value.trim();
                const lType = lRow.querySelector('.lesson-type-select').value;
                const lId = `${id}-lesson-${lessonIndex++}`;

                const lessonObj = {
                    id: lId,
                    title: lTitle,
                    type: lType
                };

                if (lType === 'exercise') {
                    const starterCode = lRow.querySelector('.lesson-exercise-code').value.trim() || '// Saisissez votre code';
                    const regexVal = lRow.querySelector('.lesson-exercise-regex').value.trim() || '.*';
                    const hintVal = lRow.querySelector('.lesson-exercise-hint').value.trim() || 'Analysez le sujet pour répondre';

                    lessonObj.exercise = {
                        instruction: `Complétez l'exercice pratique ci-dessous.`,
                        starterCode: starterCode,
                        validationRegex: regexVal,
                        hint: hintVal
                    };
                } else if (lType === 'video') {
                    const embedVal = lRow.querySelector('.lesson-text-content').value.trim();
                    lessonObj.videoUrl = embedVal || "https://www.youtube.com/embed/dQw4w9WgXcQ";
                    lessonObj.content = `Regardez la vidéo explicative ci-dessus pour comprendre les concepts clés de ce chapitre.`;
                } else { // document
                    const contentVal = lRow.querySelector('.lesson-text-content').value.trim();
                    lessonObj.content = contentVal || `Consultez ce document technique pour approfondir le sujet.`;
                }

                lessons.push(lessonObj);
            }

            chapters.push({
                id: chId,
                title: chTitle,
                lessons: lessons
            });
        }

        // Add a mock Quiz for intermediate module verification
        modules.push({
            id: mId,
            title: mTitle,
            chapters: chapters,
            quiz: {
                quizId: `${mId}-quiz`,
                title: `Validation de module`,
                questions: [
                    {
                        question: `Validez-vous l'acquisition des compétences de ce module ?`,
                        options: [
                            "Oui, absolument !",
                            "Non, pas encore."
                        ],
                        correctIndex: 0
                    }
                ]
            }
        });
    }

    // Default mock Exam for the course final certification
    const examObj = {
        timeLimit: 15,
        passingScore: 0.5, // 50%
        questions: [
            {
                question: `Quel est l'objectif principal de cette nouvelle formation (${title}) ?`,
                options: [
                    "Valider les acquis pratiques",
                    "Découvrir de nouveaux horizons",
                    "Simuler un projet",
                    "Toutes ces réponses"
                ],
                correctIndex: 3
            }
        ]
    };

    const newCourse = {
        id: id,
        title: title,
        description: desc,
        duration: duration,
        level: level,
        levelText: level === 'easy' ? 'Débutant' : (level === 'medium' ? 'Intermédiaire' : 'Avancé'),
        lessonsCount: lessonIndex - 1,
        modules: modules,
        exam: examObj
    };

    // Save in Store
    store.addCourse(newCourse);
    
    // Success feedback
    alert(`Félicitations ! Le cours "${title}" a été créé avec succès et est accessible dans le catalogue !`);
    
    // Redirect to backoffice home
    document.getElementById('tab-bo-students').click();
}

// Make builder actions globally reachable
window.addBuilderChapter = addBuilderChapter;
window.addBuilderLesson = addBuilderLesson;
window.toggleLessonBuilderDetails = toggleLessonBuilderDetails;
window.initBackOfficePage = initBackOfficePage;

// ==========================================
// PAYMENT / CHECKOUT SYSTEM (Burkina Faso)
// ==========================================
let currentPaymentTab = 'momo';
let currentMomoOperator = 'orange';

function openCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    if (modal) {
        modal.style.display = 'flex';
        // Reset states
        document.getElementById('pay-processing').style.display = 'none';
        document.getElementById('pay-success').style.display = 'none';
        document.getElementById('pay-phone').value = '';
        switchPayTab('momo');
    }
}
window.openCheckoutModal = openCheckoutModal;

function closeCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}
window.closeCheckoutModal = closeCheckoutModal;

function switchPayTab(tab) {
    currentPaymentTab = tab;
    // Update tab button styles
    const tabs = ['momo', 'card', 'transfer'];
    tabs.forEach(t => {
        const btn = document.getElementById(`pay-tab-${t}`);
        const content = document.getElementById(`pay-content-${t}`);
        if (btn) btn.classList.toggle('active', t === tab);
        if (content) content.style.display = (t === tab) ? 'flex' : 'none';
    });
}
window.switchPayTab = switchPayTab;

function selectMomoOperator(operator) {
    currentMomoOperator = operator;
    const orangeCard = document.getElementById('momo-op-orange');
    const moovCard = document.getElementById('momo-op-moov');
    
    if (orangeCard) orangeCard.classList.toggle('selected', operator === 'orange');
    if (moovCard) moovCard.classList.toggle('selected', operator === 'moov');
    
    const phoneInput = document.getElementById('pay-phone');
    if (phoneInput) {
        if (operator === 'orange') {
            phoneInput.placeholder = '76 00 00 00';
        } else {
            phoneInput.placeholder = '70 00 00 00';
        }
    }
}
window.selectMomoOperator = selectMomoOperator;

function submitMomoPayment() {
    const phoneVal = document.getElementById('pay-phone').value.trim();
    if (!phoneVal || phoneVal.length < 8) {
        alert("Veuillez saisir un numéro de téléphone valide à 8 chiffres.");
        return;
    }

    const processing = document.getElementById('pay-processing');
    const title = document.getElementById('pay-processing-title');
    const subtitle = document.getElementById('pay-processing-subtitle');
    
    if (processing) {
        processing.style.display = 'flex';
        
        // Simulating the USSD push validation cycle
        const operatorName = currentMomoOperator === 'orange' ? 'Orange Money' : 'Moov Money';
        const ussdCode = currentMomoOperator === 'orange' ? '*144#' : '*555#';
        
        title.textContent = `Demande ${operatorName} envoyée...`;
        subtitle.innerHTML = `Veuillez patienter. Un pop-up de confirmation de <strong>15 000 FCFA</strong> a été envoyé au +226 ${phoneVal}.<br>Saisissez votre PIN de sécurité (ou tapez <strong>${ussdCode}</strong> si rien ne s'affiche).`;
        
        setTimeout(() => {
            // Step completed
            const success = document.getElementById('pay-success');
            if (success) success.style.display = 'flex';
        }, 3500);
    }
}
window.submitMomoPayment = submitMomoPayment;

function submitCardPayment() {
    const processing = document.getElementById('pay-processing');
    if (processing) {
        processing.style.display = 'flex';
        document.getElementById('pay-processing-title').textContent = "Validation bancaire (3D Secure)...";
        document.getElementById('pay-processing-subtitle').textContent = "Vérification des fonds en cours auprès de la banque...";
        
        setTimeout(() => {
            const success = document.getElementById('pay-success');
            if (success) success.style.display = 'flex';
        }, 2500);
    }
}
window.submitCardPayment = submitCardPayment;

function submitTransferPayment() {
    const processing = document.getElementById('pay-processing');
    if (processing) {
        processing.style.display = 'flex';
        document.getElementById('pay-processing-title').textContent = "Envoi du fichier de virement...";
        document.getElementById('pay-processing-subtitle').textContent = "Traitement de votre preuve de virement par notre service administratif...";
        
        setTimeout(() => {
            const success = document.getElementById('pay-success');
            if (success) success.style.display = 'flex';
        }, 2000);
    }
}
window.submitTransferPayment = submitTransferPayment;

async function finalizeSuccessPayment() {
    await store.setPaid(true);
    closeCheckoutModal();
    renderDashboard();
}
window.finalizeSuccessPayment = finalizeSuccessPayment;

