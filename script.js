var ProcessiSimulati = new Array()
const TableElement = document.getElementById("Table")

class Rappresentazione {
	admit() { this.target.style.opacity = `100%` }
	return() {
		this.target.classList.add("Highlight")
		this.target.style.color = "orangered"
	}

	constructor(Numero, ArivalTime, BurstTime) {
		const Element = document.createElement("div")
		const ProcessName = document.createElement("p")
		const ArivalNumber = document.createElement("p")
		const BurstNumber = document.createElement("p")
		const WaitNumber = document.createElement("p")

		ProcessName.innerText = `Processo ${Numero}`
		ArivalNumber.innerText = ArivalTime
		BurstNumber.innerText = BurstTime
		WaitNumber.innerText = 0

		Element.append(ProcessName)
		Element.append(ArivalNumber)
		Element.append(BurstNumber)
		Element.append(WaitNumber)

		TableElement.append(Element)

		this.arival = ArivalNumber
		this.burst = BurstNumber
		this.name = ProcessName
		this.wait = WaitNumber
		this.target = Element

		ProcessiSimulati.push(this)
	}
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

function resetEvent(Event) {
	ProcessiSimulati = new Array()

	for (const Process of ToSimulate) {
		new Rappresentazione(Process.number, Process.arrival, Process.burst)
	}
}

window.addEventListener("ProgramAdmitted", admitionEvent)
window.addEventListener("SimulationReset", resetEvent)
window.addEventListener("ClockAdvance", advanceEvent)
window.addEventListener("TaskReturned", returnEvent)
window.addEventListener("TaskUpdated", updateEvent)