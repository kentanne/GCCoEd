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
	width: 400px;
	height: 310px; 
	border-radius: 12px;
	overflow: hidden;
	font-family: 'Helvetica Neue', Arial, sans-serif;
	box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.upper-element {
	display: flex;
	align-items: center;
	padding: 1.25rem 1.5rem;
	background: linear-gradient(135deg, #2a5f6e, #0c434d);
	justify-content: space-between;
}

.upper-element div:first-of-type {
	display: flex;
	align-items: center;
	gap: 12px;
}

.upper-element h1 {
	color: white;
	font-size: 1.3rem;
	font-weight: 500;
	margin: 0;
	letter-spacing: 0.3px;
}

.lower-element {
	background-color: #ffffff;
	height: 100%;
	display: flex;
	padding: 1.5rem;
	flex-direction: column;
	gap: 1rem; 
}

textarea {
	resize: none;
	height: 120px; 
	width: 93%;
	border: 1px solid #e0e0e0;
	border-radius: 8px;
	padding: 12px;
	font-family: inherit;
	font-size: 0.95rem;
	background: #fafafa;
	transition: all 0.2s ease;
}

textarea:focus {
	outline: none;
	border-color: #2a5f6e;
	background: white;
	box-shadow: 0 0 0 2px rgba(42, 95, 110, 0.1);
}

.lower-element button {
	align-self: flex-end;
	background: #0c434d;
	color: white;
	border: none;
	padding: 0.7rem 1.8rem;
	border-radius: 6px;
	font-family: inherit;
	font-size: 0.95rem;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s ease;
}

.lower-element button:hover {
	background: #09505d;
	transform: translateY(-1px);
}

.lower-element button:active {
	transform: translateY(0);
}
</style>