<template>
  <header>
    <div class="header-logo">
      <img alt="Company logo" :src="logo" />
      <span>GCCoEd</span>
    </div>

    <button class="hamburger" @click="toggleMenu" aria-label="Toggle navigation">
      <span :class="{'hamburger-line': true, 'active': isMenuOpen}"></span>
      <span :class="{'hamburger-line': true, 'active': isMenuOpen}"></span>
      <span :class="{'hamburger-line': true, 'active': isMenuOpen}"></span>
    </button>

    <nav :class="{'header-nav': true, 'active': isMenuOpen}">
      <div class="nav-links">
        <a 
          v-for="link in links" 
          :key="link.name" 
          :href="link.href" 
          :class="{'nav-link': true, 'active': activeLink === link.name, 'clicked': clickedLink === link.name}"
          @click="setActive(link.name)"
          @mousedown="clickedLink = link.name"
          @mouseup="clickedLink = null"
          @mouseleave="clickedLink = null"
        >
          <span class="link-text">{{ link.name }}</span>
          <span class="link-underline"></span>
        </a>
      </div>
      <button 
        :class="{'nav-button': true, 'clicked': isLoginClicked}" 
        @click="goToLogin"
      >
        <svg class="login-icon" viewBox="0 0 24 24" width="18" height="18">
          <path fill="currentColor" d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,6A2,2 0 0,0 10,8A2,2 0 0,0 12,10A2,2 0 0,0 14,8A2,2 0 0,0 12,6M12,13C14.67,13 20,14.33 20,17V20H4V17C4,14.33 9.33,13 12,13M12,14.9C9.03,14.9 5.9,16.36 5.9,17V18.1H18.1V17C18.1,16.36 14.97,14.9 12,14.9Z" />
        </svg>
        Login
      </button>
    </nav>
  </header>
</template>

<script>
import logo from "@/assets/logo_gccoed.png";

export default {
  name: "NavbarComponent",
  data() {
    return {
      logo,
      activeLink: '',
      isLoginClicked: false,
      isMenuOpen: false,
      clickedLink: null,
      links: [
        { name: 'Home', href: '#home' },
        { name: 'Roles', href: '#learners' },
        { name: 'Overview', href: '#how-it-works' },
        { name: 'Get Started', href: '#get-started' },
      ]
    };
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    closeMenu() {
      this.isMenuOpen = false;
    },
    goToLogin() {
      this.isLoginClicked = true;
      this.closeMenu();
      this.$router.push("/login");
    },
    setActive(link) {
      this.$router.push({ path: '/', hash: link.href });
      this.activeLink = link.name;
      this.closeMenu();
    },
    handleScroll() {
      const sections = this.links.map(link => document.querySelector(link.href));
      const scrollPosition = window.scrollY + 200;

      sections.forEach((section, index) => {
        if (section && section.offsetTop <= scrollPosition && (section.offsetTop + section.offsetHeight) > scrollPosition) {
          this.activeLink = this.links[index].name;
        }
      });
    },
    checkActiveLink() {
      if (this.$route.path === '/login') {
        this.isLoginClicked = true;
      } else {
        this.isLoginClicked = false;
      }
    },
    handleClickOutside(event) {
      if (!this.$el.contains(event.target) && this.isMenuOpen) {
        this.closeMenu();
      }
    }
  },
  created() {
    this.checkActiveLink();
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    document.removeEventListener('click', this.handleClickOutside);
  },
  watch: {
    '$route'(to) {
      this.checkActiveLink();
    }
  }
};
</script>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 1rem 2rem;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  background-color: white;
  font-family: "Inter", sans-serif;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  height: auto;
}

/* Logo Styles */
.header-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  z-index: 110;
}

.header-logo img {
  width: 3.5rem;
  height: 2.5rem;
}

.header-logo span {
  font-size: 1.5rem;
  font-weight: bold;
  color: #0e8ca3;
}

.hamburger {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 21px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 110;
}

.hamburger-line {
  display: block;
  height: 3px;
  width: 100%;
  background: #0e8ca3;
  border-radius: 3px;
  transition: all 0.3s ease;
}

.hamburger-line:nth-child(1).active {
  transform: translateY(9px) rotate(45deg);
}

.hamburger-line:nth-child(2).active {
  opacity: 0;
}

.hamburger-line:nth-child(3).active {
  transform: translateY(-9px) rotate(-45deg);
}

.header-nav {
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  right: -120%;
  width: 90%;
  height:100%;
  background-color: rgb(220, 226, 230);
  border-radius: 25px 0 0 25px;
  padding: 6rem 1.5rem 2rem;
  transition: right 0.3s ease;
  z-index: 105;
  box-shadow: -8px 15px 25px rgba(96, 102, 147, 0.4),
              -3px 0 10px rgba(0, 0, 0, 0.1);
}

.header-nav.active {
  right: 0;
}

.nav-links {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
  margin-top: 1.5rem;
}

.nav-link {
  color: #333;
  text-decoration: none;
  padding: 0.5rem 1rem;
  transition: all 0.2s ease;
  font-size: 1.1rem;
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
}

.link-text {
  position: relative;
  z-index: 1;
}

.link-underline {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #0e8ca3;
  transition: width 0.3s ease;
}

.nav-link:hover .link-underline {
  width: 100%;
}

.nav-link.clicked .link-underline,
.nav-link.active .link-underline {
  width: 100%;
}

.nav-link.active {
  color: #0e8ca3;
  font-weight: 500;
}

.nav-button {
  background: transparent;
  border: 1px solid #0e8ca3;
  color: #0e8ca3;
  padding: 0.5rem 1.5rem;
  border-radius: 9999px;
  font-family: "Inter", sans-serif;
  cursor: pointer;
  font-size: 1rem;
  margin: 13rem auto 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  width: fit-content;
}

.login-icon {
  transition: all 0.3s ease;
}

.nav-button:hover,
.nav-button.clicked {
  background: #0e8ca3;
  color: white;
}

.nav-button:hover .login-icon,
.nav-button.clicked .login-icon {
  fill: white;
}

@media (min-width: 768px) {
  .hamburger {
    display: none;
  }
  
  .header-nav {
    position: static;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: auto;
    padding: 0;
    background-color: transparent;
    box-shadow: none;
    transform: none;
    right: auto;
  }

  .nav-links {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    flex-direction: row;
    gap: 4.5rem;
    margin: 0;
  }

  .nav-link {
    padding: 0.3rem 0;
    font-size: 1rem;
  }

  .link-underline {
    display: block;
  }

  .nav-link:hover,
  .nav-link.active {
    border-bottom: none;
  }

  .nav-button {
    position: static;
    margin: 0 0 0 auto;
  }

  .header-logo {
    position: static;
    
  }
}
</style>