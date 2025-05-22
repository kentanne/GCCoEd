<template>
  <div class="dashboard-cards-container">
    <div class="dashboard-cards">
      <div class="dashboard-card learners">
        <div class="card-bg-pattern"></div>
        <div class="card-content">
          <div class="card-header">
            <div class="card-icon-wrapper">
              <i class="card-icon fas fa-users"></i>
            </div>
            <h3 class="card-title">Total Learners</h3>
          </div>
          <p class="card-value">{{ stats.learners.toLocaleString() }}</p>
          <div class="card-footer"> 
            <button class="card-action">View Details</button>
          </div>
        </div>
      </div>
      
      <div class="dashboard-card mentors">
        <div class="card-bg-pattern"></div>
        <div class="card-content">
          <div class="card-header">
            <div class="card-icon-wrapper">
              <i class="card-icon fas fa-chalkboard-teacher"></i>
            </div>
            <h3 class="card-title">Total Mentors</h3>
          </div>
          <p class="card-value">{{ stats.mentors.toLocaleString() }}</p>
          <div class="card-footer">
            <button class="card-action">View Details</button>
          </div>
        </div>
      </div>
      
      <div class="dashboard-card applicants">
        <div class="card-bg-pattern"></div>
        <div class="card-content">
          <div class="card-header">
            <div class="card-icon-wrapper">
              <i class="card-icon fas fa-file-alt"></i>
            </div>
            <h3 class="card-title">Total Applicants</h3>
          </div>
          <p class="card-value">{{ stats.applicants.toLocaleString() }}</p>
          <div class="card-footer">
            <button class="card-action">View Details</button>
          </div>
        </div>
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
.dashboard-cards-container {
  padding: 2rem;
  width: 100%;
  height: calc(100vh - 80px); 
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: -5rem;
}

.dashboard-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  width: 100%;
  max-width: 1400px;
}

.dashboard-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(11, 28, 59, 0.35);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  height: 320px;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.card-bg-pattern {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(67, 97, 238, 0.03) 0%, rgba(255,255,255,0) 100%);
  opacity: 0.5;
}

.learners .card-bg-pattern {
  background: linear-gradient(135deg, rgba(67, 97, 238, 0.05) 0%, rgba(255,255,255,0) 100%);
}
.mentors .card-bg-pattern {
  background: linear-gradient(135deg, rgba(114, 9, 183, 0.05) 0%, rgba(255,255,255,0) 100%);
}
.applicants .card-bg-pattern {
  background: linear-gradient(135deg, rgba(58, 12, 163, 0.05) 0%, rgba(255,255,255,0) 100%);
}

.dashboard-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.12);
}

.card-content {
  padding: 2rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 2;
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.card-icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
}

.learners .card-icon-wrapper {
  background-color: rgba(67, 97, 238, 0.1);
}
.mentors .card-icon-wrapper {
  background-color: rgba(114, 9, 183, 0.1);
}
.applicants .card-icon-wrapper {
  background-color: rgba(58, 12, 163, 0.1);
}

.card-icon {
  font-size: 1.5rem;
}

.learners .card-icon {
  color: #4361ee;
}
.mentors .card-icon {
  color: #7209b7;
}
.applicants .card-icon {
  color: #3a0ca3;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--text-light);
  margin: 0;
}

.card-value {
  font-size: 3.5rem;
  font-weight: 700;
  color: var(--text);
  margin: 1.5rem 0;
  line-height: 1;
  flex-grow: 1;
  display: flex;
  align-items: center;
}

.card-footer {
  margin-top: auto;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: center;
    align-items: center;
}


.card-action {
  background: rgba(0, 0, 0, 0.03);
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-light);
  cursor: pointer;
  transition: all 0.2s ease;

}

.card-action:hover {
  background: rgba(0, 0, 0, 0.05);
  color: var(--text);
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .dashboard-cards {
    grid-template-columns: 1fr;
    max-width: 600px;
  }
  
  .dashboard-card {
    height: 240px;
  }
  
  .card-value {
    font-size: 3rem;
  }
}

@media (max-width: 768px) {
  .dashboard-cards-container {
    padding: 1.5rem;
  }
  
  .card-content {
    padding: 1.5rem;
  }
  
  .card-value {
    font-size: 2.5rem;
  }
}
</style>