const INITIAL_LEAD_COUNT = 200;

document.querySelector('#simulateStart').addEventListener('click', () => {
  const resultBody = document.querySelector('#results tbody');
  resultBody.innerHTML = '';
  const startPercentages = getDataFromForm(getStartPercentage);
  const currentLeadCounts = convertPercentagesToNumbers(startPercentages, INITIAL_LEAD_COUNT);
  const targetPercentages = getDataFromForm(getTargetPercentage);
  const targetLeadCounts = convertPercentagesToNumbers(targetPercentages, INITIAL_LEAD_COUNT);
  const numCycles = document.querySelector('#numRounds').value;
  const bottomOfTable = document.querySelector('#bottomOfTable');
  let cycleNumber = 0;
  const addResultsInterval = setInterval(() => {
    const nextAssignee = getNextAssignee(currentLeadCounts, targetPercentages, cycleNumber);
    currentLeadCounts[nextAssignee - 1] += 1;
    addResultToDOM(cycleNumber, nextAssignee, currentLeadCounts, resultBody);
    cycleNumber += 1;

    bottomOfTable.scrollIntoView();

    if (cycleNumber >= numCycles) {
      clearInterval(addResultsInterval);
    }
  }, 25);
});

function addResultToDOM(cycleNumber, nextAssignee, currentLeadCounts, resultBody) {
  const totalLeads = INITIAL_LEAD_COUNT + cycleNumber + 1;
  const leadCountData = currentLeadCounts.map((leadCount, index) => {
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
  return percentages.map((percentage) => percentage / 100 * totalLeads);
}

function getNextAssignee(currentLeadCounts, targetPercentages, leadNumber) {
  const totalLeads = INITIAL_LEAD_COUNT + leadNumber;
  let nextAssignee = 1;
  let biggestDifference = 0;

  currentLeadCounts.forEach((currentLeadCount, index) => {
    const difference = (targetPercentages[index] / 100 * totalLeads) - currentLeadCount;
    if (difference > biggestDifference) {
      nextAssignee = index + 1;
      biggestDifference = difference;
    }
  });

  return nextAssignee;
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
