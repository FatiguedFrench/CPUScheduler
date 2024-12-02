const TableElement = document.getElementById("Table")

// Arrays
var ProcessiSimulati = new Array()
var ActionHistory = new Array()
const ToSimulate = new Array()
const Returned = new Array()
var JCB = new Array()
var PCB = new Array()

// Events
const ProgramAdmittedEvent = new CustomEvent("ProgramAdmitted", { task: undefined })
const TaskUpdatedEvent = new CustomEvent("TaskUpdated", { task: undefined })
const TaskReturnEvent = new CustomEvent("TaskReturned", { task: undefined })
const SimulationResetEvent = new Event("SimulationReset")
const ClockAdvanceEvent = new Event("ClockAdvance")
const ReadyEvent = new Event("SimulationReady")
const NewTaskEvent = new Event("TaskCreated")

// Variables
let clockTime = 0
let targetTask = undefined // If a task is undefined, it returned
let lastTaskExecuted = undefined
let processNumber = 0

// Proprieties of the Simulation
const RoundRobinBurstWindow = 3
const ContextSwitchTime = 0

class Process {
	constructor(ArrivalTime, BurstTime, Priority) {
		this.contextSwitch = ContextSwitchTime
		this.arrival = ArrivalTime || 0
		this.priority = Priority || 1
		this.burst = BurstTime || 0
		this.number = processNumber++
		
		this.turnArround = 0
		this.streak = 0
		this.wait = 0

		ToSimulate.push(this)
		window.dispatchEvent(NewTaskEvent)
	}
}

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