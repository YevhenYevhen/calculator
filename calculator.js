class Calculator {
	constructor(previousOperandTextElement, currentOperandTextElement) {
		this.previousOperandTextElement = previousOperandTextElement;
		this.currentOperandTextElement = currentOperandTextElement;
		this.clear();
	}
	clear() {
		this.currentOperand = '';
		this.previousOperand = '';
		this.operation = null;
	}
	appendNumber(number, limit) {
		if(this.currentOperand.toString().length > limit) return
		if (number === '.' && this.currentOperand.toString().includes('.')) return
		if (number === '.' && !this.currentOperand.toString().length) this.currentOperand += '0'
		this.currentOperand = this.currentOperand.toString() + number.toString();
	}
	toggleNegative() {
		if(!this.currentOperand) return
		this.currentOperand.toString().includes('-')
			? this.currentOperand = this.currentOperand.toString().slice(1)
			: this.currentOperand = `-${this.currentOperand}`
	}
	getPercent() {
		!this.previousOperand
			? this.currentOperand = this.currentOperand / 100
			: this.currentOperand = this.currentOperand * this.previousOperand / 100
	}
	chooseOperation(operation) {
		if (this.currentOperand === '') return
		if (this.previousOperand !== '') {
			this.compute()
		}
		this.operation = operation;
		this.previousOperand = this.currentOperand;
		this.currentOperand = '';
	 }
	compute() {
		let computation;
		const prev = parseFloat(this.previousOperand)
		const current = parseFloat(this.currentOperand)
		if (isNaN(prev) || isNaN(current)) return
		switch (this.operation) {
			case '+':
				computation = prev + current;
				break;
			case '-':
				computation = prev - current;
				break;
			case 'x':
				computation = prev * current;
				break;
			case '/':
				computation = prev / current;
				break;
			default: return;
		}
		this.currentOperand = computation;
		this.operation = null;
		this.previousOperand = '';
	}
	getDisplayNumber(number) {
		const stringNumber = number.toString();
		const integerDigits = parseFloat(stringNumber.split('.')[0])
		const decimalDigits = stringNumber.split('.')[1]
		let integerDisplay;
		isNaN(integerDigits) ? integerDisplay = '' : integerDisplay = integerDigits.toLocaleString('en', {maximumFractionDigits: 0})
		return decimalDigits != null ? `${integerDisplay}.${decimalDigits}` : integerDisplay
	}
	updateDisplay() {
		this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);
		this.operation !== null
			? this.previousOperandTextElement.innerText = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`
			: this.previousOperandTextElement.innerText = '';
	}
}

const numberButtons = document.querySelectorAll('[data-numbers]')
const operatorButtons = document.querySelectorAll('[data-operator]')
const allClearButton = document.querySelector('[data-all-clear]')
const percentButton = document.querySelector('[data-percent]')
const equalsButton = document.querySelector('[data-equals]')
const currentOperandTextElement = document.querySelector('[data-current-operand]')
const previousOperandTextElement = document.querySelector('[data-previous-operand]')
const toggleNegativeButton = document.querySelector('[data-toggle-negative]')



const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

numberButtons.forEach(button => button.addEventListener('click', () => {
		const prevOperandLength = previousOperandTextElement.innerText.length;
		toggleAttribute(currentOperandTextElement, prevOperandLength)
		toggleAttribute(previousOperandTextElement, prevOperandLength)
		calculator.appendNumber(button.innerText, 9)
		calculator.updateDisplay()
	})
)

operatorButtons.forEach(button => button.addEventListener('click', () => {
	calculator.chooseOperation(button.innerText)
	calculator.updateDisplay()
})
)

equalsButton.addEventListener('click', button => {
	calculator.compute();
	calculator.updateDisplay();
})

allClearButton.addEventListener('click', button => {
	calculator.clear();
	calculator.updateDisplay();
})

toggleNegativeButton.addEventListener('click', () => {
	calculator.toggleNegative();
	calculator.updateDisplay();
})

percentButton.addEventListener('click', () => {
	calculator.getPercent()
	calculator.updateDisplay()
})

function toggleAttribute(element, prevOperandLength) {
	let className = element.getAttribute('class')
	if (element.innerText.length >= 7 || prevOperandLength >= 7) {
		!className.includes('big-number') ? className += ' big-number' : className = className
		element.setAttribute('class', className)
	} else if (element.innerText.length <= 7) {
		className = className.split(' ')[0]
		element.setAttribute('class', className)
	}
}