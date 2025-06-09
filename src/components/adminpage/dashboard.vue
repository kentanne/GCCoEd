<template>
  <div class="dashboard-container">
    <!-- Existing stats cards -->
    <div class="stats-grid">
      <div class="stat-card learners">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"
            />
          </svg>
        </div>
        <div class="stat-content">
          <h3>{{ stats.learners }}</h3>
          <p>Active Learners</p>
        </div>
      </div>

      <div class="stat-card mentors">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M16,4C18.11,4 19.81,5.69 19.81,7.8C19.81,9.91 18.11,11.6 16,11.6C13.89,11.6 12.19,9.91 12.19,7.8C12.19,5.69 13.89,4 16,4M16,13.4C18.67,13.4 24,14.73 24,17.4V20H8V17.4C8,14.73 13.33,13.4 16,13.4M8.5,8.5C8.5,9.33 7.83,10 7,10C6.17,10 5.5,9.33 5.5,8.5C5.5,7.67 6.17,7 7,7C7.83,7 8.5,7.67 8.5,8.5M9,13C9.65,13 10.2,13.33 10.41,13.79C9.16,14.46 8.5,15.27 8.5,16.25V18H0V16.25C0,14.23 4.5,13 9,13Z"
            />
          </svg>
        </div>
        <div class="stat-content">
          <h3>{{ stats.mentors }}</h3>
          <p>Active Mentors</p>
        </div>
      </div>

      <div class="stat-card applicants">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"
            />
          </svg>
        </div>
        <div class="stat-content">
          <h3>{{ stats.applicants }}</h3>
          <p>Pending Applications</p>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="charts-container">
      <div class="charts-header"></div>

      <div class="charts-grid">
        <!-- User Distribution Chart -->
        <div class="chart-card">
          <div class="chart-header">
            <h3>User Distribution</h3>
            <span class="chart-subtitle">Breakdown by user type</span>
          </div>
          <div class="chart-wrapper">
            <canvas
              ref="userDistributionChart"
              width="400"
              height="300"
            ></canvas>
          </div>
        </div>

        <!-- Course Distribution Chart -->
        <div class="chart-card">
          <div class="chart-header">
            <h3>Program Distribution</h3>
            <span class="chart-subtitle">Students per course program</span>
          </div>
          <div class="chart-wrapper">
            <canvas ref="courseChart" width="400" height="300"></canvas>
          </div>
        </div>

        <!-- Year Level Distribution Chart -->
        <div class="chart-card">
          <div class="chart-header">
            <h3>Year Level Distribution</h3>
            <span class="chart-subtitle">Students by academic year</span>
          </div>
          <div class="chart-wrapper">
            <canvas ref="yearChart" width="400" height="300"></canvas>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick, onUnmounted } from "vue";
import {
  Chart as ChartJS,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  DoughnutController,
} from "chart.js";

// Register Chart.js components for doughnut charts only
ChartJS.register(ArcElement, Title, Tooltip, Legend, DoughnutController);

// Props
const props = defineProps({
  stats: {
    type: Object,
    required: true,
    default: () => ({
      learners: 0,
      mentors: 0,
      applicants: 0,
    }),
  },
  chartData: {
    type: Object,
    required: true,
    default: () => ({
      userCounts: null,
      courseBreakdown: null,
      yearBreakdown: null,
    }),
  },
});

// Chart refs
const userDistributionChart = ref(null);
const courseChart = ref(null);
const yearChart = ref(null);

// Chart instances
let userDistributionChartInstance = null;
let courseChartInstance = null;
let yearChartInstance = null;

// Color palettes for different charts
const userColors = {
  backgroundColor: ["#22c55e", "#3b82f6", "#f97316"], // Green for learners, Blue for mentors, Orange for pending
  borderColor: ["#16a34a", "#2563eb", "#ea580c"], // Darker shades for borders
};

const courseColors = {
  backgroundColor: [
    "#4361ee",
    "#4895ef",
    "#7209b7",
    "#f72585",
    "#4cc9f0",
    "#7209b7",
    "#f72585",
    "#4895ef",
    "#4361ee",
    "#4cc9f0",
  ],
  borderColor: [
    "#3f37c9",
    "#4361ee",
    "#6a1b9a",
    "#d90429",
    "#0077b6",
    "#6a1b9a",
    "#d90429",
    "#4361ee",
    "#3f37c9",
    "#0077b6",
  ],
};

const yearColors = {
  backgroundColor: ["#7209b7", "#4361ee", "#4895ef", "#f72585", "#4cc9f0"],
  borderColor: ["#6a1b9a", "#3f37c9", "#4361ee", "#d90429", "#0077b6"],
};

// Chart creation functions
const createCharts = () => {
  if (
    props.chartData &&
    Object.values(props.chartData).some((data) => data !== null)
  ) {
    createUserDistributionChart();
    createCourseChart();
    createYearChart();
  }
};

const createUserDistributionChart = () => {
  if (!userDistributionChart.value || !props.chartData.userCounts) return;

  // Destroy existing chart if it exists
  if (userDistributionChartInstance) {
    userDistributionChartInstance.destroy();
  }

  const ctx = userDistributionChart.value.getContext("2d");
  const counts = props.chartData.userCounts;

  userDistributionChartInstance = new ChartJS(ctx, {
    type: "doughnut",
    data: {
      labels: ["Learners", "Approved Mentors", "Pending Applications"],
      datasets: [
        {
          data: [
            counts.learners,
            counts.approved_mentors,
            counts.pending_mentors,
          ],
          backgroundColor: [
            "#22c55e", // Green for Learners
            "#3b82f6", // Blue for Approved Mentors
            "#f97316", // Orange for Pending Applications
          ],
          borderColor: [
            "#16a34a", // Darker green border
            "#2563eb", // Darker blue border
            "#ea580c", // Darker orange border
          ],
          borderWidth: 2,
          hoverOffset: 8,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "60%",
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            padding: 20,
            usePointStyle: true,
            font: {
              size: 12,
              family: "Inter, sans-serif",
            },
          },
        },
        tooltip: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          titleColor: "#ffffff",
          bodyColor: "#ffffff",
          callbacks: {
            label: function (context) {
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((context.raw / total) * 100).toFixed(1);
              return `${context.label}: ${context.raw} (${percentage}%)`;
            },
          },
        },
      },
    },
  });
};

const createCourseChart = () => {
  if (!courseChart.value || !props.chartData.courseBreakdown) return;

  // Destroy existing chart if it exists
  if (courseChartInstance) {
    courseChartInstance.destroy();
  }

  const ctx = courseChart.value.getContext("2d");
  const courseData = props.chartData.courseBreakdown.data;

  // Course cleaner function to extract abbreviations
  const cleanCourseName = (courseName) => {
    // Convert to uppercase for consistency
    const upperCourse = courseName.toUpperCase();

    // Extract abbreviation patterns
    if (
      upperCourse.includes("BSIT") ||
      upperCourse.includes("BS IT") ||
      upperCourse.includes("INFORMATION TECHNOLOGY")
    ) {
      return "BSIT";
    } else if (
      upperCourse.includes("BSCS") ||
      upperCourse.includes("BS CS") ||
      upperCourse.includes("COMPUTER SCIENCE")
    ) {
      return "BSCS";
    } else if (
      upperCourse.includes("BSEMC") ||
      upperCourse.includes("BS EMC") ||
      upperCourse.includes("ENTERTAINMENT") ||
      upperCourse.includes("MULTIMEDIA")
    ) {
      return "BSEMC";
    }

    // If no match found, try to extract first letters after "BS"
    const match = upperCourse.match(/BS\s*([A-Z]+)/);
    if (match) {
      return `BS${match[1]}`;
    }

    // Fallback: return first 5-6 characters if it looks like an abbreviation
    if (upperCourse.length <= 8 && upperCourse.match(/^[A-Z\s]+$/)) {
      return upperCourse.replace(/\s+/g, "");
    }

    // Last resort: return original but limit length
    return courseName.length > 8
      ? courseName.substring(0, 8).toUpperCase()
      : courseName.toUpperCase();
  };

  // Clean and process the course data
  const cleanedCourseData = {};
  Object.entries(courseData).forEach(([course, count]) => {
    const cleanedName = cleanCourseName(course);
    if (cleanedCourseData[cleanedName]) {
      cleanedCourseData[cleanedName] += count;
    } else {
      cleanedCourseData[cleanedName] = count;
    }
  });

  // Define the expected course order for consistent coloring
  const courseOrder = ["BSIT", "BSCS", "BSEMC"];

  // Sort the data according to the defined order
  const sortedLabels = [];
  const sortedData = [];
  const sortedColors = [];
  const sortedBorderColors = [];

  courseOrder.forEach((course, index) => {
    if (cleanedCourseData[course] !== undefined) {
      sortedLabels.push(course);
      sortedData.push(cleanedCourseData[course]);
      sortedColors.push(courseColors.backgroundColor[index]);
      sortedBorderColors.push(courseColors.borderColor[index]);
    }
  });

  // Add any other courses that don't match the main three
  Object.entries(cleanedCourseData).forEach(([course, count]) => {
    if (!courseOrder.includes(course)) {
      sortedLabels.push(course);
      sortedData.push(count);
      // Use additional colors for unexpected courses
      const colorIndex = sortedLabels.length - 1;
      sortedColors.push(
        courseColors.backgroundColor[
          colorIndex % courseColors.backgroundColor.length
        ]
      );
      sortedBorderColors.push(
        courseColors.borderColor[colorIndex % courseColors.borderColor.length]
      );
    }
  });

  courseChartInstance = new ChartJS(ctx, {
    type: "doughnut",
    data: {
      labels: sortedLabels,
      datasets: [
        {
          data: sortedData,
          backgroundColor: sortedColors,
          borderColor: sortedBorderColors,
          borderWidth: 2,
          hoverOffset: 8,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "50%",
      plugins: {
        legend: {
          display: true,
          position: "bottom",
          labels: {
            padding: 20,
            usePointStyle: true,
            font: {
              size: 12,
              family: "Inter, sans-serif",
            },
            boxWidth: 15,
            boxHeight: 15,
          },
        },
        tooltip: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          titleColor: "#ffffff",
          bodyColor: "#ffffff",
          callbacks: {
            title: function (context) {
              return `Course: ${context[0].label}`;
            },
            label: function (context) {
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((context.raw / total) * 100).toFixed(1);
              return `Students: ${context.raw} (${percentage}%)`;
            },
          },
        },
      },
      layout: {
        padding: {
          bottom: 10,
        },
      },
    },
  });
};

const createYearChart = () => {
  if (!yearChart.value || !props.chartData.yearBreakdown) return;

  // Destroy existing chart if it exists
  if (yearChartInstance) {
    yearChartInstance.destroy();
  }

  const ctx = yearChart.value.getContext("2d");
  const yearData = props.chartData.yearBreakdown.data;

  const labels = Object.keys(yearData);
  const data = Object.values(yearData);

  yearChartInstance = new ChartJS(ctx, {
    type: "doughnut",
    data: {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: yearColors.backgroundColor.slice(0, labels.length),
          borderColor: yearColors.borderColor.slice(0, labels.length),
          borderWidth: 2,
          hoverOffset: 8,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "55%",
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            padding: 20,
            usePointStyle: true,
            font: {
              size: 12,
              family: "Inter, sans-serif",
            },
          },
        },
        tooltip: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          titleColor: "#ffffff",
          bodyColor: "#ffffff",
          callbacks: {
            title: function (context) {
              return `Year Level: ${context[0].label}`;
            },
            label: function (context) {
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((context.raw / total) * 100).toFixed(1);
              return `Students: ${context.raw} (${percentage}%)`;
            },
          },
        },
      },
    },
  });
};

// Watch for chartData changes
watch(
  () => props.chartData,
  async () => {
    await nextTick();
    createCharts();
  },
  { deep: true, immediate: true }
);

// Cleanup function
const destroyCharts = () => {
  if (userDistributionChartInstance) {
    userDistributionChartInstance.destroy();
    userDistributionChartInstance = null;
  }
  if (courseChartInstance) {
    courseChartInstance.destroy();
    courseChartInstance = null;
  }
  if (yearChartInstance) {
    yearChartInstance.destroy();
    yearChartInstance = null;
  }
};

// Lifecycle hooks
onMounted(async () => {
  await nextTick();
  createCharts();
});

onUnmounted(() => {
  destroyCharts();
});
</script>

<style scoped>
/* Keep all your existing styles */
.dashboard-container {
  padding: 0;
  max-width: 100%;
}

/* Existing stats grid styles */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: var(--white);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  border: 1px solid var(--border);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon svg {
  width: 28px;
  height: 28px;
}

/* Add the missing stat-icon classes */
.learners .stat-icon {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: var(--white);
}

.mentors .stat-icon {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: var(--white);
}

.applicants .stat-icon {
  background: linear-gradient(135deg, #f97316, #ea580c);
  color: var(--white);
}

.stat-content h3 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 0.25rem;
}

.stat-content p {
  color: var(--text-light);
  font-size: 0.875rem;
  font-weight: 500;
}

/* Charts section styles */
.charts-container {
  margin-top: 2rem;
}

.charts-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.charts-header h2 {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 0.5rem;
}

.charts-header p {
  color: var(--text-light);
  font-size: 1rem;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

.chart-card {
  background: var(--white);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  border: 1px solid var(--border);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.chart-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
}

.chart-header {
  margin-bottom: 1.5rem;
  text-align: center;
}

.chart-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 0.25rem;
}

.chart-subtitle {
  color: var(--text-light);
  font-size: 0.875rem;
}

.chart-wrapper {
  position: relative;
  height: 300px;
  width: 100%;
}

/* Mobile Responsive Styles */
@media (max-width: 1024px) {
  .dashboard-container {
    padding: 0 1rem;
  }

  .charts-grid {
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 1.5rem;
  }

  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1rem;
  }
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 0 0.75rem;
  }

  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .stat-card {
    padding: 1.25rem;
  }

  .stat-icon {
    width: 50px;
    height: 50px;
  }

  .stat-icon svg {
    width: 24px;
    height: 24px;
  }

  .stat-content h3 {
    font-size: 1.75rem;
  }

  .stat-content p {
    font-size: 0.8125rem;
  }

  .charts-container {
    margin-top: 1.5rem;
  }

  .charts-header {
    margin-bottom: 2rem;
  }

  .charts-header h2 {
    font-size: 1.5rem;
  }

  .charts-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .chart-card {
    padding: 1.25rem;
  }

  .chart-wrapper {
    height: 280px;
  }
}

@media (max-width: 640px) {
  .dashboard-container {
    padding: 0 0.5rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .stat-card {
    padding: 1rem;
    gap: 0.75rem;
  }

  .stat-content h3 {
    font-size: 1.5rem;
  }

  .charts-header {
    margin-bottom: 1.5rem;
  }

  .charts-header h2 {
    font-size: 1.375rem;
  }

  .charts-header p {
    font-size: 0.9375rem;
  }

  .chart-card {
    padding: 1rem;
  }

  .chart-header h3 {
    font-size: 1.125rem;
  }

  .chart-subtitle {
    font-size: 0.8125rem;
  }

  .chart-wrapper {
    height: 250px;
  }
}

@media (max-width: 480px) {
  .dashboard-container {
    padding: 0 0.25rem;
  }

  .stats-grid {
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .stat-card {
    padding: 0.875rem;
    gap: 0.625rem;
    flex-direction: column;
    text-align: center;
  }

  .stat-icon {
    width: 45px;
    height: 45px;
  }

  .stat-icon svg {
    width: 20px;
    height: 20px;
  }

  .stat-content h3 {
    font-size: 1.375rem;
    margin-bottom: 0.125rem;
  }

  .stat-content p {
    font-size: 0.75rem;
  }

  .charts-container {
    margin-top: 1rem;
  }

  .charts-header {
    margin-bottom: 1rem;
  }

  .charts-header h2 {
    font-size: 1.25rem;
  }

  .charts-header p {
    font-size: 0.875rem;
  }

  .chart-card {
    padding: 0.75rem;
  }

  .chart-header {
    margin-bottom: 1rem;
  }

  .chart-header h3 {
    font-size: 1rem;
  }

  .chart-subtitle {
    font-size: 0.75rem;
  }

  .chart-wrapper {
    height: 220px;
  }
}

@media (max-width: 360px) {
  .stat-card {
    padding: 0.75rem;
  }

  .stat-content h3 {
    font-size: 1.25rem;
  }

  .chart-wrapper {
    height: 200px;
  }

  .chart-card {
    padding: 0.625rem;
  }
}
</style>
