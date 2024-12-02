var ProcessiSimulati = new Array()
const TableElement = document.getElementById("Table")

class Rappresentazione {
	admit() { this.target.style.opacity = `100%` }
	return() { this.target.style.opacity = `50%` }

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

		this.target = Element
		this.wait = WaitNumber
		this.burst = BurstNumber
		this.arival = ArivalNumber

		ProcessiSimulati.push(this)
	}
}

function addProcessToTable() {

}

function remProcessFromTable() {

}

function admitionEvent(Event) {
	ProcessiSimulati[Event.task.number].admit()
}

function updateEvent(Event) {
	const Target = ProcessiSimulati[Event.task.number]

	Target.burst.innerText = Event.task.burst
	Target.wait.innerText = Event.task.wait
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
window.addEventListener("TaskUpdated", updateEvent)