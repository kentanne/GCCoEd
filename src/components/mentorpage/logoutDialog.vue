<script setup>
import { ref } from "vue";

const emit = defineEmits(["logout", "close"]);

const logout = () => {
	emit("logout");
};

const close = () => {
	emit("close");
};
</script>

<template>
	<div class="wrapper">
		<div class="upper-element">
			<font-awesome-icon
				icon="fa-xmark"
				class="logout-icon"
				size="2x"
				color="white"
				style="cursor: pointer"
				@click="close"
			/>
		</div>
		<div class="lower-element">
			<div>
				<h1>Are you sure you want to log out?</h1>
			</div>
			<div class="logout-buttons">
				<button @click="logout" class="confirm-button">Yes</button>
				<button class="cancel-button" @click="close">No</button>
			</div>
		</div>
	</div>
</template>

<style scoped>
.wrapper {
	display: flex;
	align-items: center;
	flex-direction: column;
	width: 100%;
	height: 200px;
	padding: 20px;
	overflow: hidden;
}

.upper-element {
	display: flex;
	flex-direction: row;
	background-color: #0c434d;
	justify-content: flex-end;
	align-items: center;
	width: 100%;
	border-radius: 20px 20px 0 0;
	padding: 10px 10px 10px 0;
	overflow: hidden;
}

.lower-element {
	display: flex;
	justify-content: center;
	background-color: #fff;
	border-radius: 0 0 20px 20px;
	overflow: hidden;
	height: 100%;
	width: inherit;
	border: 5px solid #0c434d;
	flex-direction: column;
}

.lower-element h1 {
	margin-top: 20px;
	font-size: 1.5rem;
	color: #0c434d;
	font-weight: 600;
	text-align: center;
}

.logout-buttons {
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 20px;
	margin-top: 20px;
}

.confirm-button {
	background-color: #0c434d;
	color: white;
	padding: 10px 20px;
	border-radius: 10px;
	border: none;
	cursor: pointer;
	font-size: 1rem;
}

.cancel-button {
	background-color: #f44336;
	color: white;
	padding: 10px 20px;
	border-radius: 10px;
	border: none;
	cursor: pointer;
	font-size: 1rem;
}
</style>
