<template>
  <router-view></router-view>
</template>

<style>
* {
	margin: 0;
	padding: 0;
}

h1,
h2,
h3,
h4,
h5,
h6,
p,
span,
label,
input,
textarea,
select,
button,
table {
	font-family: "Montserrat", sans-serif;
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
	opacity: 1;
}
</style>