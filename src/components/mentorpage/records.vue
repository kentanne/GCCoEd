<script setup>
import { ref } from "vue";

const records = ref([
	{
		id: 1,
		date: "2023-10-01",
		course: "1st Year / BSIT",
		name: "John Doe",
		year: "1st Year",
		status: "Completed",
		rating: 5,
		feedback: "Great session! Learned a lot!",
	},
	{
		id: 2,
		date: "2023-10-02",
		course: "2nd Year / BSIT",
		name: "Jane Smith",
		year: "2nd Year",
		status: "Completed",
		rating: 4,
		feedback: "Very informative, but a bit fast-paced.",
	},
	{
		id: 3,
		date: "2023-10-03",
		course: "1st Year / BSIT",
		name: "Alice Johnson",
		year: "1st Year",
		status: "Completed",
		rating: 5,
		feedback: "Awesome instructor, clear explanations!",
	},
	{
		id: 4,
		date: "2023-10-04",
		course: "3rd Year / BSIT",
		name: "Bob Lee",
		year: "3rd Year",
		status: "Completed",
		rating: 3,
		feedback: "Good content, but needs better visuals.",
	},
	{
		id: 5,
		date: "2023-10-05",
		course: "2nd Year / BSIT",
		name: "Ella Cruz",
		year: "2nd Year",
		status: "Completed",
		rating: 4,
		feedback: "Well structured and easy to follow.",
	},
	{
		id: 6,
		date: "2023-10-06",
		course: "4th Year / BSIT",
		name: "Charlie Kim",
		year: "4th Year",
		status: "Completed",
		rating: 5,
		feedback: "Loved the hands-on exercises!",
	},
	{
		id: 7,
		date: "2023-10-07",
		course: "3rd Year / BSIT",
		name: "Diana Park",
		year: "3rd Year",
		status: "Completed",
		rating: 4,
		feedback: "Useful insights and real-world examples.",
	},
	{
		id: 8,
		date: "2023-10-08",
		course: "2nd Year / BSIT",
		name: "Edward Blake",
		year: "2nd Year",
		status: "Completed",
		rating: 5,
		feedback: "Excellent explanation of concepts!",
	},
	{
		id: 9,
		date: "2023-10-09",
		course: "1st Year / BSIT",
		name: "Fiona Lane",
		year: "1st Year",
		status: "Completed",
		rating: 5,
		feedback: "Super beginner-friendly, loved it!",
	},
	{
		id: 10,
		date: "2023-10-10",
		course: "4th Year / BSIT",
		name: "George Finn",
		year: "4th Year",
		status: "Completed",
		rating: 4,
		feedback: "Very interesting and well-explained.",
	},
	{
		id: 11,
		date: "2023-10-11",
		course: "2nd Year / BSIT",
		name: "Hannah Wells",
		year: "2nd Year",
		status: "Completed",
		rating: 3,
		feedback: "Could use more visual aids.",
	},
	{
		id: 12,
		date: "2023-10-12",
		course: "3rd Year / BSIT",
		name: "Isaac Nash",
		year: "3rd Year",
		status: "Completed",
		rating: 5,
		feedback: "Engaging content and activities!",
	},
	{
		id: 13,
		date: "2023-10-13",
		course: "1st Year / BSIT",
		name: "Julia Kim",
		year: "1st Year",
		status: "Completed",
		rating: 4,
		feedback: "Really helpful for understanding design.",
	},
	{
		id: 14,
		date: "2023-10-14",
		course: "2nd Year / BSIT",
		name: "Kevin Hart",
		year: "2nd Year",
		status: "Completed",
		rating: 3,
		feedback: "A bit hard to follow at times.",
	},
	{
		id: 15,
		date: "2023-10-15",
		course: "1st Year / BSIT",
		name: "Lana Rhodes",
		year: "1st Year",
		status: "Completed",
		rating: 5,
		feedback: "Simple and effective delivery!",
	},
	{
		id: 16,
		date: "2023-10-16",
		course: "2nd Year / BSIT",
		name: "Mike Taylor",
		year: "2nd Year",
		status: "Completed",
		rating: 4,
		feedback: "Covered all basics really well.",
	},
	{
		id: 17,
		date: "2023-10-17",
		course: "4th Year / BSIT",
		name: "Nina Gold",
		year: "4th Year",
		status: "Completed",
		rating: 4,
		feedback: "A great introduction to cloud concepts.",
	},
	{
		id: 18,
		date: "2023-10-18",
		course: "4th Year / BSIT",
		name: "Oscar Knight",
		year: "4th Year",
		status: "Completed",
		rating: 5,
		feedback: "Really useful for my thesis work.",
	},
	{
		id: 19,
		date: "2023-10-19",
		course: "3rd Year / BSIT",
		name: "Paula Rivera",
		year: "3rd Year",
		status: "Completed",
		rating: 4,
		feedback: "Interactive and practical session!",
	},
	{
		id: 20,
		date: "2023-10-20",
		course: "2nd Year / BSIT",
		name: "Quentin Blaze",
		year: "2nd Year",
		status: "Completed",
		rating: 3,
		feedback: "Could use simpler examples.",
	},
	{
		id: 21,
		date: "2023-10-21",
		course: "1st Year / BSIT",
		name: "Rachel Green",
		year: "1st Year",
		status: "Completed",
		rating: 5,
		feedback: "Very helpful for report making!",
	},
	{
		id: 22,
		date: "2023-10-22",
		course: "3rd Year / BSIT",
		name: "Steve Jobs",
		year: "3rd Year",
		status: "Completed",
		rating: 4,
		feedback: "Deep dive into protocols, great!",
	},
	{
		id: 23,
		date: "2023-10-23",
		course: "2nd Year / BSIT",
		name: "Tina Moon",
		year: "2nd Year",
		status: "Completed",
		rating: 5,
		feedback: "Fun and very engaging!",
	},
	{
		id: 24,
		date: "2023-10-24",
		course: "4th Year / BSIT",
		name: "Ulysses Grant",
		year: "4th Year",
		status: "Completed",
		rating: 3,
		feedback: "Could improve pacing a bit.",
	},
	{
		id: 25,
		date: "2023-10-25",
		course: "3rd Year / BSIT",
		name: "Vera Stone",
		year: "3rd Year",
		status: "Completed",
		rating: 5,
		feedback: "Loved the ethical hacking demos!",
	},
	{
		id: 26,
		date: "2023-10-26",
		course: "4th Year / BSIT",
		name: "William Kent",
		year: "4th Year",
		status: "Completed",
		rating: 4,
		feedback: "A great look into machine vision!",
	},
	{
		id: 27,
		date: "2023-10-27",
		course: "2nd Year / BSIT",
		name: "Xander Fox",
		year: "2nd Year",
		status: "Completed",
		rating: 5,
		feedback: "Fun and challenging session!",
	},
	{
		id: 28,
		date: "2023-10-28",
		course: "3rd Year / BSIT",
		name: "Yasmine Grey",
		year: "3rd Year",
		status: "Completed",
		rating: 4,
		feedback: "Well presented and practical.",
	},
	{
		id: 29,
		date: "2023-10-29",
		course: "4th Year / BSIT",
		name: "Zane Carter",
		year: "4th Year",
		status: "Completed",
		rating: 4,
		feedback: "Introduced blockchain really well.",
	},
	{
		id: 30,
		date: "2023-10-30",
		course: "3rd Year / BSIT",
		name: "Ava Morgan",
		year: "3rd Year",
		status: "Completed",
		rating: 5,
		feedback: "Excellent session on integration!",
	},
	{
		id: 31,
		date: "2023-10-31",
		course: "1st Year / BSIT",
		name: "Ben Oliver",
		year: "1st Year",
		status: "Completed",
		rating: 5,
		feedback: "Good overview for beginners!",
	},
	{
		id: 32,
		date: "2023-11-01",
		course: "2nd Year / BSIT",
		name: "Cleo Davis",
		year: "2nd Year",
		status: "Completed",
		rating: 4,
		feedback: "Detailed and well-delivered topic.",
	},
]);

const recordView = ref({
	id: 0,
	date: "",
	course: "",
	name: "",
	year: "",
	status: "",
	rating: 0,
	feedback: "",
});

const isFeedback = ref(false);

const viewFeedback = (record) => {
	isFeedback.value = true;
	recordView.value = record;
};

const closeFeedback = () => {
	isFeedback.value = false;
	recordView.value = null;
};
</script>

<template>
	<div class="records-wrapper">
		<div class="top-element">
			<font-awesome-icon icon="fa-book" size="3x" color="#fff" />
			<h1>Session Records</h1>
		</div>
		<div class="lower-element">
			<table>
				<thead>
					<tr>
						<th>DATE / TIME</th>
						<th>COURSE</th>
						<th>LEARNER'S NAME</th>
						<th>YEAR / PROGRAM</th>
						<th>STATUS</th>
						<th>RATING</th>
						<th>ACTIONS</th>
					</tr>
				</thead>
				<tbody>
					<!-- Create a row for each record -->
					<tr
						v-for="record in records"
						:key="record.date + record.name"
					>
						<td>{{ record.date }}</td>
						<td>{{ record.course }}</td>
						<td>{{ record.name }}</td>
						<td>{{ record.year }}</td>
						<td>{{ record.status }}</td>
						<td>
							<div class="stars">
								<span v-for="i in 5" :key="i" class="star">
									<span
										v-if="i <= record.rating"
										class="filled"
										>★</span
									>
									<span v-else>☆</span>
								</span>
							</div>
						</td>
						<td>
							<button
								@click="viewFeedback(record)"
								class="view-feedback-btn"
								:disabled="record.status !== 'Completed'"
							>
								View Feedback
							</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<transition name="fade" mode="out-in">
			<div v-if="isFeedback" class="feedback-pop-up">
				<div class="feedback-upper">
					<img src="https://placehold.co/600x400" alt="profile-pic" />
					<h1>{{ recordView.name }}</h1>
					<h2>{{ recordView.course }}</h2>

					<font-awesome-icon
						@click="closeFeedback"
						icon="fa-xmark"
						size="2x"
						color="#fff"
						style="cursor: pointer"
						class="exit-feedback"
					/>
				</div>
				<div class="feedback-lower">
					<h1>FEEDBACK</h1>
					<div class="feedback-content">
						<p>
							{{ recordView.feedback }}
						</p>
					</div>
				</div>
			</div>
		</transition>
	</div>
</template>

<style scoped>
.records-wrapper {
	display: flex;
	justify-content: center;
	flex-direction: column;
	width: 100%;
	overflow: hidden;
}

.top-element {
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	gap: 17px;
	background-color: #0c434d;
	padding: 18px 30px;
	border-radius: 20px 20px 0 0;
}
.top-element h1 {
	color: #fff;
	font-size: 2rem;
	font-weight: 600;
}

.lower-element {
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	gap: 10px;
	background-color: #fff;
	border-radius: 0 0 20px 20px;
	overflow: hidden;
	border: 3px solid #0c434d;
	height: 542px;

}

table {
	width: 100%;
	border-collapse: separate;
	border-spacing: 0;
	table-layout: fixed;
	color: #066678;
}

thead {
	position: sticky;
	top: 0;
	z-index: 1;
	background-color: white;
}

th {
	padding: 10px;
	text-align: center;
	font-weight: bold;
	border-bottom: 2px solid #ddd;
	background-color: #f5f5f5;
}

tbody {
	display: block;
	overflow-y: auto;
	max-height: 660px;
}

thead,
tbody tr {
	display: table;
	width: 100%;
	table-layout: fixed;
}

td {
	text-align: center;
	padding: 10px;
	border-bottom: 1px solid #ddd;
}

.stars {
	display: flex;
	justify-content: center;
	align-items: center;
}

.star {
	font-size: 1.2rem;
	color: #ccc;
}

.filled {
	color: #ffd700;
}

td button {
	background-color: transparent;
	border: none;
	cursor: pointer;
	text-decoration: underline;
	color: #066678;
}

/* pop-up */

.feedback-pop-up {
	position: fixed;
	top: 50%;
	left: 55%;
	transform: translate(-50%, -50%);
	width: 375px;
	height: 450px;
	background-color: #006981;
	padding: 15px 20px 30px 20px;
	overflow: hidden;
	z-index: 1000;
	border-radius: 20px;
}

.feedback-upper,
.feedback-lower {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	gap: 10px;
	padding: 20px;
	position: relative;
}

.feedback-upper img {
	width: 110px;
	height: 110px;
	object-fit: cover;
	border-radius: 50%;
}

.feedback-upper h1 {
	color: #fff;
	font-size: 1.4rem;
	font-weight: 600;
}

.feedback-upper::after {
	content: "";
	position: absolute;
	bottom: 0;
	left: 50%;
	transform: translateX(-50%);
	width: 90%;
	height: 3px;
	background-color: #a6a6a6;
}

.feedback-upper h2 {
	color: #fff;
	font-size: 1.2rem;
	font-weight: 400;
}

.feedback-lower {
	display: flex;
	flex-direction: column;
	flex: 1;
}

.feedback-lower h1 {
	color: #fff;
	font-size: 1.1rem;
	font-weight: 400;
}

.feedback-content {
	padding: 10px 20px;
	background-color: #fff;
	border-radius: 10px;
	width: 100%;
	height: 160px;
	max-height: 160px;
	overflow-y: auto;
	word-wrap: break-word;
}

.feedback-content p {
	color: #066678;
	font-size: 0.9rem;
	font-weight: 400;
	text-align: justify;
}

.feedback-content::-webkit-scrollbar {
	width: 8px;
}

.exit-feedback {
	position: fixed;
	top: 20px;
	right: 20px;
}
</style>
