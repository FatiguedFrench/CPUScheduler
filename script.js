function addTaskToTable(Event) {
	console.log(ToSimulate)
	const Process = ToSimulate.at(-1)

	new Rappresentazione(Process.number, Process.arrival, Process.burst)
}

function returnEvent(Event) {
	ProcessiSimulati[Event.task.number].return()
}

function admitionEvent(Event) {
	ProcessiSimulati[Event.task.number].admit()
}

function updateEvent(Event) {
	const Process = ProcessiSimulati[Event.task.number]

	if ( Process.burst.innerText != Event.task.burst || Process.wait.innerText != Event.task.wait ) {
		Process.name.classList.add("Highlight")
		setTimeout(() => { Process.name.classList.remove("Highlight") }, 1000)
	}

	if ( Process.burst.innerText != Event.task.burst ) {
		Process.burst.innerText = Event.task.burst
		Process.burst.classList.add("Highlight")
		setTimeout(() => { Process.burst.classList.remove("Highlight") }, 1000)
	} else if ( Process.wait.innerText != Event.task.wait ) {
		Process.wait.innerText = Event.task.wait
		Process.wait.classList.add("Highlight")
		setTimeout(() => { Process.wait.classList.remove("Highlight") }, 1000)
	}
}

function advanceEvent(Event) {}

function resetEvent(Event) {}

window.addEventListener("ProgramAdmitted", admitionEvent)
window.addEventListener("SimulationReset", resetEvent)
window.addEventListener("TaskCreated", addTaskToTable)
window.addEventListener("ClockAdvance", advanceEvent)
window.addEventListener("TaskReturned", returnEvent)
window.addEventListener("TaskUpdated", updateEvent)