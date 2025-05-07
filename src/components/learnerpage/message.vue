<script setup>
import { ref } from "vue";

const emit = defineEmits(["close"]);

const close = () => {
	emit("close");
};
</script>

<template>
	<div class="message-wrapper">
		<div class="upper-element">
			<div>
				<font-awesome-icon
					icon=" fa-comment-dots"
					color="white"
					size="2x"
				/>
				<h1>Send a Message</h1>
			</div>
			<div>
				<font-awesome-icon
					icon="fa-solid fa-xmark"
					color="white"
					size="2x"
					style="cursor: pointer"
					@click="close"
				/>
			</div>
		</div>
		<div class="lower-element">
			<textarea
				rows="10"
				cols="30"
				placeholder="Type your message here..."
			></textarea>
			<button>Send</button>
		</div>
	</div>
</template>

<style scoped>
.message-wrapper {
	display: flex;
	flex-direction: column;
	width: 430px;
	height: 275px;
}

.upper-element {
	display: flex;
	align-items: center;
	padding: 1rem 2rem;
	background-color: #0c434d;
	border-radius: 0.5rem 0.5rem 0 0;
	gap: 20px;
	justify-content: space-between;
}

.upper-element div:first-of-type {
	display: flex;
	align-items: center;
	gap: 10px;
}

.upper-element h1 {
	color: white;
	font-size: 1.5rem;
	font-weight: 600;
}

.lower-element {
	background-color: #349eb1;
	height: 100%;
	border-radius: 0 0 0.5rem 0.5rem;
	display: flex;
	padding: 20px 0;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
}

textarea {
	resize: none;
	height: 70%;
	width: 85%;
	border: none;
	font-family: "Montserrat", sans-serif;
	border-radius: 10px;
	padding: 10px;
}

textarea:focus {
	outline: none;
}

.lower-element button {
	background-color: #0c434d;
	color: white;
	border: none;
	padding: 10px 20px;
	border-radius: 5px;
	font-family: "Montserrat", sans-serif;
	font-size: 1rem;
	cursor: pointer;
	width: max-content;
	margin-bottom: -8px;
}
</style>
