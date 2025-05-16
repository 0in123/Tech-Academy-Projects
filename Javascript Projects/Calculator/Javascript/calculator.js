// Creates an object to keep track of values
const Calculator = {
    // This will display 0 on the calculator screen.
    Display_Value: '0',
    // This will hold the first operand for any expressions, set to null for now.
    First_Operand: null,
    // This checks whether or not the second operand has been input by the user.
    Wait_Second_Operand: false,
    // This will hold the operator, set to null for now.
    operator: null,
};

// This modifies values each time a button is clicked.
function Input_Digit(digit) {
    const { Display_Value, Wait_Second_Operand } = Calculator;

    // Check if waiting for the second operand
    if (Wait_Second_Operand === true) {
        Calculator.Display_Value = digit;
        Calculator.Wait_Second_Operand = false;
    } else {
        // Overwrite Display_Value if current value is 0, otherwise append
        Calculator.Display_Value = Display_Value === '0' ? digit : Display_Value + digit;
    }
}

// This section handles decimal points.
function Input_Decimal(dot) {
    // Prevent adding decimal if waiting for second operand
    if (Calculator.Wait_Second_Operand === true) return;
    if (!Calculator.Display_Value.includes(dot)) {
        // If the Display_Value does not contain a decimal point, add it
        Calculator.Display_Value += dot;
    }

}



// This section handles operators
function Handle_Operator(Next_Operator) {
    const { First_Operand, Display_Value, operator } = Calculator;

    // Convert the current Display_Value to a number
    const Value_of_Input = parseFloat(Display_Value);

    // If an operator exists and Wait_Second_Operand is true,
    // update the operator and exit the function
    if (operator && Calculator.Wait_Second_Operand) {
        Calculator.operator = Next_Operator;
        return;
    }

    // If First_Operand is null, set it to the input value
    if (First_Operand == null) {
        Calculator.First_Operand = Value_of_Input;
    } else if (operator) {
        // Perform the calculation using the existing operator
        const Value_Now = First_Operand || 0;
        // Define a function to perform the calculation
        let result = Perform_Calculation[operator](Value_Now, Value_of_Input);

        // Round the result and remove trailing zeroes
        result = Number(result).toFixed(9);
        result = (result * 1).toString();

        Calculator.Display_Value = parseFloat(result);
        Calculator.First_Operand = parseFloat(result);
    }
    Calculator.Wait_Second_Operand = true;
    Calculator.operator = Next_Operator;
}

// Defines the calculation logic for each operator
const Perform_Calculation = {
    '/': (First_Operand, Second_Operand) => First_Operand / Second_Operand,
    '*': (First_Operand, Second_Operand) => First_Operand * Second_Operand,
    '+': (First_Operand, Second_Operand) => First_Operand + Second_Operand,
    '-': (First_Operand, Second_Operand) => First_Operand - Second_Operand,
    '=': (First_Operand, Second_Operand) => Second_Operand
};

// Resets the calculator to its initial state
function Calculator_Reset() {
    Calculator.Display_Value = '0';
    Calculator.First_Operand = null;
    Calculator.Wait_Second_Operand = false;
    Calculator.operator = null;
}

// This function updates the calculator screen with the current Display_Value
function Update_Display() {
    // Targets the input element with the calculator-screen class
    const display = document.querySelector('.calculator-screen');
    display.value = Calculator.Display_Value;
}

Update_Display();
// This section monitors button clicks
const keys = document.querySelector('.calculator-keys');

keys.addEventListener('click', (event) => {
    // The target variable is an object that represents the clicked element
    const { target } = event;

    // If the clicked element is not a button, exit the function
    if (!target.matches('button')) {
        return;
    }

    // Handle operator buttons
    if (target.classList.contains('operator')) {
        Handle_Operator(target.value);
        Update_Display();
        return;
    }

    // Handle decimal point input
    if (target.classList.contains('decimal')) {
        Input_Decimal(target.value);
        Update_Display();
        return;
    }

    // Handle all-clear button
    if (target.classList.contains('all-clear')) {
        Calculator_Reset();
        Update_Display();
        return;
    }

    // Handle digit input
    Input_Digit(target.value);
    Update_Display();
});

