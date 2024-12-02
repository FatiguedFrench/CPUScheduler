// Arrays
const ActionHistory = new Array()
const ToSimulate = new Array()
const Returned = new Array()
var JCB = new Array()
var PCB = new Array()

// Events
const ProgramAdmittedEvent = new CustomEvent("ProgramAdmitted", { task: undefined })
const TaskUpdatedEvent = new CustomEvent("TaskUpdated", { task: undefined })
const SimulationResetEvent = new Event("SimulationReset")
const ClockAdvanceEvent = new Event("ClockAdvance")
const ReadyEvent = new Event("SimulationReady")

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
	}
}

function CPU(TaskToProcess) {
	/* The CPU function simulates, duh, a CPU: a task is passed
	as the only paramenter, and it gets advanced through time */
	
	if (TaskToProcess == undefined) return
	else if (lastTaskExecuted != TaskToProcess) {
		TaskToProcess.contextSwitch = ContextSwitchTime
		lastTaskExecuted = TaskToProcess
		TaskToProcess.streak = 0
	}

	if (TaskToProcess.contextSwitch <= 0) {
		--TaskToProcess.burst
		TaskToProcess.streak++
		if (TaskToProcess.burst <= 0) returnTask(TaskToProcess)
	} else --TaskToProcess.contextSwitch

	TaskUpdatedEvent.task = TaskToProcess
	window.dispatchEvent(TaskUpdatedEvent)

	updateWait(TaskToProcess)
}

function updateWait(LastTaskExecuted) {
	/* Used to update the wait of all tasks in the
	Ready Queue but the one that has been executed */

	PCB.forEach( (value) => {
		if (value != LastTaskExecuted) {
			value.wait++

			TaskUpdatedEvent.task = value
			window.dispatchEvent(TaskUpdatedEvent)
		}
	})
}

function returnTask(TaskToReturn) {
	/* Removes any task with a burst time equal to 0
	from the PCB, to not have zombies in the PCB */

	PCB = PCB.filter((value) => { return value != TaskToReturn })
	TaskToReturn.turnArround = clockTime
	Returned.push(TaskToReturn)
	targetTask = undefined

	TaskUpdatedEvent.task = TaskToReturn
	window.dispatchEvent(TaskUpdatedEvent)
}

function jobScheduler() {
	/* Just like the actual thing, the job scheduler
	decides when to promote a program to a process */

	for (const Job of JCB) {
		if (Job.arrival < clockTime) {
			JCB = JCB.filter((value) => { return value != Job })
			PCB.push(Job)
			
			ProgramAdmittedEvent.task = Job
			window.dispatchEvent(ProgramAdmittedEvent)
		}
	}
}

function advanceClock() {
	/* Simulates the increase of the clock cycle, contains
	all functions that need to run in a cycle */

	if (clockTime == 0) {
		JCB = ToSimulate
		window.dispatchEvent(SimulationResetEvent)
		clockTime++
		return
	}

	clockTime++
	window.dispatchEvent(ClockAdvanceEvent)

	jobScheduler()
	taskSchedulerNonPreemtiveFCFS()
}

function taskSchedulerNonPreemtiveFCFS() {
	/* Selects which task to feed the CPU
	with, based on a FCFS algorithm */
	
	if (targetTask == undefined) {
		// PCB.sort((a, b) => { return a.arrival - b.arrival })
		targetTask = PCB[0]
	}

	CPU(targetTask)
}

function taskSchedulerNonPreemtiveSJF() {
	/* Selects which task to feed the CPU
	with, based on a SJF algorithm */

	if (targetTask == undefined) {
		PCB.sort((a, b) => { return a.burst - b.burst })
		targetTask = PCB[0]
	}

	CPU(targetTask)
}

function taskSchedulerPreemtiveSTRF() {
	/* Selects which task to feed the CPU
	with, based on a STRF algorithm */

	PCB.sort((a, b) => { return a.burst - b.burst })
	targetTask = PCB[0]

	CPU(targetTask)
}

function taskSchedulerPreemtiveSmartSTRF() {
	/* Selects which task to feed the CPU
	with, based on a tweaked STRF algorithm */

	PCB.sort((a, b) => { return a.burst - (b.burst + ContextSwitchTime)})
	targetTask = PCB[0]

	CPU(targetTask)
}

function taskSchedulerPreemtiveRoundRobin() {
	/* Selects which task to feed the CPU
	with, based on a Round Robin algorithm */

	if (targetTask == undefined) {
		PCB.sort((a, b) => { return a.streak - b.streak })
		if (PCB[0].streak > 0) {
			PCB.forEach((value) => { value.streak = 0 })
			PCB.reverse()
		}
		targetTask = PCB[0]
	} else if (targetTask.streak >= RoundRobinBurstWindow) {
		PCB.sort((a, b) => { return a.streak - b.streak })
		if (PCB[0].streak > 0) {
			PCB.forEach((value) => { value.streak = 0 })
			PCB.reverse()
		}
		targetTask = PCB[0]
	}

	CPU(targetTask)
}

function taskSchedulerNonPreemtivePriority() {
	/* Selects which task to feed the CPU
	with, based on a Priority algorithm */
	
	if (targetTask == undefined) {
		PCB.sort((a, b) => { return a.priority - b.priority })
		targetTask = PCB[0]
	}

	CPU(targetTask)
}

function taskSchedulerPreemtivePriority() {
	/* Selects which task to feed the CPU
	with, based on a Priority algorithm */
	
	PCB.sort((a, b) => { return a.priority - b.priority })
	targetTask = PCB[0]

	CPU(targetTask)
}

new Process(3, 10, 0)
new Process(0, 6, 2)
new Process(6, 34, 1)
new Process(9, 2, 4)

setInterval(advanceClock, 1000)