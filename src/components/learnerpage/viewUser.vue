<script setup>
import { ref } from "vue";

const emit = defineEmits(["close"]);
</script>

<template>
	<div class="wrapper">
		<div class="upper-element">
			<font-awesome-icon
				@click="emit('close')"
				icon="fa-xmark"
				size="2x"
				color="white"
				style="cursor: pointer"
			/>
		</div>
		<div class="lower-element">
			<div class="lower-upper">
				<div class="profile-image">
					<img
						src="https://placehold.co/600x400"
						alt="Profile Image"
					/>
				</div>
				<div class="profile-information">
					<div>
						<h1>MARIA ROSE L. MENDOZA</h1>
						<p>
							2nd Year - Bachelor of Science in Information Technology 
						</p>
						<p>	College of Computer Studies
						</p>
					</div>
					<div>
						<p>Gender: <strong>Female</strong></p>
						<p>
							Contact Information:
							<strong>09206033143/marirose.m@gmail.com</strong>
						</p>
						<p>
							Address:
							<strong>Calapacuan - Subic, Zambales</strong>
						</p>
					</div>
				</div>
			</div>

			<div class="lower-lower">
				<div class="bio">
					<label>Bio</label>
				</div>
				<div class="offered">
					<label>Course Offered</label>
				</div>
				<div class="mostyle">
					<label>Teachng Modality</label>
					<label>Teaching Style</label>
				</div>
				<div class="avadura">
					<label>Days of Availability</label>
					<label>Preferred Session Duration</label>
				</div>
				<div class="experience">
					<label>Teaching Experience</label>
				</div>
				<div class="action-button">
					<button>Schedule</button>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.wrapper {
	display: flex;
	flex-direction: column;
	width: 775px;
	height: 600px;
	padding: 20px;
	overflow: hidden;
}

.upper-element {
	display: flex;
	justify-content: flex-end;
	background-color: #0c434d;
	padding: 20px;
	border-radius: 20px 20px 0 0;
}

.lower-element {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	background-color: #edeceb;
	border-radius: 0 0 20px 20px;
	overflow: hidden;
	height: max-content;
	padding: 20px;
	border: 3px solid #0c434d;
}

.profile-image {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
}

.lower-upper {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
	gap: 40px;
	position: relative;
	padding-bottom: 20px;
}

.lower-upper::after {
	content: "";
	position: absolute;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 3px;
	background-color: #066678;
	border-radius: 20px;
}

.lower-upper h1 {
	font-size: 1.3rem;
	font-weight: 600;
	color: #0c434d;
	margin-bottom: 5px;
}

.lower-upper p {
	font-size: 0.9rem;
	color: #0c434d;
	margin-bottom: 5px;
}

.profile-image img {
	width: 100px;
	height: 100px;
	border-radius: 50%;
	object-fit: cover;
}

.profile-information div:first-of-type {
	margin-bottom: 20px;
}

.lower-lower {
	display: flex;
	flex-direction: column;
	width: 100%;
	margin-top: 20px;
	gap: 20px;
}

.mostyle,
.avadura {
	display: flex;
	width: 100%;
	gap: 20px;
}

label {
	color: #066678;
}

.action-button {
	display: flex;
	justify-content: flex-end;
}

.lower-lower button {
	background-color: #0c434d;
	color: #fff;
	border: none;
	padding: 10px 20px;
	border-radius: 5px;
	cursor: pointer;
	margin-top: 20px;
}
</style>
