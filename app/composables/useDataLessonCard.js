export const useDataLessonCard = () => {
const dataLessonCardsBuitin = [
  {
    lessonNumber: 1,
    lessonName: "Introduction to Daily Life",
    numberNewWords: 8,
    numberLingQs: 9,
    numberKnownWords: 10,
    newWordsPercents: 12,
    imgUrl: "/images/lesson.png",
    builtinLesson: true
  },
  {
    lessonNumber: 2,
    lessonName: "Talking About Hobbies",
    numberNewWords: 12,
    numberLingQs: 7,
    numberKnownWords: 18,
    newWordsPercents: 15,
    imgUrl: "/images/lesson.png",
    builtinLesson: true
  },
  {
    lessonNumber: 3,
    lessonName: "Work and Studies",
    numberNewWords: 6,
    numberLingQs: 5,
    numberKnownWords: 22,
    newWordsPercents: 9,
    imgUrl: "/images/lesson.png",
    builtinLesson: true
  },
  {
    lessonNumber: 4,
    lessonName: "Daily Routine",
    numberNewWords: 10,
    numberLingQs: 11,
    numberKnownWords: 14,
    newWordsPercents: 18,
    imgUrl: "/images/lesson.png",
    builtinLesson: true
  },
  {
    lessonNumber: 5,
    lessonName: "Food and Cooking",
    numberNewWords: 14,
    numberLingQs: 10,
    numberKnownWords: 20,
    newWordsPercents: 21,
    imgUrl: "/images/lesson.png",
    builtinLesson: true
  },
  {
    lessonNumber: 6,
    lessonName: "Health and Exercise",
    numberNewWords: 9,
    numberLingQs: 8,
    numberKnownWords: 25,
    newWordsPercents: 11,
    imgUrl: "/images/lesson.png",
    builtinLesson: true
  },
  {
    lessonNumber: 7,
    lessonName: "Technology in Life",
    numberNewWords: 16,
    numberLingQs: 13,
    numberKnownWords: 30,
    newWordsPercents: 24,
    imgUrl: "/images/lesson.png",
    builtinLesson: true
  },
  {
    lessonNumber: 8,
    lessonName: "Travel Experiences",
    numberNewWords: 11,
    numberLingQs: 9,
    numberKnownWords: 28,
    newWordsPercents: 17,
    imgUrl: "/images/lesson.png",
    builtinLesson: true
  },
  {
    lessonNumber: 9,
    lessonName: "Culture and Traditions",
    numberNewWords: 13,
    numberLingQs: 12,
    numberKnownWords: 26,
    newWordsPercents: 19,
    imgUrl: "/images/lesson.png",
    builtinLesson: true
  },
  {
    lessonNumber: 10,
    lessonName: "Family and Relationships",
    numberNewWords: 7,
    numberLingQs: 6,
    numberKnownWords: 32,
    newWordsPercents: 8,
    imgUrl: "/images/lesson.png",
    builtinLesson: true
  }
];

const dataCourseCardsBuiltin = [
  {
    numberLessons: 1,
    courseName: "Introduction to Daily Life",
    numberNewWords: 8,
    numberLingQs: 9,
    numberKnownWords: 10,
    newWordsPercents: 12,
    imgUrl: "/images/course.png"
  },
  {
    numberLessons: 2,
    courseName: "Talking About Hobbies",
    numberNewWords: 12,
    numberLingQs: 7,
    numberKnownWords: 18,
    newWordsPercents: 15,
    imgUrl: "/images/course.png"
  },
  {
    numberLessons: 3,
    courseName: "Work and Studies",
    numberNewWords: 6,
    numberLingQs: 5,
    numberKnownWords: 22,
    newWordsPercents: 9,
    imgUrl: "/images/course.png"
  },
  {
    numberLessons: 4,
    courseName: "Daily Routine",
    numberNewWords: 10,
    numberLingQs: 11,
    numberKnownWords: 14,
    newWordsPercents: 18,
    imgUrl: "/images/course.png"
  },
  {
    numberLessons: 5,
    courseName: "Food and Cooking",
    numberNewWords: 14,
    numberLingQs: 10,
    numberKnownWords: 20,
    newWordsPercents: 21,
    imgUrl: "/images/course.png"
  },
  {
    numberLessons: 6,
    courseName: "Health and Exercise",
    numberNewWords: 9,
    numberLingQs: 8,
    numberKnownWords: 25,
    newWordsPercents: 11,
    imgUrl: "/images/course.png"
  },
  {
    numberLessons: 7,
    courseName: "Technology in Life",
    numberNewWords: 16,
    numberLingQs: 13,
    numberKnownWords: 30,
    newWordsPercents: 24,
    imgUrl: "/images/course.png"
  },
  {
    numberLessons: 8,
    courseName: "Travel Experiences",
    numberNewWords: 11,
    numberLingQs: 9,
    numberKnownWords: 28,
    newWordsPercents: 17,
    imgUrl: "/images/course.png"
  },
  {
    numberLessons: 9,
    courseName: "Culture and Traditions",
    numberNewWords: 13,
    numberLingQs: 12,
    numberKnownWords: 26,
    newWordsPercents: 19,
    imgUrl: "/images/course.png"
  },
  {
    numberLessons: 10,
    courseName: "Family and Relationships",
    numberNewWords: 7,
    numberLingQs: 6,
    numberKnownWords: 32,
    newWordsPercents: 8,
    imgUrl: "/images/course.png"
  }
];
   
const dataLessonCardsDemo = [
  {
    imgUrl: '/images/lesson.png',
    courseName: "IELTS Speaking Part 2 Strategies",
    lessonNumber: 9,
    lessonName: "Improving Fluency and Coherence",
    numberNewWords: 152,
    numberLingQs: 0,
    numberKnownWords: 152,
    newWordsPercents: 100
  },
  {
    imgUrl: '/images/lesson.png',
    courseName: "IELTS Speaking Part 2 Strategies",
    lessonNumber: 8,
    lessonName: "Using Examples in Answers",
    numberNewWords: 22,
    numberLingQs: 0,
    numberKnownWords: 22,
    newWordsPercents: 100
  },
  {
    imgUrl: '/images/lesson.png',
    courseName: "IELTS Speaking Part 1 Mastery",
    lessonNumber: 1,
    lessonName: "Introduction to Daily Conversation",
    numberNewWords: 29,
    numberLingQs: 12,
    numberKnownWords: 37,
    newWordsPercents: 62
  },
  {
    imgUrl: '/images/lesson.png',
    courseName: "IELTS Speaking Part 2 Strategies",
    lessonNumber: 10,
    lessonName: "Common Grammar Mistakes in Speaking",
    numberNewWords: 40,
    numberLingQs: 7,
    numberKnownWords: 45,
    newWordsPercents: 79
  },
  {
    imgUrl: '/images/lesson.png',
    courseName: "IELTS Speaking Part 2 Strategies",
    lessonNumber: 7,
    lessonName: "Handling Abstract Questions",
    numberNewWords: 50,
    numberLingQs: 7,
    numberKnownWords: 56,
    newWordsPercents: 79
  },
  {
    imgUrl: '/images/lesson.png',
    courseName: "IELTS Speaking Part 2 Strategies",
    lessonNumber: 6,
    lessonName: "Future Plans and Ambitions",
    numberNewWords: 29,
    numberLingQs: 12,
    numberKnownWords: 37,
    newWordsPercents: 62
  },
  {
    imgUrl: '/images/lesson.png',
    courseName: "IELTS Speaking Part 2 Strategies",
    lessonNumber: 5,
    lessonName: "Talking About Past Experiences",
    numberNewWords: 40,
    numberLingQs: 7,
    numberKnownWords: 45,
    newWordsPercents: 79
  },
  {
    imgUrl: '/images/lesson.png',
    courseName: "IELTS Speaking Part 2 Strategies",
    lessonNumber: 4,
    lessonName: "Expressing Opinions Clearly",
    numberNewWords: 152,
    numberLingQs: 0,
    numberKnownWords: 152,
    newWordsPercents: 100
  },
  {
    imgUrl: '/images/lesson.png',
    courseName: "IELTS Speaking Part 2 Strategies",
    lessonNumber: 3,
    lessonName: "Describing People and Places",
    numberNewWords: 22,
    numberLingQs: 0,
    numberKnownWords: 22,
    newWordsPercents: 100
  },
  {
    imgUrl: '/images/lesson.png',
    courseName: "IELTS Speaking Part 2 Strategies",
    lessonNumber: 2,
    lessonName: "Common IELTS Speaking Topics",
    numberNewWords: 50,
    numberLingQs: 7,
    numberKnownWords: 56,
    newWordsPercents: 79
  },
  {
    imgUrl: '/images/lesson.png',
    courseName: "IELTS Speaking Part 2 Strategies",
    lessonNumber: 1,
    lessonName: "Introduction to Daily Conversation",
    numberNewWords: 29,
    numberLingQs: 12,
    numberKnownWords: 37,
    newWordsPercents: 62
  },
  {
    imgUrl: '/images/lesson.png',
    courseName: "IELTS Speaking Part 1 Mastery",
    lessonNumber: 10,
    lessonName: "Common Grammar Mistakes in Speaking",
    numberNewWords: 40,
    numberLingQs: 7,
    numberKnownWords: 45,
    newWordsPercents: 79
  },
  {
    imgUrl: '/images/lesson.png',
    courseName: "IELTS Speaking Part 1 Mastery",
    lessonNumber: 9,
    lessonName: "Improving Fluency and Coherence",
    numberNewWords: 152,
    numberLingQs: 0,
    numberKnownWords: 152,
    newWordsPercents: 100
  },
  {
    imgUrl: '/images/lesson.png',
    courseName: "IELTS Speaking Part 1 Mastery",
    lessonNumber: 8,
    lessonName: "Using Examples in Answers",
    numberNewWords: 22,
    numberLingQs: 0,
    numberKnownWords: 22,
    newWordsPercents: 100
  },
  {
    imgUrl: '/images/lesson.png',
    courseName: "IELTS Speaking Part 1 Mastery",
    lessonNumber: 7,
    lessonName: "Handling Abstract Questions",
    numberNewWords: 50,
    numberLingQs: 7,
    numberKnownWords: 56,
    newWordsPercents: 79
  },
  {
    imgUrl: '/images/lesson.png',
    courseName: "IELTS Speaking Part 1 Mastery",
    lessonNumber: 6,
    lessonName: "Future Plans and Ambitions",
    numberNewWords: 29,
    numberLingQs: 12,
    numberKnownWords: 37,
    newWordsPercents: 62
  },
  {
    imgUrl: '/images/lesson.png',
    courseName: "IELTS Speaking Part 1 Mastery",
    lessonNumber: 5,
    lessonName: "Talking About Past Experiences",
    numberNewWords: 40,
    numberLingQs: 7,
    numberKnownWords: 45,
    newWordsPercents: 79
  },
  {
    imgUrl: '/images/lesson.png',
    courseName: "IELTS Speaking Part 1 Mastery",
    lessonNumber: 4,
    lessonName: "Expressing Opinions Clearly",
    numberNewWords: 152,
    numberLingQs: 0,
    numberKnownWords: 152,
    newWordsPercents: 100
  },
  {
    imgUrl: '/images/lesson.png',
    courseName: "IELTS Speaking Part 1 Mastery",
    lessonNumber: 3,
    lessonName: "Describing People and Places",
    numberNewWords: 22,
    numberLingQs: 0,
    numberKnownWords: 22,
    newWordsPercents: 100
  },
  {
    imgUrl: '/images/lesson.png',
    courseName: "IELTS Speaking Part 1 Mastery",
    lessonNumber: 2,
    lessonName: "Common IELTS Speaking Topics",
    numberNewWords: 50,
    numberLingQs: 7,
    numberKnownWords: 56,
    newWordsPercents: 79
  }
]

  
   const  dataCourseCardsDemo =[
        {
            "imgUrl": '/images/course.jpg',
            "numberLessons": 10,
            "courseName": "IELTS Speaking Part 2 Strategies",
            "numberNewWords": 217,
            "numberLingQs": 12,
            "numberKnownWords": 225,
            "newWordsPercents": 93
        },
        {
            "imgUrl": '/images/course.jpg',
            "numberLessons": 10,
            "courseName": "IELTS Speaking Part 1 Mastery",
            "numberNewWords": 217,
            "numberLingQs": 12,
            "numberKnownWords": 225,
            "newWordsPercents": 93
        },
        {
            "imgUrl": '/images/course.jpg',
            "numberLessons": 10,
            "courseName": "IELTS Speaking Foundations",
            "numberNewWords": 217,
            "numberLingQs": 12,
            "numberKnownWords": 225,
            "newWordsPercents": 93
        }
]

    return {
        dataLessonCardsBuitin,
        dataCourseCardsBuiltin,
        dataLessonCardsDemo,
        dataCourseCardsDemo
    }
}