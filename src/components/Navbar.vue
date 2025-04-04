<template>
  <header>
    <div class="header-logo">
      <img alt="Company logo" :src="logo" />
      <span>GCCoEd</span>
    </div>

    <nav class="header-nav">
      <a 
        v-for="link in links" 
        :key="link.name" 
        :href="link.href" 
        :class="{'nav-link': true, 'active': activeLink === link.name}"
        @click="setActive(link.name)"
      >
        {{ link.name }}
      </a>
    </nav>

    <div class="header-buttons">
      <button :class="{'clicked': isLoginClicked}" @click="goToLogin">Login</button>
      <button :class="{'clicked': isSignupClicked}" @click="goToSignup">Sign Up</button>
    </div>
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
      isSignupClicked: false,
      links: [
        { name: 'Home', href: '#home' },
        { name: 'Roles', href: '#learners' },
        { name: 'Overview', href: '#how-it-works' },
        { name: 'Get Started', href: '#get-started' },
      ]
    };
  },
  methods: {
    goToLogin() {
      this.isLoginClicked = true;
      this.isSignupClicked = false;
      this.$router.push("/login");
    },
    goToSignup() {
      this.isSignupClicked = true;
      this.isLoginClicked = false;
      this.$router.push("/signup");
    },
    setActive(link) {
      this.$router.push({ path: '/', hash: link.href });
      this.activeLink = link.name;
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
        this.isSignupClicked = false;
      } else if (this.$route.path === '/signup') {
        this.isSignupClicked = true;
        this.isLoginClicked = false;
      } else {
        this.isLoginClicked = false;
        this.isSignupClicked = false;
      }
    }
  },
  created() {
    this.checkActiveLink();
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  watch: {
    '$route' (to) {
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
  width: 100vw;
  padding: 1rem 2rem;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  background-color: #0e8ca3;
  font-family: "Inter", sans-serif;
}

.header-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.header-logo img {
  width: 3.5rem;
  height: 2.5rem;
}

.header-logo span {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
}

.header-nav {
  display: none;
  gap: 6rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding-bottom: 0.2rem;
  transition: color 0.3s, border-bottom 0.3s;
}

.nav-link:hover,
.nav-link.active {
  color: #1e3a8a;
  border-bottom: 2px solid #02475e;
}

.header-buttons {
  display: flex;
  gap: 1rem;
}

.header-buttons button {
  background: transparent;
  border: 1px solid white;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  font-family: "Inter", sans-serif;
  cursor: pointer;
  font-size: 1rem;
  width: 110px;
  transition: background 0.3s ease;
}

.header-buttons button:hover,
.header-buttons button.clicked {
  background: linear-gradient(to right, #87badc, #02475e);
  border: none;
}

@media (min-width: 768px) {
  .header-nav {
    display: flex;
  }
}
</style>