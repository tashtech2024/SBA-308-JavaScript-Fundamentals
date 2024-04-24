 //?the ID of the learner for which this data has been collected
// ?"id": number,
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

//! the learner’s total, weighted average, in which assignments
 //! with more points_possible should be counted for more
 //! e.g. a learner with 50/100 on one assignment and 190/200 on another
 //!would have a weighted average score of 240/300 = 80%. - STILL WORKING ON 

 function calculateWeightedAverage(assignments, submissions) {
  const validSubmissions = submissions.filter(sub => {
  const assignment = assignments.find(ass => ass.id === sub.assignment_id);
  return assignment && new Date(sub.submission.submitted_at) <= new Date(assignment.due_at);
  });
  //Deduct 10% for late submission of the student
const totalScore = validSubmissions.reduce((total, sub) => {
  const assignment = assignments.find(ass => ass.id === sub.assignment_id);
  const weight = assignment.points_possible;
  const lateSubmission = new Date(sub.submission.submitted_at) > new Date(assignment.due_at);
  const latePenalty = lateSubmission ? 0.1 : 0;
  return total + sub.submission.score / weight * (1 - latePenalty) * weight;
  }, 0);
//calcuates the weight average and avoid calculations when weight is zero
const totalWeight = validSubmissions.reduce((total, sub) => {
  const assignment = assignments.find(ass => ass.id === sub.assignment_id);
  return total + assignment.points_possible;
  }, 0);
  
  if (totalWeight === 0) return 0;
  return (totalScore / totalWeight) * 100;
  }
    // each assignment should have a key with its ID,
    // and the value associated with it should be the percentage that
    // the learner scored on the assignment (submission.score / points_possible)
// this  is used to otain the learner's data
function getLearnerData(courseInfo, assignmentGroup, learnerSubmissions) {
  const learnerData = learnerSubmissions.map(submission => {
    const assignments = assignmentGroup.assignments;
    const learnerAssignments = assignments.reduce((acc, assignment) => {
      if (new Date(assignment.due_at) <= new Date()) { // take assignments that are due
        const sub = learnerSubmissions.find(sub => sub.assignment_id === assignment.id);
        if (sub) {
          const lateSubmission = new Date(sub.submission.submitted_at) > new Date(assignment.due_at);
          const latePenalty = lateSubmission ? 0.1 : 0; // 10% for late submission
          acc[assignment.id] = sub.submission.score / assignment.points_possible * (1 - latePenalty);
        } else {
          acc[assignment.id] = 0; // assignment score
        }
      }
      return acc;
    }, {});
    const weightedAverage = calculateWeightedAverage(assignments, learnerSubmissions);
    return {
      id: submission.learner_id,
      avg: weightedAverage,
      ...learnerAssignments
    };
  });

  return learnerData;
}

  // if an assignment is not yet due, it should not be included in either
    // the average or the keyed dictionary of scores
    const courseInfo = { id: 1, name: 'JavaScript Fundamentals' };
const assignmentGroup  = {
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

const result = getLearnerData(courseInfo, assignmentGroup, LearnerSubmissions);
console.log(result);