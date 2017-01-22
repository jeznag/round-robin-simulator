const INITIAL_LEAD_COUNT = 200;

document.querySelector('#simulateStart').addEventListener('click', () => {
  const resultBody = document.querySelector('#results tbody');
  resultBody.innerHTML = '';
  const startPercentages = getDataFromForm(getStartPercentage);
  const currentAssignments = convertPercentagesToNumbers(startPercentages, INITIAL_LEAD_COUNT);
  const targetPercentages = getDataFromForm(getTargetPercentage);
  const numCycles = document.querySelector('#numRounds').value;
  const bottomOfTable = document.querySelector('#bottomOfTable');
  let cycleNumber = 0;
  const addResultsInterval = setInterval(() => {
    const currentLeadCounts = getLeadCountFromAssignments(currentAssignments);
    const nextAssignee = getNextAssignee(currentLeadCounts, targetPercentages, cycleNumber, currentAssignments.length);
    if (currentAssignments.length > INITIAL_LEAD_COUNT) {
      const firstAssignee = currentAssignments.shift();
      if (currentLeadCounts[firstAssignee] > 0) {
        currentLeadCounts[firstAssignee] -= 1;
      }
    }
    currentAssignments.push(nextAssignee);
    currentLeadCounts[nextAssignee] += 1;
    addResultToDOM(cycleNumber, nextAssignee, currentLeadCounts, resultBody, INITIAL_LEAD_COUNT);
    cycleNumber += 1;

    bottomOfTable.scrollIntoView();

    if (cycleNumber >= numCycles) {
      clearInterval(addResultsInterval);
    }
  }, 25);
});

function addResultToDOM(cycleNumber, nextAssignee, currentLeadCounts, resultBody, totalLeads) {
  const leadCountData = Object.keys(currentLeadCounts).map((assignee, index) => {
    const leadCount = currentLeadCounts[assignee];
    const percentage = (leadCount / totalLeads * 100).toFixed(2);
    return `<td>${leadCount} leads (${percentage}%)</td>`;
  }).join(' ');
  const newRow = document.createElement('tr');
  newRow.classList.add('resultRow');
  newRow.classList.add(`assignee-${nextAssignee}`);
  newRow.innerHTML = `<td>${cycleNumber + 1}</td><td>Person ${nextAssignee}</td>${leadCountData}`;
  resultBody.appendChild(newRow);
}

function convertPercentagesToNumbers(percentages, totalLeads) {
  const leadCount = percentages.map((percentage) => percentage / 100 * totalLeads);
  const leadAssignments = [];
  leadCount.forEach(numLeads => {
    for (let i = 0; i < numLeads; i++) {
      leadAssignments.push(i + 1);
    }
  });

  return leadAssignments;
}

function getNextAssignee(currentLeadCounts, targetPercentages, leadNumber, totalLeads) {
  let nextAssignee = 1;
  let biggestDifference = 0;

  Object.keys(currentLeadCounts).forEach((assignee, index) => {
    const difference = (targetPercentages[index] / 100 * totalLeads) - currentLeadCounts[assignee];
    if (difference > biggestDifference) {
      nextAssignee = index + 1;
      biggestDifference = difference;
    }
  });

  return nextAssignee;
}

function getLeadCountFromAssignments(currentLeadAssignments) {
  let leadsForOtherPeople = (INITIAL_LEAD_COUNT - currentLeadAssignments.length);
  if (leadsForOtherPeople < 0) {
    leadsForOtherPeople = 0;
  }
  return currentLeadAssignments.reduce((totals, assignee, index) => {
    totals[assignee] += 1;
    return totals;
  }, {
    1: 0,
    2: 0,
    3: 0,
    others: leadsForOtherPeople
  });
}

function getDataFromForm(func) {
  const result = [];
  for (let i = 0; i < 3; i++) {
    result.push(func(i + 1));
  }
  return result;
}

function getStartPercentage(personNumber) {
  return document.querySelector(`#person${personNumber}startPercentage`).value;
}

function getTargetPercentage(personNumber) {
  return document.querySelector(`#person${personNumber}targetPercentage`).value;
}
