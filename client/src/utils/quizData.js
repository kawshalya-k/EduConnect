export const quizData = {
  "python development": [
    {
      question: "Which of the following data types is immutable in Python?",
      options: ["List", "Dictionary", "Tuple", "Set"],
      answer: 2
    },
    {
      question: "What is the output of `print(2 ** 3)`?",
      options: ["6", "8", "9", "Error"],
      answer: 1
    },
    {
      question: "Which keyword is used to create a function in Python?",
      options: ["func", "define", "def", "function"],
      answer: 2
    },
    {
      question: "What does the `__init__` method do in a Python class?",
      options: ["Deletes an object", "Initializes the object's attributes", "Inherits from a superclass", "Returns a string representation"],
      answer: 1
    }
  ],
  "ux design & research": [
    {
      question: "What is the primary goal of wireframing in UX design?",
      options: ["Adding colors and typography", "Creating the final code structure", "Outlining the structural layout and flow", "Designing animations"],
      answer: 2
    },
    {
      question: "Which research method is best for observing how users interact with a product in real-time?",
      options: ["A/B Testing", "Surveys", "Usability Testing", "Card Sorting"],
      answer: 2
    },
    {
      question: "What does a 'Persona' represent in UX research?",
      options: ["The lead developer", "An archetypical user representing a larger group", "A marketing strategy", "The client's CEO"],
      answer: 1
    },
    {
      question: "Which principle states that objects physically close to each other are perceived as part of the same group?",
      options: ["Law of Proximity", "Law of Similarity", "Fitts's Law", "Hick's Law"],
      answer: 0
    }
  ],
  "data science": [
    {
      question: "Which algorithm is commonly used for classification problems?",
      options: ["Linear Regression", "K-Means Clustering", "Logistic Regression", "Principal Component Analysis"],
      answer: 2
    },
    {
      question: "What does 'Overfitting' mean in machine learning?",
      options: ["The model performs well on training data but poorly on unseen data", "The model performs poorly on both training and test data", "The model is too simple to capture the underlying pattern", "The data has too many missing values"],
      answer: 0
    },
    {
      question: "Which Python library is primarily used for data manipulation and analysis?",
      options: ["Matplotlib", "Pandas", "Flask", "TensorFlow"],
      answer: 1
    },
    {
      question: "What is a common metric to evaluate a regression model?",
      options: ["F1-Score", "Accuracy", "Mean Squared Error (MSE)", "Precision"],
      answer: 2
    }
  ],
  "digital marketing": [
    {
      question: "What does SEO stand for?",
      options: ["Search Engine Optimization", "Social Engagement Operations", "Sales Effectiveness Objectives", "System Error Output"],
      answer: 0
    },
    {
      question: "Which metric calculates the percentage of visitors who leave a website after viewing only one page?",
      options: ["Conversion Rate", "Click-Through Rate", "Bounce Rate", "Retention Rate"],
      answer: 2
    },
    {
      question: "What is A/B testing in digital marketing?",
      options: ["Testing two different budgets for an ad", "Comparing two versions of a webpage or ad to see which performs better", "Running ads on two different social networks", "Testing a campaign in two different countries"],
      answer: 1
    },
    {
      question: "Which social media platform is primarily known for B2B (Business-to-Business) marketing?",
      options: ["TikTok", "Instagram", "LinkedIn", "Snapchat"],
      answer: 2
    }
  ],
  "public speaking": [
    {
      question: "What is the 'Rule of Three' in public speaking?",
      options: ["Always speak for exactly three minutes", "Use three microphones for better audio", "Group ideas or items in threes to make them more memorable", "Have three backup presentations"],
      answer: 2
    },
    {
      question: "Which of the following is an effective way to handle a mistake during a speech?",
      options: ["Apologize profusely and restart", "Run off the stage", "Ignore it completely or make a brief, lighthearted correction and move on", "Blame the AV equipment"],
      answer: 2
    },
    {
      question: "What is the primary purpose of an 'hook' at the beginning of a presentation?",
      options: ["To summarize the entire speech", "To introduce the speaker's biography", "To capture the audience's attention immediately", "To thank the organizers"],
      answer: 2
    },
    {
      question: "How should a speaker utilize body language?",
      options: ["Stand perfectly still to show authority", "Pace rapidly back and forth", "Use purposeful gestures and maintain eye contact", "Look at their notes constantly"],
      answer: 2
    }
  ],
  "default": [
    {
      question: "Which of these describes the best approach to mentoring?",
      options: ["Solving all problems for the learner", "Guiding the learner to discover the answers themselves", "Assigning grades based on strict memorization", "Focusing entirely on theoretical concepts without practice"],
      answer: 1
    },
    {
      question: "How should you handle a situation where you don't know the answer to a learner's question?",
      options: ["Make up an answer to sound knowledgeable", "Ignore the question and move on", "Admit you don't know and offer to research it together", "Tell the learner it's not important"],
      answer: 2
    },
    {
      question: "What is constructive feedback?",
      options: ["Focusing only on what the learner did wrong", "Providing specific, actionable advice to help the learner improve", "Praising the learner regardless of the work quality", "Comparing the learner negatively to others"],
      answer: 1
    },
    {
      question: "Why is setting clear goals important at the start of a mentoring session?",
      options: ["To finish the session as quickly as possible", "To ensure both mentor and learner are aligned on what needs to be achieved", "To guarantee a perfect rating", "To prove the mentor is in charge"],
      answer: 1
    }
  ]
};

export const getQuizForSkill = (skillName) => {
  if (!skillName) return quizData.default;
  const normalized = skillName.toLowerCase().trim();
  return quizData[normalized] || quizData.default;
};
