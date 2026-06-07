<template>
  <div class=" max-w-lg border mx-auto flex items-center justify-center">
      <div class="relative flex">
        <div class="flex">
          <span>Courses</span>
          <button>{{}}</button>
        </div>
        <div>
          <span>Lessons</span>
          <button>{{}}</button>
        </div>
      </div>

      <!-- Popup UI -->
      <div class="absolute">
        <input type="text">
        <button>
          
        </button>
      </div>


  </div>
</template>


<script setup>

const listLessonNames = [
  "Introduction to English",
  "Daily Conversations",
  "Travel Vocabulary",
  "Ordering Food",
  "At the Airport",
  "Shopping Basics",
  "Making Friends",
  "Work and Career",
  "Health and Fitness",
  "Technology Today"
]

const listCourseNames = [
  "English Beginner Course",
  "English Intermediate Course",
  "French for Travelers",
  "French Conversation Practice",
  "Chinese Beginner Course",
  "Chinese Listening Training",
  "Business English",
  "Everyday Vocabulary Builder",
  "Grammar Mastery Program",
  "Advanced Speaking Skills"
]
</script>