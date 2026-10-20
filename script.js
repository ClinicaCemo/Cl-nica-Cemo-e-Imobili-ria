"use strict";

/* =====================================================
   CONFIGURAÇÕES DO SITE CEMO
   Altere os links e informações nesta parte.
===================================================== */

const CONFIG = {
    clinic: {
        phoneDisplay: "(38) 99161-0939",
        whatsapp: "https://wa.me/5538991610939",
        instagram: "https://www.instagram.com/cemo.pirapora"
    },

    realEstate: {
        phoneDisplay: "(38) 99136-1872",
        whatsapp: "https://wa.me/5538991361872",
        instagram: "https://www.instagram.com/cemoimobiliariapirapora"
    },

    facebook: "",

    address: "Rua Argemiro Peixoto, 202, Centro, Pirapora/MG, CEP 39270-092",

    mapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Rua+Argemiro+Peixoto+202+Pirapora+MG",

    // O sistema de avaliações precisará de um backend.
    reviewsApi: "./api"
};


/* =====================================================
   FUNÇÕES AUXILIARES
===================================================== */

function getElement(id) {
    return document.getElementById(id);
}

function setText(id, value) {
    const element = getElement(id);

    if (element && value !== undefined && value !== null) {
        element.textContent = value;
    }
}

function setLink(id, url) {
    const element = getElement(id);

    if (element && url) {
        element.href = url;
    }
}

function safeLocalStorageGet(key) {
    try {
        return localStorage.getItem(key);
    } catch (error) {
        return null;
    }
}

function safeLocalStorageSet(key, value) {
    try {
        localStorage.setItem(key, value);
        return true;
    } catch (error) {
        console.warn("Não foi possível salvar a preferência no navegador.");
        return false;
    }
}


/* =====================================================
   TELA DE CARREGAMENTO
===================================================== */

function initializeLoader() {
    const loader = getElement("loader");

    if (!loader) return;

    function hideLoader() {
        loader.classList.add("loader-hidden");
        loader.style.display = "none";
        loader.hidden = true;
    }

    if (document.readyState === "complete") {
        hideLoader();
    } else {
        window.addEventListener("load", hideLoader, { once: true });
    }

    // Evita deixar a tela presa caso algum recurso demore.
    window.setTimeout(hideLoader, 4000);
}


/* =====================================================
   MENU PARA CELULARES
===================================================== */

function initializeMobileMenu() {
    const toggle = getElement("menu-toggle");
    const nav = getElement("main-nav");

    if (!toggle || !nav) return;

    function closeMenu() {
        toggle.classList.remove("active");
        nav.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Abrir menu");
    }

    toggle.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("nav-open");

        toggle.classList.toggle("active", isOpen);
        toggle.setAttribute("aria-expanded", String(isOpen));
        toggle.setAttribute(
            "aria-label",
            isOpen ? "Fechar menu" : "Abrir menu"
        );
    });

    nav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMenu();
        }
    });

    document.addEventListener("click", (event) => {
        if (!nav.contains(event.target) && !toggle.contains(event.target)) {
            closeMenu();
        }
    });
}


/* =====================================================
   LINKS E INFORMAÇÕES DE CONTATO
===================================================== */

function initializeContactInformation() {
    setText("clinic-whatsapp", CONFIG.clinic.phoneDisplay);
    setLink("clinic-whatsapp", CONFIG.clinic.whatsapp);
    setLink("clinic-instagram", CONFIG.clinic.instagram);

    setText("real-estate-whatsapp", CONFIG.realEstate.phoneDisplay);
    setLink("real-estate-whatsapp", CONFIG.realEstate.whatsapp);
    setLink("real-estate-instagram", CONFIG.realEstate.instagram);

    setLink("facebook-link", CONFIG.facebook);

    const facebookLink = getElement("facebook-link");

    if (facebookLink && !CONFIG.facebook) {
        facebookLink.hidden = true;
    }

    const mapsLink = getElement("maps-link");

    if (mapsLink) {
        mapsLink.href = CONFIG.mapsUrl;
    }

    setText("current-year", new Date().getFullYear());
}


/* =====================================================
   IDIOMAS
   Traduções básicas das áreas principais do site.
===================================================== */

const translations = {
    pt: {
        navHome: "Início",
        navAbout: "Sobre nós",
        navServices: "Serviços",
        navReviews: "Avaliações",
        navContact: "Contato",

        heroEyebrow: "CEMO • PIRAPORA, MINAS GERAIS",
        heroTitle: "Cuidando de pessoas. Conectando oportunidades.",
        heroDescription:
            "Soluções em saúde ocupacional e oportunidades imobiliárias, com atendimento próximo, transparência e compromisso."
    },

    en: {
        navHome: "Home",
        navAbout: "About us",
        navServices: "Services",
        navReviews: "Reviews",
        navContact: "Contact",

        heroEyebrow: "CEMO • PIRAPORA, MINAS GERAIS",
        heroTitle: "Caring for people. Connecting opportunities.",
        heroDescription:
            "Occupational health solutions and real estate opportunities with personal service, transparency and commitment."
    },

    es: {
        navHome: "Inicio",
        navAbout: "Sobre nosotros",
        navServices: "Servicios",
        navReviews: "Reseñas",
        navContact: "Contacto",

        heroEyebrow: "CEMO • PIRAPORA, MINAS GERAIS",
        heroTitle: "Cuidando personas. Conectando oportunidades.",
        heroDescription:
            "Soluciones de salud ocupacional y oportunidades inmobiliarias, con atención cercana, transparencia y compromiso."
    }
};

function initializeLanguageSelector() {
    const selector = getElement("language-select");

    if (!selector) return;

    const savedLanguage = safeLocalStorageGet("cemo-language");
    const initialLanguage = translations[savedLanguage] ? savedLanguage : "pt";

    selector.value = initialLanguage;
    applyLanguage(initialLanguage);

    selector.addEventListener("change", () => {
        const language = translations[selector.value] ? selector.value : "pt";

        applyLanguage(language);
        safeLocalStorageSet("cemo-language", language);
    });
}

function applyLanguage(language) {
    const dictionary = translations[language] || translations.pt;

    document.documentElement.lang =
        language === "en" ? "en" :
        language === "es" ? "es" : "pt-BR";

    document.querySelectorAll("[data-i18n]").forEach((element) => {
        const key = element.dataset.i18n;

        if (dictionary[key]) {
            // textContent evita interpretar o texto como HTML.
            element.textContent = dictionary[key];
        }
    });
}


/* =====================================================
   CONSENTIMENTO DE COOKIES
===================================================== */

const COOKIE_STORAGE_KEY = "cemo-cookie-preferences";

function getCookiePreferences() {
    const saved = safeLocalStorageGet(COOKIE_STORAGE_KEY);

    if (!saved) return null;

    try {
        return JSON.parse(saved);
    } catch (error) {
        return null;
    }
}

function saveCookiePreferences(preferences) {
    const data = {
        necessary: true,
        analytics: Boolean(preferences.analytics),
        marketing: Boolean(preferences.marketing),
        updatedAt: new Date().toISOString()
    };

    const saved = safeLocalStorageSet(
        COOKIE_STORAGE_KEY,
        JSON.stringify(data)
    );

    if (saved) {
        updateCookieInterface();
    }
}

function updateCookieInterface() {
    const banner = getElement("cookie-banner");
    const modal = getElement("cookie-modal");
    const preferences = getCookiePreferences();

    if (banner) {
        banner.hidden = Boolean(preferences);
    }

    if (modal) {
        modal.hidden = true;
    }

    const analytics = getElement("cookie-analytics");
    const marketing = getElement("cookie-marketing");

    if (analytics) {
        analytics.checked = Boolean(preferences && preferences.analytics);
    }

    if (marketing) {
        marketing.checked = Boolean(preferences && preferences.marketing);
    }
}

function initializeCookies() {
    const acceptButton = getElement("cookie-accept");
    const rejectButton = getElement("cookie-reject");
    const settingsButton = getElement("cookie-settings");
    const closeButton = getElement("cookie-close");
    const saveButton = getElement("cookie-save");

    updateCookieInterface();

    if (acceptButton) {
        acceptButton.addEventListener("click", () => {
            saveCookiePreferences({
                analytics: true,
                marketing: true
            });
        });
    }

    if (rejectButton) {
        rejectButton.addEventListener("click", () => {
            saveCookiePreferences({
                analytics: false,
                marketing: false
            });
        });
    }

    if (settingsButton) {
        settingsButton.addEventListener("click", openCookieSettings);
    }

    if (closeButton) {
        closeButton.addEventListener("click", closeCookieSettings);
    }

    if (saveButton) {
        saveButton.addEventListener("click", () => {
            saveCookiePreferences({
                analytics: Boolean(getElement("cookie-analytics")?.checked),
                marketing: Boolean(getElement("cookie-marketing")?.checked)
            });
        });
    }

    const modal = getElement("cookie-modal");

    if (modal) {
        modal.addEventListener("click", (event) => {
            if (event.target === modal) {
                closeCookieSettings();
            }
        });
    }

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeCookieSettings();
        }
    });
}

function openCookieSettings() {
    const modal = getElement("cookie-modal");

    if (!modal) return;

    const preferences = getCookiePreferences();

    const analytics = getElement("cookie-analytics");
    const marketing = getElement("cookie-marketing");

    if (analytics) {
        analytics.checked = Boolean(preferences && preferences.analytics);
    }

    if (marketing) {
        marketing.checked = Boolean(preferences && preferences.marketing);
    }

    modal.hidden = false;

    const closeButton = getElement("cookie-close");

    if (closeButton) {
        closeButton.focus();
    }
}

function closeCookieSettings() {
    const modal = getElement("cookie-modal");

    if (modal) {
        modal.hidden = true;
    }
}


/* =====================================================
   AVALIAÇÕES DOS CLIENTES
   Requer backend e banco de dados para funcionar.
===================================================== */

function initializeReviews() {
    loadReviews();

    const form = getElement("review-form");

    if (!form) return;

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const status = getElement("review-status");
        const submitButton = form.querySelector('button[type="submit"]');

        const name = getElement("review-name")?.value.trim() || "";
        const area = getElement("review-area")?.value || "";
        const rating = Number(getElement("review-rating")?.value || 0);
        const comment = getElement("review-comment")?.value.trim() || "";

        if (!name || !area || rating < 1 || rating > 5 || !comment) {
            setText("review-status", "Preencha todos os campos corretamente.");
            return;
        }

        if (status) {
            status.textContent = "Enviando sua avaliação...";
        }

        if (submitButton) {
            submitButton.disabled = true;
        }

        try {
            const response = await fetch(`${CONFIG.reviewsApi}/salvar_avaliacao.php`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    area,
                    rating,
                    comment
                })
            });

            if (!response.ok) {
                throw new Error("Não foi possível enviar a avaliação.");
            }

            const result = await response.json();

            if (result.success !== true) {
                throw new Error(
                    result.message || "Não foi possível registrar a avaliação."
                );
            }

            form.reset();

            if (status) {
                status.textContent =
                    "Avaliação enviada! Ela poderá aparecer após a validação.";
            }

            await loadReviews();

        } catch (error) {
            console.error("Erro ao enviar avaliação:", error);

            if (status) {
                status.textContent =
                    "O sistema de avaliações ainda não está disponível. Tente novamente mais tarde.";
            }
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
            }
        }
    });
}

async function loadReviews() {
    const list = getElement("reviews-list");
    const count = getElement("reviews-count");

    if (!list) return;

    try {
        const response = await fetch(`${CONFIG.reviewsApi}/listar_avaliacoes.php`);

        if (!response.ok) {
            throw new Error("O servidor de avaliações não está disponível.");
        }

        const result = await response.json();

        const reviews = Array.isArray(result)
            ? result
            : Array.isArray(result.reviews)
                ? result.reviews
                : [];

        list.replaceChildren();

        if (count) {
            count.textContent = String(reviews.length);
        }

        if (reviews.length === 0) {
            showReviewsMessage(
                "Ainda não há avaliações publicadas. Seja o primeiro a compartilhar sua experiência."
            );
            return;
        }

        reviews.forEach((review) => {
            const card = document.createElement("article");
            card.className = "review-card";

            const name = document.createElement("h3");
            name.textContent = String(review.name || "Cliente");

            const stars = document.createElement("div");
            stars.className = "review-card-stars";

            const rating = Math.max(0, Math.min(5, Number(review.rating) || 0));

            stars.textContent = "★".repeat(rating) + "☆".repeat(5 - rating);
            stars.setAttribute("aria-label", `${rating} de 5 estrelas`);

            const comment = document.createElement("p");
            comment.textContent = String(review.comment || "");

            const area = document.createElement("span");
            area.className = "review-card-area";
            area.textContent =
                review.area === "clinica"
                    ? "Clínica ocupacional"
                    : review.area === "imobiliaria"
                        ? "Imobiliária"
                        : "CEMO";

            card.append(name, stars, comment, area);
            list.appendChild(card);
        });

    } catch (error) {
        console.warn("Avaliações indisponíveis:", error);

        if (count) {
            count.textContent = "—";
        }

        showReviewsMessage(
            "As avaliações serão carregadas quando o sistema estiver conectado ao servidor e ao banco de dados."
        );
    }
}

function showReviewsMessage(message) {
    const list = getElement("reviews-list");

    if (!list) return;

    const paragraph = document.createElement("p");
    paragraph.className = "reviews-message";
    paragraph.textContent = message;

    list.replaceChildren(paragraph);
}


/* =====================================================
   INICIALIZAÇÃO
===================================================== */

function initializeCemoSite() {
    initializeLoader();
    initializeMobileMenu();
    initializeContactInformation();
    initializeLanguageSelector();
    initializeCookies();
    initializeReviews();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeCemoSite, {
        once: true
    });
} else {
    initializeCemoSite();
}