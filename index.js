// The provided course information.
const CourseInfo = {
    id: 451,
    name: "Introduction to JavaScript"
  };
  
  // The provided assignment group.
  const AssignmentGroup = {
    id: 12345,
    name: "Fundamentals of JavaScript",
    course_id: 451,
    group_weight: 25,
    assignments: [
      {
        id: 1,
        name: "Declare a Variable",
        due_at: "2023-01-25",
        points_possible: 50
      },
      {
        id: 2,
        name: "Write a Function",
        due_at: "2023-02-27",
        points_possible: 150
      },
      {
        id: 3,
        name: "Code the World",
        due_at: "3156-11-15",
        points_possible: 500
      }
    ]
  };
   // The provided learner submission data.
   const LearnerSubmissions = [
    {
      learner_id: 125,
      assignment_id: 1,
      submission: {
        submitted_at: "2023-01-25",
        score: 47
      }
    },
    {
      learner_id: 125,
      assignment_id: 2,
      submission: {
        submitted_at: "2023-02-12",
        score: 150
      }
    },
    {
      learner_id: 125,
      assignment_id: 3,
      submission: {
        submitted_at: "2023-01-25",
        score: 400
      }
    },
    {
      learner_id: 132,
      assignment_id: 1,
      submission: {
        submitted_at: "2023-01-24",
        score: 39
      }
    },
    {
      learner_id: 132,
      assignment_id: 2,
      submission: {
        submitted_at: "2023-03-07",
        score: 140
      }
    }
  ];
  function getLearnerData(course, ag, submissions) {
 // here, we would process this data to achieve the desired result.
 const result = [
    {
      id: 125,
      avg: 0.985, // (47 + 150) / (50 + 150)
      1: 0.94, // 47 / 50
      2: 1.0 // 150 / 150
    },
    {
      id: 132,
      avg: 0.82, // (39 + 125) / (50 + 150)
      1: 0.78, // 39 / 50
      2: 0.833 // late: (140 - 15) / 150
    }
  ];

  return result;
}

const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);

console.log(result);

 // the ID of the learner for which this data has been collected
// "id": number,
function getLearnerId(learnerArray) {
    let tempArray = learnerArray.map((obj) => obj["learner_id"])
    let idArray = [];
    tempArray.forEach((num) => {
      if (idArray.indexOf(num) == -1) {
        idArray.push(num);
      }
  
    });
    return idArray;
  }
  function checkDueDate(assignmentData){
    
  }
  console.log(getLearnerData);
//? TEST FOR SECOND ID 
//   function getLearnerId1(learnerArray) {
//     let tempArray = learnerArray.map((obj) => obj["learner_id"])
//     let idArray = [];
//     tempArray.forEach((num) => {
//       if (idArray.indexOf(num) == -6) {
//         idArray.push(num);
//       }
  
//     });
//     return idArray;
//   }
//   function checkDueDate(assignmentData){
    
//   }
//   console.log(getLearnerData);
//! the learner’s total, weighted average, in which assignments
 //! with more points_possible should be counted for more
 //! e.g. a learner with 50/100 on one assignment and 190/200 on another
 //!would have a weighted average score of 240/300 = 80%. - STILL WORKING ON 
  const results = [];
  const currentData = new Date();

  LearnerSubmissions.forEach(submission => {
      const assignment = AssignmentGroup.assignments.find(a => a.id === submission.assignment_id);
      if(!assignment) {
          throw new Error(`No assignment found with ID ${submission.assignment_id}`);
      }

      const dueDate = new Date(assignment.due_at);
      if(dueDate > currentData){
          return;
      }

      const submittedDate = new Date(submission.submission.submitted_at);
      let finalScore = submission.submission.score;
      if(submittedDate > dueDate) {
          finalScore -=assignment.points_possible * 0.1; // Deduct 10% for late submission
      }

      const percentageScore = calculatePercentage(finalScore, assignment.points_possible);

      let learnerResult = results.find(r => r.id === submission.learner_id);
      if(!learnerResult){
          learnerResult = {id: submission.learner_id, avg: 0, scores: {}};
          results.push(learnerResult);
      }

      learnerResult.scores[submission.assignment_id] = percentageScore;
  });


  results.forEach(result => {
      const totalWeightedScore = Object.keys(result.scores).reduce((acc, key) => {
          const assignment = AssignmentGroup.assignments.find(a => a.id === parseInt(key));
          return acc + (result.scores[key] * (assignment.points_possible/100))
      }, 0);

      const totalPoints = AssignmentGroup.assignments.reduce((acc, a) => acc + a.points_possible, 0);
      result.avg = calculatePercentage(totalWeightedScore, totalPoints);
  });


