<template>
  <div class="dashboard-cards">
    <div class="dashboard-card">
      <div class="card-text">
        <p class="card-title">Total Learners</p>
        <hr class="card-divider">
      </div>
      <div class="card-number-container">
        <i class="card-icon fas fa-users"></i>
        <p class="card-value">{{ stats.learners.toLocaleString() }}</p>
      </div>
    </div>
    
    <div class="dashboard-card">
      <div class="card-text">
        <p class="card-title">Total Mentors</p>
        <hr class="card-divider">
      </div>
      <div class="card-number-container">
        <i class="card-icon fas fa-chalkboard-teacher"></i>
        <p class="card-value">{{ stats.mentors.toLocaleString() }}</p>
      </div>
    </div>
    
    <div class="dashboard-card">
      <div class="card-text">
        <p class="card-title">Total Applicants</p>
        <hr class="card-divider">
      </div>
      <div class="card-number-container">
        <i class="card-icon fas fa-file-alt"></i>
        <p class="card-value">{{ stats.applicants.toLocaleString() }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    stats: {
      type: Object,
      required: true,
      default: () => ({
        learners: 0,
        mentors: 0,
        applicants: 0
      })
    }
  }
}
</script>

<style scoped>
.dashboard-cards {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
  z-index: 10;
  position: relative;
}

.dashboard-card {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
  padding: 2rem;
  width: 280px;
  height: 280px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.dashboard-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px -5px rgba(0, 0, 0, 0.15);
}

.card-text {
  margin-bottom: 1.5rem;
}

.card-title {
  font-size: 1.25rem;
  color: #384869;
  margin: 0 0 1rem 0;
  font-weight: 500;
  text-align: center;
}

.card-divider {
  border: 0;
  height: 4px;
  background: linear-gradient(to right, transparent, rgba(59, 154, 169, 0.5), transparent);
  margin: 0.5rem 0;
}

.card-number-container {
  position: relative;
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-icon {
  position: absolute;
  font-size: 8rem;
  color: rgba(59, 154, 169, 0.2);
  z-index: 0;
}

.card-value {
  font-size: 3.5rem;
  font-weight: 700;
  color: #0b2548;
  margin: 0;
  line-height: 1;
  position: relative;
  z-index: 1;
}


</style>