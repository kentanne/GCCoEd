<template>
    <div>
      <h1>This is the MENTOR Dashboard</h1>
      <p>Only mentors should see this page</p>
    </div>
  </template>
  
  <script>
  // import api from '../../axios.js'; // Adjust the path as necessary
  import axios from 'axios';

  axios.defaults.withCredentials = true; // Enable sending cookies with requests
  axios.defaults.withXSRFToken = true; // Enable CSRF token handling

  // Add this function above the export default block or in a utility file if shared across components.
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  export default {
    name: 'MentorPage',

    methods: {
      async getCookVal(){
        const cookieValue = getCookie('XSRF-TOKEN');
        console.log("Cookie value:", cookieValue);
      },
      async getalltest() {
        try {
          const response = await axios.get('http://localhost:8000/api/mentor/users', {
            withCredentials: true,
            headers: 
            {'Content-Type': 'application/json',
              "X-XSRF-TOKEN": getCookie('XSRF-TOKEN'),
            }}); // Adjust the endpoint as necessary
          console.log("Fetched data:", response.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      },
    },
    mounted() {
      this.getCookVal();
      this.getalltest();
    },
  }
  </script>